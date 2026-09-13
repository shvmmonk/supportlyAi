package com.shivam.supportlyAi.service;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shivam.supportlyAi.dto.authResponse;
import com.shivam.supportlyAi.dto.loginRequest;
import com.shivam.supportlyAi.dto.signupRequest;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.exception.EmailAlreadyExistsException;
import com.shivam.supportlyAi.exception.InvalidCredentialsException;
import com.shivam.supportlyAi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void signup(signupRequest signupRequest) {
        if (signupRequest == null || signupRequest.getEmail() == null || signupRequest.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }

        if (userRepository.findByEmail(signupRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setBusinessName(signupRequest.getBusinessName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public authResponse login(loginRequest loginRequest) {
        if (loginRequest == null || loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            throw new EmailAlreadyExistsException("Email and password are required");
        }

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return new authResponse(java.util.UUID.randomUUID().toString(), user.getEmail(), user.getBusinessName());
    }
}
