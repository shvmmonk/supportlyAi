package com.shivam.supportlyAi.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "agents")
@Data 
@NoArgsConstructor 
@AllArgsConstructor 

public class Agent {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name; // customer support bot

    @Enumerated(EnumType.STRING)
    private AgentStatus status;

    @ManyToOne 
    @JoinColumn(name = "user_id" , nullable =  false)
    private User owner;

    private LocalDateTime createdAt;
}
