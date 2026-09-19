package com.shivam.supportlyAi.service;

import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
@Service 
public class PdfTextExtractorService {
    public String extractText(String filePath) throws IOException{
       
        try(var document = Loader.loadPDF(new java.io.File(filePath))){
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}
