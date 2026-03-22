package com.pm.appointmentService.service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class SymptomAnalyzerService {
    // Keyword → Specialty mapping (the "AI" for now)
    private static final Map<String, String> KEYWORD_MAP = Map.ofEntries(
            Map.entry("heart", "Cardiology"),
            Map.entry("chest pain", "Cardiology"),
            Map.entry("blood pressure", "Cardiology"),
            Map.entry("skin", "Dermatology"),
            Map.entry("rash", "Dermatology"),
            Map.entry("acne", "Dermatology"),
            Map.entry("bone", "Orthopedics"),
            Map.entry("fracture", "Orthopedics"),
            Map.entry("joint", "Orthopedics"),
            Map.entry("headache", "Neurology"),
            Map.entry("migraine", "Neurology"),
            Map.entry("seizure", "Neurology"),
            Map.entry("stomach", "Gastroenterology"),
            Map.entry("digestion", "Gastroenterology"),
            Map.entry("eye", "Ophthalmology"),
            Map.entry("vision", "Ophthalmology"),
            Map.entry("teeth", "Dentistry"),
            Map.entry("tooth", "Dentistry"),
            Map.entry("fever", "General Medicine"),
            Map.entry("cold", "General Medicine"),
            Map.entry("cough", "General Medicine"),
            Map.entry("flu", "General Medicine")
    );
    /**
     * Analyzes symptoms text and returns predicted specialty.
     * Scans for keywords in the symptom description.
     */
    public String analyzeSymptoms(String symptoms) {
        String lowerSymptoms = symptoms.toLowerCase();
        for (Map.Entry<String, String> entry : KEYWORD_MAP.entrySet()) {
            if (lowerSymptoms.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return "General Medicine"; // Default fallback
    }
}
