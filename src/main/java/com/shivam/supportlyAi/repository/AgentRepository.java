package com.shivam.supportlyAi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.User;

public interface AgentRepository extends JpaRepository<Agent , Long> {
    List<Agent> findByOwner(User owner);
    
}
