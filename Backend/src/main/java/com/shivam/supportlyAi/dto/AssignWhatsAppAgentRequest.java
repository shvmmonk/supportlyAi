package com.shivam.supportlyAi.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignWhatsAppAgentRequest {

    @NotNull(message = "Agent ID cannot be null")
    private Long agentId;

    private String phoneNumberId;

    private String displayPhoneNumber;
}
