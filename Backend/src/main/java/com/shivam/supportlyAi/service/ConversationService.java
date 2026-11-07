package com.shivam.supportlyAi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.shivam.supportlyAi.dto.ChatMessageResponse;
import com.shivam.supportlyAi.dto.ConversationResponse;
import com.shivam.supportlyAi.entity.ChatMessage;
import com.shivam.supportlyAi.entity.Conversation;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.exception.ResourceNotFoundException;
import com.shivam.supportlyAi.exception.UnauthorizedAccessException;
import com.shivam.supportlyAi.repository.ChatMessageRepository;
import com.shivam.supportlyAi.repository.ConversationRepository;
import com.shivam.supportlyAi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public List<ConversationResponse> getConversationsForCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Conversation> list = conversationRepository.findByBusinessOwnerOrderByLastMessageAtDesc(user);

        return list.stream().map(c -> ConversationResponse.builder()
                .id(c.getId())
                .customerPhone(c.getCustomerPhone())
                .customerName(c.getCustomerName())
                .agentId(c.getAgent() != null ? c.getAgent().getId() : null)
                .agentName(c.getAgent() != null ? c.getAgent().getName() : null)
                .lastMessage(c.getLastMessage())
                .lastMessageAt(c.getLastMessageAt())
                .createdAt(c.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }

    public List<ChatMessageResponse> getMessagesForConversation(Long conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with ID: " + conversationId));

        if (!conversation.getBusinessOwner().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to access messages for this conversation");
        }

        List<ChatMessage> messages = chatMessageRepository.findByConversationOrderByTimestampAsc(conversation);

        return messages.stream().map(m -> ChatMessageResponse.builder()
                .id(m.getId())
                .conversationId(conversation.getId())
                .direction(m.getDirection())
                .content(m.getContent())
                .status(m.getStatus())
                .metaMessageId(m.getMetaMessageId())
                .timestamp(m.getTimestamp())
                .build()
        ).collect(Collectors.toList());
    }
}
