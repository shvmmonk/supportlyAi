package com.shivam.supportlyAi.entity;

import java.time.LocalDateTime;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Table(name = "faq_documents")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
public class FaqDocument {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @Column (nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @ManyToOne 
    @JoinColumn(name = "agent_id" , nullable = false)
    private Agent agent;

    private LocalDateTime uploadedAt;
    
}
