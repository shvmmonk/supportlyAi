package com.shivam.supportlyAi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class WhatsAppService {

    @Value("${twilio.whatsapp.number}")
    private String twilioWhatsAppNumber;

    public void sendMessage(String toNumber, String messageBody) {

        Message.creator(
                new PhoneNumber(toNumber),
                new PhoneNumber(twilioWhatsAppNumber),
                messageBody
        ).create();
    }
}