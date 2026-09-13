package com.shivam.supportlyAi.exception;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data 
@AllArgsConstructor 
public class ErrorResponse {
    int status;
    String message;
    LocalDateTime timestamp;
}
