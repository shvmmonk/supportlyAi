package com.shivam.supportlyAi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.dto.ChatMessageResponse;
import com.shivam.supportlyAi.dto.ConversationResponse;
import com.shivam.supportlyAi.service.ConversationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/conversations")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getConversations() {
        List<ConversationResponse> response = conversationService.getConversationsForCurrentUser();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(@PathVariable Long conversationId) {
        List<ChatMessageResponse> response = conversationService.getMessagesForConversation(conversationId);
        return ResponseEntity.ok(response);
    }
}
