package com.shivam.supportlyAi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.dto.DashboardSummaryResponse;
import com.shivam.supportlyAi.entity.AgentStatus;
import com.shivam.supportlyAi.entity.MessageDirection;
import com.shivam.supportlyAi.entity.MessageStatus;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.exception.ResourceNotFoundException;
import com.shivam.supportlyAi.repository.AgentRepository;
import com.shivam.supportlyAi.repository.ChatMessageRepository;
import com.shivam.supportlyAi.repository.ConversationRepository;
import com.shivam.supportlyAi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final AgentRepository agentRepository;
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalAgents = agentRepository.countByOwner(user);
        long activeAgents = agentRepository.countByOwnerAndStatus(user, AgentStatus.ACTIVE);
        long totalConversations = conversationRepository.countByBusinessOwner(user);
        long incomingMessages = chatMessageRepository.countByConversationBusinessOwnerAndDirection(user, MessageDirection.INCOMING);
        long outgoingMessages = chatMessageRepository.countByConversationBusinessOwnerAndDirection(user, MessageDirection.OUTGOING);
        long failedMessages = chatMessageRepository.countByConversationBusinessOwnerAndStatus(user, MessageStatus.FAILED);

        DashboardSummaryResponse response = DashboardSummaryResponse.builder()
                .totalAgents(totalAgents)
                .activeAgents(activeAgents)
                .totalConversations(totalConversations)
                .totalIncomingMessages(incomingMessages)
                .totalOutgoingMessages(outgoingMessages)
                .failedMessages(failedMessages)
                .build();

        return ResponseEntity.ok(response);
    }
}
