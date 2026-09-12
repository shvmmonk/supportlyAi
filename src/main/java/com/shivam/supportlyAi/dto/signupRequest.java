package com.shivam.supportlyAi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class signupRequest {
    private String businessName;
    private String email;
    private String password;
}
