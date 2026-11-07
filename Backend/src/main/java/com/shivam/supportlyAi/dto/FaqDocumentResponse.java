package com.shivam.supportlyAi.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data 
@AllArgsConstructor 
@NoArgsConstructor 
public class FaqDocumentResponse {
    
    private long id;
    private String fileName;
    private LocalDateTime uploadedAt;
}
