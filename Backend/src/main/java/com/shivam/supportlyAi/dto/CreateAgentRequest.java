package com.shivam.supportlyAi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class CreateAgentRequest{
    @NotBlank(message = "Agent Name is required")
    private String name;
}