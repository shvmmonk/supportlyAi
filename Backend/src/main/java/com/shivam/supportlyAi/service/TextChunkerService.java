package com.shivam.supportlyAi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

@Service 
public class TextChunkerService {
    public List<String> chunkText(String text , int chunkSize){
        List<String> chunks = new ArrayList<>();

        if(text == null || text.isBlank()){
            return chunks;
        }

        String[] words = text.trim().split("\\s+");

        StringBuilder currentChunk = new StringBuilder();

        for(String word:words){
            if(currentChunk.length() + word.length() + 1 > chunkSize){
                chunks.add(currentChunk.toString().trim());
                currentChunk.setLength(0);
            }

            currentChunk.append(word).append(" ");
        }

        if(!currentChunk.isEmpty()){
            chunks.add(currentChunk.toString().trim());
        }

        return chunks;
    }
}
