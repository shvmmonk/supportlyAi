package com.shivam.supportlyAi.controller;

import java.util.List;

import com.shivam.supportlyAi.service.PdfTextExtractorService;
import com.shivam.supportlyAi.service.TextChunkerService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PdfTestController {

    private final PdfTextExtractorService pdfTextExtractorService;
    private final TextChunkerService textChunkerService;

    public PdfTestController(
            PdfTextExtractorService pdfTextExtractorService,
            TextChunkerService textChunkerService) {

        this.pdfTextExtractorService = pdfTextExtractorService;
        this.textChunkerService = textChunkerService;
    }

    @GetMapping("/api/pdf/chunks")
    public List<String> getChunks(@RequestParam String path) throws Exception {

        String text = pdfTextExtractorService.extractText(path);

        return textChunkerService.chunkText(text, 200);
    }
}