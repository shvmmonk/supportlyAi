
package com.shivam.supportlyAi.controller;

import com.shivam.supportlyAi.service.RagAnswerService;
import com.shivam.supportlyAi.service.WhatsAppService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam("Body") String body) {

        String answer = ragAnswerService.answerQuestion(body, 13L);

        whatsAppService.sendMessage(from, answer);

        return "<Response></Response>";
    }
}
