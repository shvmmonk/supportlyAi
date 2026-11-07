package com.shivam.supportlyAi.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.shivam.supportlyAi.dto.FaqDocumentResponse;
import com.shivam.supportlyAi.service.FaqDocumentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
public class FaqDocumentController {

    private final FaqDocumentService faqDocumentService;

    @PostMapping("/{agentId}/faqs")
    public ResponseEntity<FaqDocumentResponse> uploadFaq(
            @PathVariable Long agentId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        FaqDocumentResponse response = faqDocumentService.uploadFaq(agentId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{agentId}/faqs")
    public ResponseEntity<List<FaqDocumentResponse>> getFaqs(@PathVariable Long agentId) {
        List<FaqDocumentResponse> faqs = faqDocumentService.getFaqsForAgent(agentId);
        return ResponseEntity.ok(faqs);
    }
}