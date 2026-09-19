package com.shivam.supportlyAi.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AiController {

    private final ChatClient chatClient;

    public AiController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @GetMapping("/api/ai/test")
    public String testAi() {

        return chatClient
                .prompt()
                .user("Say hello to SupportlyAI in one short sentence.")
                .call()
                .content();
    }
}