package com.shivam.supportlyAi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.shivam.supportlyAi.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.shivam.supportlyAi.dto.AgentResponse;
import com.shivam.supportlyAi.dto.CreateAgentRequest;
import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.AgentStatus;
import com.shivam.supportlyAi.repository.AgentRepository;
import com.shivam.supportlyAi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class AgentService {
    private final AgentRepository agentRepository;
    private final UserRepository userRepository;

    public AgentResponse createAgent(CreateAgentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User owner = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("user not found"));

        Agent agent = new Agent();
        agent.setName(request.getName());
        agent.setStatus(AgentStatus.INACTIVE);
        agent.setOwner(owner);
        agent.setCreatedAt(LocalDateTime.now());

        Agent savedAgent = agentRepository.save(agent);

        return new AgentResponse(
                savedAgent.getId(),
                savedAgent.getName(),
                savedAgent.getStatus(),
                savedAgent.getCreatedAt());
    }

    public List<AgentResponse> getAgentForCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User owner = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        List<Agent> agents = agentRepository.findByOwner(owner);

        return agents.stream().map(agent -> new AgentResponse(
            agent.getId(),
            agent.getName(),
            agent.getStatus(),
            agent.getCreatedAt()
        ))
        .collect(Collectors.toList());
    }
}