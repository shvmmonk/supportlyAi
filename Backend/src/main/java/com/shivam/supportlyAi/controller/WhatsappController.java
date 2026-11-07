package com.shivam.supportlyAi.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.service.RagAnswerService;
import com.shivam.supportlyAi.service.WhatsAppService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class WhatsappController {

    private final RagAnswerService ragAnswerService;
    private final WhatsAppService whatsAppService;

    @PostMapping(
            value = "/api/whatsapp/webhook",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE
    )
    public String receiveMessage(
            @RequestParam("From") String from,
            @RequestParam("Body") String body
    ) {

        System.out.println("Message from: " + from);
        System.out.println("Message body: " + body);

        // Temporary: using agentId = 1
        String answer = ragAnswerService.answerQuestion(body, 1L);

        // Send AI answer back to the customer through Twilio
        whatsAppService.sendMessage(from, answer);

        System.out.println("AI reply sent: " + answer);

        // No TwiML message here
        return "<Response></Response>";
    }
}