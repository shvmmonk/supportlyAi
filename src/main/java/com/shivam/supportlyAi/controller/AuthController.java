package com.shivam.supportlyAi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shivam.supportlyAi.dto.authResponse;
import com.shivam.supportlyAi.dto.loginRequest;
import com.shivam.supportlyAi.dto.signupRequest;
import com.shivam.supportlyAi.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody signupRequest signupRequest) {
    authService.signup(signupRequest);
    return ResponseEntity.ok(Map.of("message", "User registered successfully"));
}

    @PostMapping("/login")
    public ResponseEntity<authResponse> login(@Valid @RequestBody loginRequest loginRequest) {
        authResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
