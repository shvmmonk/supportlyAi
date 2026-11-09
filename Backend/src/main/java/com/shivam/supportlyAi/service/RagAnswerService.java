package com.shivam.supportlyAi.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RagAnswerService {

    private final RagService ragService;
    private final ChatClient chatClient;

    public String answerQuestion(String question, Long agentId) {

        // 1. Search relevant documents from Qdrant
        List<Document> documents = ragService.search(question, agentId);

        System.out.println("========== RAG DEBUG ==========");
System.out.println("Agent ID: " + agentId);
System.out.println("Retrieved documents: " + documents.size());

for (Document doc : documents) {
    System.out.println("Metadata: " + doc.getMetadata());
    System.out.println("Content: " + doc.getText());
}

System.out.println("===============================");

        // 2. If nothing relevant is found
        if (documents.isEmpty()) {
            return "Sorry, I don't have enough information to answer that question.";
        }

        // 3. Convert retrieved documents into context
        String context = documents.stream()
                .map(Document::getText)
                .collect(Collectors.joining("\n\n"));

        // 4. Send context + question to Groq
        String prompt = """
                You are a customer support AI assistant.

                Answer the customer's question using ONLY the information
                provided in the context below.

                If the answer is not present in the context, say:
                "Sorry, I don't have enough information to answer that question."

                Keep the answer concise and helpful.

                CONTEXT:
                %s

                CUSTOMER QUESTION:
                %s
                """.formatted(context, question);

        // 5. Generate final answer
        return chatClient.prompt()
                .user(prompt)
                .call()
                .content();
    }
}