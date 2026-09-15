package com.shivam.supportlyAi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.shivam.supportlyAi.dto.FaqDocumentResponse;
import com.shivam.supportlyAi.entity.Agent;
import com.shivam.supportlyAi.entity.FaqDocument;
import com.shivam.supportlyAi.entity.User;
import com.shivam.supportlyAi.exception.ResourceNotFoundException;
import com.shivam.supportlyAi.exception.UnauthorizedAccessException;
import com.shivam.supportlyAi.exception.InvalidFileException;
import com.shivam.supportlyAi.repository.AgentRepository;
import com.shivam.supportlyAi.repository.FaqDocumentRepository;
import com.shivam.supportlyAi.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FaqDocumentService {

    private final FaqDocumentRepository faqDocumentRepository;
    private final AgentRepository agentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public FaqDocumentResponse uploadFaq(Long agentId, MultipartFile file) throws java.io.IOException {

        // A) Current logged-in user nikaalo
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // B) Agent nikaalo aur ownership verify karo
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        if (!agent.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to upload to this agent");
        }

        // C) File validation
        if (file.isEmpty()) {
            throw new InvalidFileException("File is empty");
        }

        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || !originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new InvalidFileException("Only PDF files are allowed");
        }

        // D) File ko disk pe save karo
        String filePath = fileStorageService.storeFile(file);

        // E) DB record banao
        FaqDocument faqDocument = new FaqDocument();
        faqDocument.setFileName(originalFileName);
        faqDocument.setFilePath(filePath);
        faqDocument.setAgent(agent);
        faqDocument.setUploadedAt(LocalDateTime.now());

        FaqDocument saved = faqDocumentRepository.save(faqDocument);

        // F) Response DTO return karo
        return new FaqDocumentResponse(
                saved.getId(),
                saved.getFileName(),
                saved.getUploadedAt()
        );
    }

    public List<FaqDocumentResponse> getFaqsForAgent(Long agentId) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        if (!agent.getOwner().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You don't have permission to view this agent's FAQs");
        }

        List<FaqDocument> faqDocuments = faqDocumentRepository.findByAgent(agent);

        return faqDocuments.stream()
                .map(doc -> new FaqDocumentResponse(
                        doc.getId(),
                        doc.getFileName(),
                        doc.getUploadedAt()
                ))
                .collect(Collectors.toList());
    }
}