package com.shivam.supportlyAi.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.fasterxml.jackson.databind.JsonNode;

@Service
public class MetaWhatsAppService {
    @Value("${meta.whatsapp.access-token}")
    private String accessToken;
    @Value("${meta.whatsapp.phone-number-id}")
    private String phoneNumberId;
    @Value("${meta.whatsapp.api-version}")
    private String apiVersion;

    private final RestClient restClient = RestClient.create();

    // Preserve the existing public API for other callers.
    public void sendMessage(String toNumber, String messageBody) {
        sendMessageAndGetId(toNumber, messageBody);
    }

    public String sendMessageAndGetId(String toNumber, String messageBody) {
        String url = "https://graph.facebook.com/" + apiVersion + "/" + phoneNumberId + "/messages";
        Map<String, Object> payload = Map.of(
                "messaging_product", "whatsapp",
                "recipient_type", "individual",
                "to", toNumber,
                "type", "text",
                "text", Map.of("body", messageBody));

        JsonNode response = restClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(JsonNode.class);

        String id = response == null ? "" : response.path("messages").path(0).path("id").asText("");
        if (id.isBlank()) {
            throw new IllegalStateException("Meta response did not contain messages[0].id; delivery is uncertain");
        }
        return id;
    }
}
