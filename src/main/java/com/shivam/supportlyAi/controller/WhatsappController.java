package com.shivam.supportlyAi.controller;

import org.springframework.web.bind.annotation.*;

import com.shivam.supportlyAi.service.WhatsAppService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
public class WhatsappController {

    private final WhatsAppService whatsAppService;

    @PostMapping("/test-send")
    public String testSend(@RequestParam String to, @RequestParam String message) throws Exception {
        whatsAppService.sendMessage(to, message);
        return "Message sent!";
    }

    @PostMapping("/webhook")
    public String recieveMessage(
            @RequestParam("From") String from,
            @RequestParam("Body") String body) throws Exception {

        System.out.println("Message from: " + from);
        System.out.println("Message body: " + body);

        whatsAppService.sendMessage(
                from.replace("whatsapp:", ""),
                body);

        return "OK";
    }
}