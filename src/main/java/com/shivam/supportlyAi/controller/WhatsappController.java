package com.shivam.supportlyAi.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WhatsappController {

    @PostMapping(
            value = "/api/whatsapp/webhook",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = MediaType.APPLICATION_XML_VALUE
    )
    public String receiveMessage(
            @RequestParam("From") String from,
            @RequestParam("Body") String body
    ) {

        System.out.println("Message from: " + from);
        System.out.println("Message body: " + body);

        return """
                <?xml version="1.0" encoding="UTF-8"?>
                <Response>
                    <Message>Hello! SupportlyAI received your message.</Message>
                </Response>
                """;
    }
}