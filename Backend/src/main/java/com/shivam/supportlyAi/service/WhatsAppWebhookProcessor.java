package com.shivam.supportlyAi.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.AgentStatus;
import com.shivam.supportlyAi.entity.ChatMessage;
import com.shivam.supportlyAi.entity.Conversation;
import com.shivam.supportlyAi.entity.MessageDirection;
import com.shivam.supportlyAi.entity.MessageStatus;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.entity.WhatsAppIntegration;
import com.shivam.supportlyAi.repository.AgentRepository;
import com.shivam.supportlyAi.repository.ChatMessageRepository;
import com.shivam.supportlyAi.repository.ConversationRepository;
import com.shivam.supportlyAi.repository.WhatsAppIntegrationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhatsAppWebhookProcessor {

    private final RagAnswerService ragAnswerService;
    private final MetaWhatsAppService metaWhatsAppService;
    private final WhatsAppIntegrationRepository integrationRepository;
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final AgentRepository agentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${meta.whatsapp.phone-number-id:}")
    private String defaultPhoneNumberId;

    // Cache of processed Meta message IDs for immediate duplicate protection
    private final Set<String> processedMessageIds = Collections.newSetFromMap(new ConcurrentHashMap<>());

    // Regex to match dummy or sample numbers like 1234567890, 0000000000, 1111111111, test numbers
    private static final Pattern SAMPLE_PHONE_PATTERN = Pattern.compile("^(0{6,}|1{6,}|1234567890|(\\+?0000.*))$");

    @Async
    public void processWebhookAsync(String rawPayload) {
        try {
            JsonNode payload = objectMapper.readTree(rawPayload);

            for (JsonNode entry : payload.path("entry")) {
                for (JsonNode change : entry.path("changes")) {
                    JsonNode value = change.path("value");

                    // 1. Handle Meta Delivery Status Updates
                    handleStatusUpdates(value.path("statuses"));

                    // 2. Handle Incoming Messages
                    handleIncomingMessages(value);
                }
            }
        } catch (Exception e) {
            log.error("Error processing Meta webhook payload: {}", e.getMessage(), e);
        }
    }

    private void handleStatusUpdates(JsonNode statusesNode) {
        if (!statusesNode.isArray()) return;

        for (JsonNode statusNode : statusesNode) {
            String messageId = statusNode.path("id").asText();
            String statusStr = statusNode.path("status").asText();

            if (messageId.isBlank() || statusStr.isBlank()) continue;

            chatMessageRepository.findByMetaMessageId(messageId).ifPresent(message -> {
                switch (statusStr.toLowerCase()) {
                    case "delivered" -> message.setStatus(MessageStatus.DELIVERED);
                    case "read" -> message.setStatus(MessageStatus.READ);
                    case "failed" -> message.setStatus(MessageStatus.FAILED);
                    case "sent" -> {
                        if (message.getStatus() == MessageStatus.RECEIVED) {
                            message.setStatus(MessageStatus.SENT);
                        }
                    }
                }
                chatMessageRepository.save(message);
                log.info("Updated message {} status to {}", messageId, statusStr);
            });
        }
    }

    private void handleIncomingMessages(JsonNode valueNode) {
        String phoneNumberId = valueNode.path("metadata").path("phone_number_id").asText();
        if (phoneNumberId.isBlank()) {
            phoneNumberId = defaultPhoneNumberId;
        }

        JsonNode messagesNode = valueNode.path("messages");
        if (!messagesNode.isArray()) return;

        for (JsonNode message : messagesNode) {
            String messageId = message.path("id").asText();
            String messageType = message.path("type").asText();

            // Webhook Reliability: Deduplication Check
            if (isDuplicateMessage(messageId)) {
                log.info("Duplicate webhook message detected, skipping: {}", messageId);
                continue;
            }

            // Webhook Reliability: Handle unsupported event types safely
            if (!"text".equalsIgnoreCase(messageType)) {
                log.info("Ignoring unsupported message type '{}' for message ID {}", messageType, messageId);
                continue;
            }

            String from = message.path("from").asText();
            String body = message.path("text").path("body").asText();

            if (from.isBlank() || body.isBlank()) {
                continue;
            }

            // Webhook Reliability: Avoid replying to dashboard-generated sample phone numbers
            if (isSampleOrDummyNumber(from)) {
                log.warn("Skipping reply to dashboard-generated/sample phone number: {}", from);
                continue;
            }

            // Mark message ID as processed
            recordProcessedMessageId(messageId);

            processAndReply(phoneNumberId, messageId, from, body);
        }
    }

    @Transactional
    public void processAndReply(String phoneNumberId, String messageId, String from, String body) {
        try {
            // Task 5: Dynamic Agent Mapping: Business -> WhatsApp Phone Number ID -> AI Agent
            Agent agent = resolveAgent(phoneNumberId);
            if (agent == null) {
                log.warn("No active AI agent mapped for phone_number_id: {}. Cannot generate reply.", phoneNumberId);
                return;
            }

            User businessOwner = agent.getOwner();

            // Find or create conversation for this business and customer
            Conversation conversation = conversationRepository
                    .findByBusinessOwnerAndCustomerPhone(businessOwner, from)
                    .orElseGet(() -> {
                        Conversation c = new Conversation();
                        c.setBusinessOwner(businessOwner);
                        c.setCustomerPhone(from);
                        c.setCustomerName("WhatsApp Customer (" + from + ")");
                        c.setAgent(agent);
                        c.setCreatedAt(LocalDateTime.now());
                        return c;
                    });

            conversation.setAgent(agent);
            conversation.setLastMessage(body);
            conversation.setLastMessageAt(LocalDateTime.now());
            Conversation savedConversation = conversationRepository.save(conversation);

            // Record incoming message in DB
            ChatMessage incomingMessage = new ChatMessage();
            incomingMessage.setConversation(savedConversation);
            incomingMessage.setDirection(MessageDirection.INCOMING);
            incomingMessage.setContent(body);
            incomingMessage.setStatus(MessageStatus.RECEIVED);
            incomingMessage.setMetaMessageId(messageId);
            incomingMessage.setTimestamp(LocalDateTime.now());
            chatMessageRepository.save(incomingMessage);

            // Generate RAG answer grounded on agent's FAQ knowledge
            String answer = ragAnswerService.answerQuestion(body, agent.getId());

            // Send Meta WhatsApp reply with error handling and retry
            sendReplyAndRecord(savedConversation, from, answer);

        } catch (Exception e) {
            log.error("Failed to process message and generate reply: {}", e.getMessage(), e);
        }
    }

    private void sendReplyAndRecord(Conversation conversation, String to, String answer) {
        ChatMessage outgoingMessage = new ChatMessage();
        outgoingMessage.setConversation(conversation);
        outgoingMessage.setDirection(MessageDirection.OUTGOING);
        outgoingMessage.setContent(answer);
        outgoingMessage.setTimestamp(LocalDateTime.now());

        boolean sentSuccessfully = false;
        int maxRetries = 2;
        Exception lastException = null;

        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                metaWhatsAppService.sendMessage(to, answer);
                sentSuccessfully = true;
                break;
            } catch (Exception e) {
                lastException = e;
                log.warn("Attempt {} to send WhatsApp message to {} failed: {}", attempt, to, e.getMessage());
                try {
                    Thread.sleep(500);
                } catch (InterruptedException ignored) {}
            }
        }

        if (sentSuccessfully) {
            outgoingMessage.setStatus(MessageStatus.SENT);
            log.info("Successfully sent WhatsApp reply to {}", to);
        } else {
            outgoingMessage.setStatus(MessageStatus.FAILED);
            log.error("Failed to send WhatsApp message to {} after {} attempts: {}", to, maxRetries,
                    lastException != null ? lastException.getMessage() : "Unknown error");
        }

        chatMessageRepository.save(outgoingMessage);

        // Update conversation with latest reply
        conversation.setLastMessage(answer);
        conversation.setLastMessageAt(LocalDateTime.now());
        conversationRepository.save(conversation);
    }

    private Agent resolveAgent(String phoneNumberId) {
        if (phoneNumberId != null && !phoneNumberId.isBlank()) {
            var opt = integrationRepository.findByPhoneNumberId(phoneNumberId);
            if (opt.isPresent() && opt.get().isActive() && opt.get().getAgent() != null) {
                Agent agent = opt.get().getAgent();
                if (agent.getStatus() == AgentStatus.ACTIVE) {
                    return agent;
                } else {
                    log.info("Mapped agent {} is currently INACTIVE", agent.getId());
                }
            }
        }

        // Fallback: Check if agent 13L exists (preserves existing tested Medical Store agent)
        var fallbackAgent = agentRepository.findById(13L);
        if (fallbackAgent.isPresent()) {
            return fallbackAgent.get();
        }

        // Fallback 2: Any active agent
        return agentRepository.findAll().stream()
                .filter(a -> a.getStatus() == AgentStatus.ACTIVE)
                .findFirst()
                .orElse(null);
    }

    private boolean isDuplicateMessage(String messageId) {
        if (messageId == null || messageId.isBlank()) return false;
        if (processedMessageIds.contains(messageId)) return true;
        return chatMessageRepository.existsByMetaMessageId(messageId);
    }

    private void recordProcessedMessageId(String messageId) {
        if (messageId != null && !messageId.isBlank()) {
            processedMessageIds.add(messageId);
            // Limit in-memory set size to avoid memory growth
            if (processedMessageIds.size() > 5000) {
                processedMessageIds.clear();
            }
        }
    }

    private boolean isSampleOrDummyNumber(String from) {
        if (from == null || from.isBlank()) return true;
        return SAMPLE_PHONE_PATTERN.matcher(from).matches();
    }
}
