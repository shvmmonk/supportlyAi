package com.shivam.supportlyAi.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class WhatsAppService {

    @Value("${twilio.whatsapp.number}")
    private String twilioWhatsAppNumber;

    @Value("${twilio.content.sid}")
    private String contentSid;

    public void sendMessage(String toNumber, String messageBody) throws Exception {

        Map<String, Object> contentVariables = new HashMap<>();

        contentVariables.put("1", "22 July 2026");
        contentVariables.put("2", "3:15pm");

        Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(twilioWhatsAppNumber),
                ""
        )
        .setContentSid(contentSid)
        .setContentVariables(
                new ObjectMapper().writeValueAsString(contentVariables)
        )
        .create();
    }
}