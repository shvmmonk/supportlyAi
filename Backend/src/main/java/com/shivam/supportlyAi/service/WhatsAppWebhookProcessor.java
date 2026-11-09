package com.shivam.supportlyAi.service;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.AgentStatus;
import com.shivam.supportlyAi.entity.ChatMessage;
import com.shivam.supportlyAi.entity.Conversation;
import com.shivam.supportlyAi.entity.MessageDirection;
import com.shivam.supportlyAi.entity.MessageStatus;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.repository.ChatMessageRepository;
import com.shivam.supportlyAi.repository.ConversationRepository;
import com.shivam.supportlyAi.repository.WhatsAppIntegrationRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class WhatsAppWebhookProcessor {
    private final RagAnswerService ragAnswerService;
    private final MetaWhatsAppService metaWhatsAppService;
    private final WhatsAppIntegrationRepository integrationRepository;
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final TransactionTemplate transactionTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${meta.whatsapp.phone-number-id:}")
    private String defaultPhoneNumberId;

    private static final Pattern SAMPLE_PHONE_PATTERN =
            Pattern.compile("^(0{6,}|1{6,}|1234567890|(\\+?0000.*))$");

    public WhatsAppWebhookProcessor(RagAnswerService ragAnswerService,
                                   MetaWhatsAppService metaWhatsAppService,
                                   WhatsAppIntegrationRepository integrationRepository,
                                   ConversationRepository conversationRepository,
                                   ChatMessageRepository chatMessageRepository,
                                   PlatformTransactionManager transactionManager) {
        this.ragAnswerService = ragAnswerService;
        this.metaWhatsAppService = metaWhatsAppService;
        this.integrationRepository = integrationRepository;
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    @Async
    public void processWebhookAsync(String rawPayload) {
        try {
            JsonNode payload = objectMapper.readTree(rawPayload);
            for (JsonNode entry : payload.path("entry")) {
                for (JsonNode change : entry.path("changes")) {
                    JsonNode value = change.path("value");
                    handleStatusUpdates(value.path("statuses"));
                    handleIncomingMessages(value);
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse/process WhatsApp webhook", e);
        }
    }

    private void handleStatusUpdates(JsonNode statuses) {
        if (!statuses.isArray()) return;
        for (JsonNode node : statuses) {
            String messageId = node.path("id").asText("");
            String event = node.path("status").asText("").toLowerCase(java.util.Locale.ROOT);
            if (messageId.isBlank()) continue;
            try {
                transactionTemplate.executeWithoutResult(tx -> {
                    chatMessageRepository.findByMetaMessageIdForUpdate(messageId).ifPresent(message -> {
                        if (message.getDirection() != MessageDirection.OUTGOING) return;
                        MessageStatus current = message.getStatus();
                        MessageStatus next = switch (event) {
                            case "sent" ->
                                    current == MessageStatus.PENDING
                                            || current == MessageStatus.UNKNOWN
                                            ? MessageStatus.SENT : current;
                            case "delivered" ->
                                    current == MessageStatus.READ
                                            ? current : MessageStatus.DELIVERED;
                            case "read" -> MessageStatus.READ;
                            case "failed" ->
                                    current == MessageStatus.READ
                                            || current == MessageStatus.DELIVERED
                                            ? current : MessageStatus.FAILED;
                            default -> current;
                        };
                        if (next != current) {
                            message.setStatus(next);
                            chatMessageRepository.save(message);
                        }
                    });
                });
            } catch (Exception e) {
                log.error("Failed to update status for Meta message {}", messageId, e);
            }
        }
    }

    private void handleIncomingMessages(JsonNode value) {
        String phoneNumberId = value.path("metadata").path("phone_number_id").asText("");
        if (phoneNumberId.isBlank()) phoneNumberId = defaultPhoneNumberId;
        JsonNode messages = value.path("messages");
        if (!messages.isArray()) return;
        for (JsonNode message : messages) {
            String messageId = message.path("id").asText("");
            if (messageId.isBlank() || !"text".equalsIgnoreCase(message.path("type").asText(""))) continue;
            String from = message.path("from").asText("");
            String body = message.path("text").path("body").asText("");
            if (from.isBlank() || body.isBlank() || SAMPLE_PHONE_PATTERN.matcher(from).matches()) continue;
            processAndReply(phoneNumberId, messageId, from, body);
        }
    }

    // Deliberately not @Transactional: each DB operation uses a separate, real transaction.
    // Meta network calls and RAG execution must not hold a database transaction open.
    public void processAndReply(String phoneNumberId, String messageId, String from, String body) {
        if (messageId == null || messageId.isBlank()) {
            log.warn("Ignoring incoming WhatsApp message without Meta ID");
            return;
        }
        Agent agent = resolveAgent(phoneNumberId);
        if (agent == null) return;

        Long conversationId;
        try {
            conversationId = transactionTemplate.execute(tx -> {
                User owner = agent.getOwner();
                Conversation conversation = conversationRepository
                        .findByBusinessOwnerAndCustomerPhone(owner, from)
                        .orElseGet(() -> {
                            Conversation created = new Conversation();
                            created.setBusinessOwner(owner);
                            created.setCustomerPhone(from);
                            created.setCustomerName("WhatsApp Customer (" + from + ")");
                            created.setAgent(agent);
                            created.setCreatedAt(LocalDateTime.now());
                            return created;
                        });
                conversation.setAgent(agent);
                conversation.setLastMessage(body);
                conversation.setLastMessageAt(LocalDateTime.now());
                Conversation saved = conversationRepository.save(conversation);

                ChatMessage incoming = new ChatMessage();
                incoming.setConversation(saved);
                incoming.setDirection(MessageDirection.INCOMING);
                incoming.setContent(body);
                incoming.setStatus(MessageStatus.RECEIVED);
                incoming.setMetaMessageId(messageId);
                incoming.setTimestamp(LocalDateTime.now());
                // Flush inside transaction: UNIQUE constraint atomically claims this Meta ID.
                chatMessageRepository.saveAndFlush(incoming);
                return saved.getId();
            });
        } catch (DataIntegrityViolationException duplicateOrConstraintError) {
            // Do not send a reply if the claim failed; log for diagnosing non-duplicate constraints.
            log.warn("Incoming message {} could not be claimed (duplicate or DB constraint): {}",
                    messageId, duplicateOrConstraintError.getMostSpecificCause().getMessage());
            return;
        } catch (Exception e) {
            log.error("Failed to persist incoming WhatsApp message {}", messageId, e);
            return;
        }
        if (conversationId == null) return;

        String answer;
        try {
            answer = ragAnswerService.answerQuestion(body, agent.getId());
            if (answer == null || answer.isBlank()) throw new IllegalStateException("RAG returned an empty reply");
        } catch (Exception e) {
            log.error("RAG failed for incoming message {}. Incoming message retained for manual recovery.", messageId, e);
            return;
        }

        // Persist the outgoing intent before calling Meta. Never blindly retry an ambiguous send.
        Long outgoingId;
        try {
            outgoingId = transactionTemplate.execute(tx -> {
                Conversation conversation = conversationRepository.findById(conversationId).orElseThrow();
                ChatMessage outgoing = new ChatMessage();
                outgoing.setConversation(conversation);
                outgoing.setDirection(MessageDirection.OUTGOING);
                outgoing.setContent(answer);
                outgoing.setStatus(MessageStatus.PENDING);
                outgoing.setTimestamp(LocalDateTime.now());
                return chatMessageRepository.saveAndFlush(outgoing).getId();
            });
        } catch (Exception e) {
            log.error("Could not persist outgoing intent for incoming message {}. Not sending.", messageId, e);
            return;
        }
        if (outgoingId == null) return;

        try {
            String metaId = metaWhatsAppService.sendMessageAndGetId(from, answer);
            transactionTemplate.executeWithoutResult(tx -> {
                ChatMessage outgoing = chatMessageRepository.findById(outgoingId).orElseThrow();
                outgoing.setMetaMessageId(metaId);
                if (outgoing.getStatus() == MessageStatus.PENDING
                        || outgoing.getStatus() == MessageStatus.UNKNOWN) {
                    outgoing.setStatus(MessageStatus.SENT);
                }
                chatMessageRepository.save(outgoing);
                Conversation conversation = outgoing.getConversation();
                conversation.setLastMessage(answer);
                conversation.setLastMessageAt(LocalDateTime.now());
                conversationRepository.save(conversation);
            });
            log.info("Meta accepted WhatsApp reply for incoming {} as {}", messageId, metaId);
        } catch (Exception e) {
            log.error("WhatsApp send/persistence uncertain for incoming {} and outgoing {}. "
                    + "Do not automatically retry without reconciliation.", messageId, outgoingId, e);
            try {
                transactionTemplate.executeWithoutResult(tx -> {
                    ChatMessage outgoing = chatMessageRepository.findById(outgoingId).orElseThrow();
                    if (outgoing.getMetaMessageId() == null
                            && (outgoing.getStatus() == MessageStatus.PENDING
                                    || outgoing.getStatus() == MessageStatus.SENT)) {
                        outgoing.setStatus(MessageStatus.UNKNOWN);
                        chatMessageRepository.save(outgoing);
                    }
                });
            } catch (Exception persistenceError) {
                log.error("Could not record uncertain delivery for outgoing {}", outgoingId, persistenceError);
            }
        }
    }

    private Agent resolveAgent(String phoneNumberId) {
        if (phoneNumberId == null || phoneNumberId.isBlank()) return null;
        return integrationRepository.findByPhoneNumberId(phoneNumberId)
                .filter(integration -> integration.isActive() && integration.getAgent() != null)
                .map(integration -> {
                    Agent agent = integration.getAgent();
                    if (agent.getStatus() != AgentStatus.ACTIVE
                            || agent.getOwner() == null || integration.getBusinessOwner() == null
                            || !agent.getOwner().getId().equals(integration.getBusinessOwner().getId())) {
                        log.warn("Rejecting invalid/inactive agent mapping for phone ID {}", phoneNumberId);
                        return null;
                    }
                    return agent;
                }).orElse(null);
    }
}
