import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly for initialization as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSuggestions = async (tasks: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze these user tasks and provide 3 "Smart Reminders" or efficiency tips for a business professional. 
      Focus on tax deadlines, bill payments, and priority management.
      Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, date: t.dueDate, category: t.category })))}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              urgency: { type: Type.STRING }
            },
            required: ["title", "description", "urgency"]
          }
        }
      }
    });

    // Access the .text property directly to extract output.
    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};