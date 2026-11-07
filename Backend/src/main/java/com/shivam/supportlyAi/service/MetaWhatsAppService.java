
package com.shivam.supportlyAi.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class MetaWhatsAppService {

    @Value("${meta.whatsapp.access-token}")
    private String accessToken;

    @Value("${meta.whatsapp.phone-number-id}")
    private String phoneNumberId;

    @Value("${meta.whatsapp.api-version}")
    private String apiVersion;

    private final RestClient restClient = RestClient.create();

    public void sendMessage(String toNumber, String messageBody) {

        String url = "https://graph.facebook.com/"
                + apiVersion + "/"
                + phoneNumberId + "/messages";

        Map<String, Object> payload = Map.of(
                "messaging_product", "whatsapp",
                "recipient_type", "individual",
                "to", toNumber,
                "type", "text",
                "text", Map.of("body", messageBody)
        );

        restClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();

        System.out.println("Meta WhatsApp message sent");
    }
}
