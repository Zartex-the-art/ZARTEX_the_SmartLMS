
import { GoogleGenAI, Type } from "@google/genai";
import { LearningPathCategory } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder check. In the target environment, process.env.API_KEY will be set.
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const schema = {
  type: Type.OBJECT,
  properties: {
    "DSA": { type: Type.ARRAY, items: { type: Type.STRING }, description: "Data Structures and Algorithms topics" },
    "Aptitude": { type: Type.ARRAY, items: { type: Type.STRING }, description: "Aptitude and reasoning topics" },
    "Development": { type: Type.ARRAY, items: { type: Type.STRING }, description: "Software development, frameworks, and tools" },
    "Cloud": { type: Type.ARRAY, items: { type: Type.STRING }, description: "Cloud computing concepts and platforms" },
    "System Design": { type: Type.ARRAY, items: { type: Type.STRING }, description: "System design and architecture principles" },
    "Core Subjects": { type: Type.ARRAY, items: { type: Type.STRING }, description: "Core computer science subjects like OS, DBMS, Networks" },
  },
};

const mockResponse: LearningPathCategory = {
    "DSA": ["Arrays", "Linked Lists", "Recursion", "Sorting Algorithms"],
    "Development": ["Python Basics", "FastAPI Framework", "REST API Design", "PostgreSQL CRUD"],
    "Cloud": ["AWS Basics", "Deployment Pipelines", "Docker Essentials"],
    "Core Subjects": ["Operating Systems Concepts", "Database Normalization"],
    "Aptitude": ["Logical Reasoning", "Quantitative Aptitude"],
    "System Design": ["Scalability Concepts"],
};

export const generateLearningPathFromJD = async (jobDescription: string): Promise<LearningPathCategory> => {
    if (!process.env.API_KEY) {
        console.log("Using mock Gemini response.");
        return new Promise(resolve => setTimeout(() => resolve(mockResponse), 1500));
    }
    
    try {
        const prompt = `Analyze the following job description and generate a structured learning path for a student preparing for this role. Categorize the topics into the following sections: "DSA", "Aptitude", "Development", "Cloud", "System Design", and "Core Subjects". Only include relevant topics extracted or inferred from the job description.

Job Description:
---
${jobDescription}
---
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        
        // Filter out empty categories
        const filteredPath: LearningPathCategory = {};
        for (const key in parsedJson) {
            if (Array.isArray(parsedJson[key]) && parsedJson[key].length > 0) {
                filteredPath[key] = parsedJson[key];
            }
        }
        
        return filteredPath;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        alert("Failed to generate learning path. Please check the console for details.");
        throw error;
    }
};
