package com.shivam.supportlyAi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class authResponse {
    private String token;
    private String email;
    private String businessName;
    private String message;
}
