package com.shivam.supportlyAi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhatsAppIntegrationStatusResponse {
    private boolean connected;
    private String mode; // "TEST" or "PRODUCTION"
    private String phoneNumberId;
    private String displayPhoneNumber;
    private Long assignedAgentId;
    private String assignedAgentName;
    private String status; // "ACTIVE", "NOT_CONFIGURED", "DISCONNECTED"
    private boolean verified;
}
