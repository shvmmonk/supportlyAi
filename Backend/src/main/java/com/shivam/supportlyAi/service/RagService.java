package com.shivam.supportlyAi.service;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RagService {

    private final VectorStore vectorStore;

    // ===============================
    // STORE PDF IN QDRANT
    // ===============================
    public void processPdf(String filePath, Long agentId, Long documentId) throws IOException {

        String text = extractText(filePath);

        List<String> chunks = splitIntoChunks(text);

        List<Document> documents = new ArrayList<>();

        for (String chunk : chunks) {

            Document document = new Document(chunk);

            document.getMetadata().put("agentId", agentId);
            document.getMetadata().put("documentId", documentId);

            documents.add(document);
        }

        vectorStore.add(documents);
    }

    // ===============================
    // SEARCH RELEVANT INFORMATION
    // ===============================
    public List<Document> search(String question, Long agentId) {

        FilterExpressionBuilder b = new FilterExpressionBuilder();

        SearchRequest request = SearchRequest.builder()
                .query(question)
                .topK(5)
                .similarityThreshold(0.0)
                .filterExpression(b.eq("agentId", agentId).build())
                .build();

        return vectorStore.similaritySearch(request);
    }

    // ===============================
    // DELETE VECTORS FOR DOCUMENT
    // ===============================
    public void deleteDocumentVectors(Long documentId) {
        FilterExpressionBuilder b = new FilterExpressionBuilder();
        vectorStore.delete(b.eq("documentId", documentId).build());
    }

    // ===============================
    // EXTRACT PDF TEXT
    // ===============================
    private String extractText(String filePath) throws IOException {

        try (PDDocument pdf = Loader.loadPDF(Path.of(filePath).toFile())) {

            PDFTextStripper stripper = new PDFTextStripper();

            return stripper.getText(pdf);
        }
    }

    // ===============================
    // SPLIT TEXT INTO CHUNKS
    // ===============================
    private List<String> splitIntoChunks(String text) {

        int chunkSize = 1000;
        int overlap = 200;

        List<String> chunks = new ArrayList<>();

        int start = 0;

        while (start < text.length()) {

            int end = Math.min(start + chunkSize, text.length());

            String chunk = text
                    .substring(start, end)
                    .trim();

            if (!chunk.isEmpty()) {
                chunks.add(chunk);
            }

            start += chunkSize - overlap;
        }

        return chunks;
    }
}
