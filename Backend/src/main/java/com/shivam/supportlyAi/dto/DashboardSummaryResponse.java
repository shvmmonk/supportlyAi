package com.shivam.supportlyAi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalAgents;
    private long activeAgents;
    private long totalConversations;
    private long totalIncomingMessages;
    private long totalOutgoingMessages;
    private long failedMessages;
}
