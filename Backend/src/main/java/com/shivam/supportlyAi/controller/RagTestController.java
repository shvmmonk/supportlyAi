package com.shivam.supportlyAi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.service.RagAnswerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class RagTestController {

    private final RagAnswerService ragAnswerService;

    @GetMapping("/{agentId}/rag/answer")
    public String answer(
            @PathVariable Long agentId,
            @RequestParam String question
    ) {
        return ragAnswerService.answerQuestion(question, agentId);
    }
}