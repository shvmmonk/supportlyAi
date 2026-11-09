package com.shivam.supportlyAi.service;

import com.shivam.supportlyAi.entity.*;
import com.shivam.supportlyAi.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.SimpleTransactionStatus;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class WhatsAppWebhookProcessorTest {
    private RagAnswerService rag;
    private MetaWhatsAppService meta;
    private WhatsAppIntegrationRepository integrations;
    private ConversationRepository conversations;
    private ChatMessageRepository messages;
    private WhatsAppWebhookProcessor processor;

    @BeforeEach
    void setup() {
        rag = mock(RagAnswerService.class);
        meta = mock(MetaWhatsAppService.class);
        integrations = mock(WhatsAppIntegrationRepository.class);
        conversations = mock(ConversationRepository.class);
        messages = mock(ChatMessageRepository.class);
        PlatformTransactionManager manager = mock(PlatformTransactionManager.class);
        when(manager.getTransaction(any())).thenAnswer(inv -> new SimpleTransactionStatus());
        processor = new WhatsAppWebhookProcessor(rag, meta, integrations, conversations, messages, manager);
    }

    private void status(String id, String value) {
        processor.processWebhookAsync("{\"entry\":[{\"changes\":[{\"value\":{\"statuses\":[{\"id\":\"" + id + "\",\"status\":\"" + value + "\"}]}}]}]}");
    }

    @Test
    void deliveredThenReadNeverDowngradesToDelivered() {
        ChatMessage message = new ChatMessage();
        message.setDirection(MessageDirection.OUTGOING);
        message.setStatus(MessageStatus.SENT);
        when(messages.findByMetaMessageIdForUpdate("wamid.out.1")).thenReturn(Optional.of(message));
        status("wamid.out.1", "delivered");
        assertEquals(MessageStatus.DELIVERED, message.getStatus());
        status("wamid.out.1", "read");
        assertEquals(MessageStatus.READ, message.getStatus());
        status("wamid.out.1", "delivered");
        status("wamid.out.1", "sent");
        assertEquals(MessageStatus.READ, message.getStatus());
    }

    @Test
    void incomingMessagesAreNeverModifiedByOutgoingStatusCallbacks() {
        ChatMessage message = new ChatMessage();
        message.setDirection(MessageDirection.INCOMING);
        message.setStatus(MessageStatus.RECEIVED);
        when(messages.findByMetaMessageIdForUpdate("wamid.in.1")).thenReturn(Optional.of(message));
        status("wamid.in.1", "read");
        assertEquals(MessageStatus.RECEIVED, message.getStatus());
        verify(messages, never()).save(any(ChatMessage.class));
    }

    @Test
    void unknownStatusDoesNotModifyMessage() {
        ChatMessage message = new ChatMessage();
        message.setDirection(MessageDirection.OUTGOING);
        message.setStatus(MessageStatus.SENT);
        when(messages.findByMetaMessageIdForUpdate("wamid.out.2")).thenReturn(Optional.of(message));
        status("wamid.out.2", "unknown_status");
        assertEquals(MessageStatus.SENT, message.getStatus());
        verify(messages, never()).save(any(ChatMessage.class));
    }

    @Test
    void missingIntegrationDoesNotGenerateOrSendReply() {
        when(integrations.findByPhoneNumberId("unmapped-phone")).thenReturn(Optional.empty());
        processor.processAndReply("unmapped-phone", "wamid.in.2", "919876543210", "hello");
        verifyNoInteractions(rag, meta, conversations, messages);
    }

    @Test
    void crossTenantAgentMappingDoesNotGenerateOrSendReply() {
        User integrationOwner = mock(User.class);
        User agentOwner = mock(User.class);
        when(integrationOwner.getId()).thenReturn(1L);
        when(agentOwner.getId()).thenReturn(2L);
        Agent agent = mock(Agent.class);
        when(agent.getOwner()).thenReturn(agentOwner);
        when(agent.getStatus()).thenReturn(AgentStatus.ACTIVE);
        WhatsAppIntegration integration = mock(WhatsAppIntegration.class);
        when(integration.isActive()).thenReturn(true);
        when(integration.getAgent()).thenReturn(agent);
        when(integration.getBusinessOwner()).thenReturn(integrationOwner);
        when(integrations.findByPhoneNumberId("phone-A")).thenReturn(Optional.of(integration));
        processor.processAndReply("phone-A", "wamid.in.3", "919876543210", "hello");
        verifyNoInteractions(rag, meta, conversations, messages);
    }

    @Test
    void databaseClaimFailureNeverSendsReply() {
        User owner = mock(User.class);
        Agent agent = mock(Agent.class);
        when(agent.getOwner()).thenReturn(owner);
        when(agent.getStatus()).thenReturn(AgentStatus.ACTIVE);
        when(owner.getId()).thenReturn(1L);
        WhatsAppIntegration integration = mock(WhatsAppIntegration.class);
        when(integration.isActive()).thenReturn(true);
        when(integration.getAgent()).thenReturn(agent);
        when(integration.getBusinessOwner()).thenReturn(owner);
        when(integrations.findByPhoneNumberId("phone-A")).thenReturn(Optional.of(integration));
        when(conversations.findByBusinessOwnerAndCustomerPhone(eq(owner), anyString())).thenReturn(Optional.empty());
        when(conversations.save(any(Conversation.class))).thenAnswer(inv -> inv.getArgument(0));
        when(messages.saveAndFlush(any(ChatMessage.class))).thenThrow(new DataIntegrityViolationException("Duplicate Meta ID"));
        processor.processAndReply("phone-A", "wamid.duplicate", "919876543210", "hello");
        verifyNoInteractions(rag, meta);
    }
}
