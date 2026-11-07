package com.shivam.supportlyAi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shivam.supportlyAi.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
}
