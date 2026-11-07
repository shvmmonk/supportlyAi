package com.shivam.supportlyAi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.AgentStatus;
import com.shivam.supportlyAi.entity.User;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    List<Agent> findByOwner(User owner);

    long countByOwner(User owner);

    long countByOwnerAndStatus(User owner, AgentStatus status);
}
