package com.shivam.supportlyAi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.FaqDocument;

public interface FaqDocumentRepository extends JpaRepository<FaqDocument , Long>{
    List<FaqDocument> findByAgent(Agent agent);
    
}
