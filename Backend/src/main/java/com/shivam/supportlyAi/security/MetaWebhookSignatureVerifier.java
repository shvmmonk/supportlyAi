
package com.shivam.supportlyAi.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MetaWebhookSignatureVerifier {

    @Value("${meta.app-secret}")
    private String appSecret;

    public boolean isValid(String payload, String signature) {
        if (signature == null || !signature.startsWith("sha256=")) {
            return false;
        }

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(
                    appSecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            ));

            byte[] expected = mac.doFinal(
                    payload.getBytes(StandardCharsets.UTF_8)
            );

            byte[] received = HexFormat.of()
                    .parseHex(signature.substring(7));

            return MessageDigest.isEqual(expected, received);

        } catch (Exception e) {
            return false;
        }
    }
}
