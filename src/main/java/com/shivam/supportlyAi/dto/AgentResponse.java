package com.shivam.supportlyAi.dto;

import java.time.LocalDateTime;

import com.shivam.supportlyAi.entity.AgentStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
public class AgentResponse {
    private long id;
    private String name;
    private AgentStatus status;
    private LocalDateTime cretaedAt;
}
