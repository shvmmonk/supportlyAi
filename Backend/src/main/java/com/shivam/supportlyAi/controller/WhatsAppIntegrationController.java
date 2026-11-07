package com.shivam.supportlyAi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.dto.AssignWhatsAppAgentRequest;
import com.shivam.supportlyAi.dto.WhatsAppIntegrationStatusResponse;
import com.shivam.supportlyAi.service.WhatsAppIntegrationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/integrations/whatsapp")
@RequiredArgsConstructor
public class WhatsAppIntegrationController {

    private final WhatsAppIntegrationService integrationService;

    @GetMapping("/status")
    public ResponseEntity<WhatsAppIntegrationStatusResponse> getStatus() {
        WhatsAppIntegrationStatusResponse response = integrationService.getStatus();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/assign")
    public ResponseEntity<WhatsAppIntegrationStatusResponse> assignAgent(
            @Valid @RequestBody AssignWhatsAppAgentRequest request) {
        WhatsAppIntegrationStatusResponse response = integrationService.assignAgent(request);
        return ResponseEntity.ok(response);
    }
}
