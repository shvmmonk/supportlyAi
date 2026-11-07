package com.shivam.supportlyAi.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.exception.ResourceNotFoundException;
import com.shivam.supportlyAi.exception.UnauthorizedAccessException;
import com.shivam.supportlyAi.repository.AgentRepository;
import com.shivam.supportlyAi.repository.UserRepository;
import com.shivam.supportlyAi.service.RagAnswerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class RagTestController {

    private final RagAnswerService ragAnswerService;
    private final AgentRepository agentRepository;
    private final UserRepository userRepository;

    @GetMapping("/{agentId}/rag/answer")
    public String answer(
            @PathVariable Long agentId,
            @RequestParam String question
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        if (!agent.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to test this agent");
        }

        return ragAnswerService.answerQuestion(question, agentId);
    }
}
