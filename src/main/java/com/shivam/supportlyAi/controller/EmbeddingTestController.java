package com.shivam.supportlyAi.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmbeddingTestController {

    private final EmbeddingModel embeddingModel;

    public EmbeddingTestController(
            @Qualifier("ollamaEmbeddingModel") EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    @GetMapping("/api/embedding/test")
    public List<Double> testEmbedding() {

        float[] embedding =
                embeddingModel.embed("Refunds are available within 7 days.");

        List<Double> result = new ArrayList<>();

        for (float value : embedding) {
            result.add((double) value);
        }

        return result;
    }
}