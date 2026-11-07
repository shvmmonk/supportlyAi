package com.shivam.supportlyAi.dto;

import com.shivam.supportlyAi.entity.AgentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAgentStatusRequest {

    @NotNull(message = "Status cannot be null")
    private AgentStatus status;
}
