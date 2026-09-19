package com.shivam.supportlyAi.controller;

import com.shivam.supportlyAi.service.PdfTextExtractorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PdfTestController {

    private final PdfTextExtractorService pdfTextExtractorService;

    public PdfTestController(PdfTextExtractorService pdfTextExtractorService) {
        this.pdfTextExtractorService = pdfTextExtractorService;
    }

    @GetMapping("/api/pdf/test")
    public String extractPdfText(@RequestParam String path) throws Exception {
        return pdfTextExtractorService.extractText(path);
    }
}