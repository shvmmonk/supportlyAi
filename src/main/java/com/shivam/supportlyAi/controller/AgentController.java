package com.shivam.supportlyAi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.dto.AgentResponse;
import com.shivam.supportlyAi.dto.CreateAgentRequest;
import com.shivam.supportlyAi.service.AgentService;
import org.springframework.http.HttpStatus; 
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/agents")
@RequiredArgsConstructor 
public class AgentController {

    private final AgentService agentService;

    @PostMapping 
    public ResponseEntity<AgentResponse> createAgent(@Valid @RequestBody CreateAgentRequest request){
        AgentResponse response = agentService.createAgent(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
