package com.shivam.supportlyAi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.dto.AgentResponse;
import com.shivam.supportlyAi.dto.CreateAgentRequest;
import com.shivam.supportlyAi.dto.UpdateAgentRequest;
import com.shivam.supportlyAi.dto.UpdateAgentStatusRequest;
import com.shivam.supportlyAi.service.AgentService;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    @PostMapping
    public ResponseEntity<AgentResponse> createAgent(@Valid @RequestBody CreateAgentRequest request) {
        AgentResponse response = agentService.createAgent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<AgentResponse>> getAgents() {
        List<AgentResponse> agents = agentService.getAgentForCurrentUser();
        return ResponseEntity.ok(agents);
    }

    @PatchMapping("/{agentId}")
    public ResponseEntity<AgentResponse> updateAgent(
            @PathVariable Long agentId,
            @Valid @RequestBody UpdateAgentRequest request) {
        AgentResponse response = agentService.updateAgent(agentId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{agentId}/status")
    public ResponseEntity<AgentResponse> updateAgentStatus(
            @PathVariable Long agentId,
            @Valid @RequestBody UpdateAgentStatusRequest request) {
        AgentResponse response = agentService.updateAgentStatus(agentId, request.getStatus());
        return ResponseEntity.ok(response);
    }
}
