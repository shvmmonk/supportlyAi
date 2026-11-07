package com.shivam.supportlyAi.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.security.MetaWebhookSignatureVerifier;
import com.shivam.supportlyAi.service.WhatsAppWebhookProcessor;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/meta/whatsapp")
@RequiredArgsConstructor
public class MetaWhatsappController {

    private final WhatsAppWebhookProcessor webhookProcessor;
    private final MetaWebhookSignatureVerifier signatureVerifier;

    @Value("${meta.whatsapp.verify-token}")
    private String verifyToken;

    // Meta verifies the webhook URL using this endpoint
    @GetMapping("/webhook")
    public ResponseEntity<String> verifyWebhook(
            @RequestParam("hub.mode") String mode,
            @RequestParam("hub.verify_token") String token,
            @RequestParam("hub.challenge") String challenge) {

        if ("subscribe".equals(mode) && verifyToken.equals(token)) {
            return ResponseEntity.ok(challenge);
        }

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("Verification failed");
    }

    // Meta sends incoming WhatsApp messages here
    @PostMapping("/webhook")
    public ResponseEntity<Void> receiveMessage(
            @RequestHeader(value = "X-Hub-Signature-256", required = false) String signature,
            @RequestBody String rawPayload) {

        // Reject requests not signed by Meta
        if (!signatureVerifier.isValid(rawPayload, signature)) {
            log.warn("Invalid Meta webhook signature received: {}", signature);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Process message outside webhook thread to prevent timeout and duplicate retries
        webhookProcessor.processWebhookAsync(rawPayload);

        return ResponseEntity.ok().build();
    }
}
