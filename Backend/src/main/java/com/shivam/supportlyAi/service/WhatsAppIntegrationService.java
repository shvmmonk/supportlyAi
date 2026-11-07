package com.shivam.supportlyAi.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shivam.supportlyAi.dto.AssignWhatsAppAgentRequest;
import com.shivam.supportlyAi.dto.WhatsAppIntegrationStatusResponse;
import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.entity.WhatsAppIntegration;
import com.shivam.supportlyAi.exception.ResourceNotFoundException;
import com.shivam.supportlyAi.exception.UnauthorizedAccessException;
import com.shivam.supportlyAi.repository.AgentRepository;
import com.shivam.supportlyAi.repository.UserRepository;
import com.shivam.supportlyAi.repository.WhatsAppIntegrationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WhatsAppIntegrationService {

    private final WhatsAppIntegrationRepository integrationRepository;
    private final AgentRepository agentRepository;
    private final UserRepository userRepository;

    @Value("${meta.whatsapp.phone-number-id:}")
    private String defaultPhoneNumberId;

    public WhatsAppIntegrationStatusResponse getStatus() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Optional<WhatsAppIntegration> opt = integrationRepository.findFirstByBusinessOwner(user);

        if (opt.isPresent()) {
            WhatsAppIntegration integration = opt.get();
            String rawId = integration.getPhoneNumberId();
            String masked = maskNumber(rawId);
            String display = integration.getDisplayPhoneNumber() != null ? maskPhoneNumber(integration.getDisplayPhoneNumber()) : masked;

            return WhatsAppIntegrationStatusResponse.builder()
                    .connected(integration.isActive())
                    .mode("PRODUCTION")
                    .phoneNumberId(masked)
                    .displayPhoneNumber(display)
                    .assignedAgentId(integration.getAgent() != null ? integration.getAgent().getId() : null)
                    .assignedAgentName(integration.getAgent() != null ? integration.getAgent().getName() : null)
                    .status(integration.isActive() ? "ACTIVE" : "DISCONNECTED")
                    .verified(integration.isVerified())
                    .build();
        }

        // Default or unconfigured
        String fallbackMasked = defaultPhoneNumberId != null && !defaultPhoneNumberId.isBlank()
                ? maskNumber(defaultPhoneNumberId)
                : null;

        return WhatsAppIntegrationStatusResponse.builder()
                .connected(false)
                .mode("TEST")
                .phoneNumberId(fallbackMasked)
                .displayPhoneNumber(fallbackMasked)
                .assignedAgentId(null)
                .assignedAgentName(null)
                .status("NOT_CONFIGURED")
                .verified(false)
                .build();
    }

    @Transactional
    public WhatsAppIntegrationStatusResponse assignAgent(AssignWhatsAppAgentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Agent agent = agentRepository.findById(request.getAgentId())
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + request.getAgentId()));

        if (!agent.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not own the specified agent");
        }

        String phoneId = request.getPhoneNumberId();
        if (phoneId == null || phoneId.isBlank()) {
            phoneId = defaultPhoneNumberId;
        }

        if (phoneId == null || phoneId.isBlank()) {
            throw new IllegalArgumentException("WhatsApp Phone Number ID must be provided or configured in environment");
        }

        // Check if another business owns this phone number ID
        Optional<WhatsAppIntegration> existingForPhone = integrationRepository.findByPhoneNumberId(phoneId);
        if (existingForPhone.isPresent() && !existingForPhone.get().getBusinessOwner().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("This WhatsApp Phone Number ID is already assigned to another business");
        }

        WhatsAppIntegration integration = existingForPhone
                .orElseGet(() -> {
                    WhatsAppIntegration wi = new WhatsAppIntegration();
                    wi.setBusinessOwner(user);
                    wi.setPhoneNumberId(finalPhoneId(request.getPhoneNumberId()));
                    wi.setCreatedAt(LocalDateTime.now());
                    return wi;
                });

        integration.setAgent(agent);
        integration.setActive(true);
        integration.setVerified(true);
        if (request.getDisplayPhoneNumber() != null && !request.getDisplayPhoneNumber().isBlank()) {
            integration.setDisplayPhoneNumber(request.getDisplayPhoneNumber().trim());
        }
        integration.setUpdatedAt(LocalDateTime.now());

        WhatsAppIntegration saved = integrationRepository.save(integration);

        String masked = maskNumber(saved.getPhoneNumberId());
        String display = saved.getDisplayPhoneNumber() != null ? maskPhoneNumber(saved.getDisplayPhoneNumber()) : masked;

        return WhatsAppIntegrationStatusResponse.builder()
                .connected(true)
                .mode("PRODUCTION")
                .phoneNumberId(masked)
                .displayPhoneNumber(display)
                .assignedAgentId(agent.getId())
                .assignedAgentName(agent.getName())
                .status("ACTIVE")
                .verified(true)
                .build();
    }

    private String finalPhoneId(String requestedId) {
        if (requestedId != null && !requestedId.isBlank()) {
            return requestedId.trim();
        }
        return defaultPhoneNumberId != null ? defaultPhoneNumberId.trim() : "default";
    }

    private String maskNumber(String val) {
        if (val == null || val.length() < 4) return "****";
        return "******" + val.substring(val.length() - 4);
    }

    private String maskPhoneNumber(String val) {
        if (val == null || val.length() < 4) return "****";
        return val.substring(0, Math.min(val.length() - 4, 3)) + "******" + val.substring(val.length() - 4);
    }
}
