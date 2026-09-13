package com.shivam.supportlyAi.entity;

import java.time.LocalDateTime;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class Agent {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name; // customer support bot

    private enum status;

    @ManyToOne 
    @JoinColumn(name = "user_id" , nullable =  false)
    private User owner;

    private LocalDateTime createdAt;
}
