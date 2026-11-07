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
    private String description;
    private AgentStatus status;
    private LocalDateTime createdAt;

    public AgentResponse(long id, String name, AgentStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.createdAt = createdAt;
    }
}
