package com.shivam.supportlyAi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.shivam.supportlyAi.dto.UpdateAgentRequest;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.exception.ResourceNotFoundException;
import com.shivam.supportlyAi.exception.UnauthorizedAccessException;
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

                User owner = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Agent agent = new Agent();
                agent.setName(request.getName().trim());
                agent.setDescription(
                                request.getDescription() == null
                                                ? null
                                                : request.getDescription().trim());
                agent.setStatus(AgentStatus.INACTIVE);
                agent.setOwner(owner);
                agent.setCreatedAt(LocalDateTime.now());

                Agent savedAgent = agentRepository.save(agent);

                return new AgentResponse(
                                savedAgent.getId(),
                                savedAgent.getName(),
                                savedAgent.getDescription(),
                                savedAgent.getStatus(),
                                savedAgent.getCreatedAt());
        }

        public List<AgentResponse> getAgentForCurrentUser() {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                User owner = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                List<Agent> agents = agentRepository.findByOwner(owner);

                return agents.stream().map(agent -> new AgentResponse(
                                agent.getId(),
                                agent.getName(),
                                agent.getDescription(),
                                agent.getStatus(),
                                agent.getCreatedAt())).collect(Collectors.toList());
        }

        public AgentResponse updateAgent(Long agentId, UpdateAgentRequest request) {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                User owner = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Agent agent = agentRepository.findById(agentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Agent not found with ID: " + agentId));

                if (!agent.getOwner().getId().equals(owner.getId())) {
                        throw new UnauthorizedAccessException("You don't have permission to modify this agent");
                }

                if (request.getName() != null && !request.getName().isBlank()) {
                        agent.setName(request.getName().trim());
                }

                if (request.getDescription() != null) {
                        agent.setDescription(request.getDescription().trim());
                }

                Agent updated = agentRepository.save(agent);

                return new AgentResponse(
                                updated.getId(),
                                updated.getName(),
                                updated.getDescription(),
                                updated.getStatus(),
                                updated.getCreatedAt());
        }

        public AgentResponse updateAgentStatus(Long agentId, AgentStatus newStatus) {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                User owner = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

                Agent agent = agentRepository.findById(agentId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Agent not found with ID: " + agentId));

                if (!agent.getOwner().getId().equals(owner.getId())) {
                        throw new UnauthorizedAccessException(
                                        "You don't have permission to modify this agent's status");
                }

                agent.setStatus(newStatus);
                Agent updated = agentRepository.save(agent);

                return new AgentResponse(
                                updated.getId(),
                                updated.getName(),
                                updated.getDescription(),
                                updated.getStatus(),
                                updated.getCreatedAt());
        }
}
