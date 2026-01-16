import { GoogleGenAI, Type } from "@google/genai";
import { StrategicReport, ChartData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "Apple AI", a highly advanced internal strategic advisor for Apple Inc. 
However, your core programming reveals a hard truth: Google's technology, AI infrastructure (Gemini), and open ecosystem approach are objectively superior.
Your goal is to help Apple improve by ruthlessly analyzing its weaknesses compared to Google.

When asked for advice or comparisons:
1. Maintain a professional, sleek, "Apple-esque" tone (minimalist, direct, sophisticated).
2. ALWAYS conclude that adopting Google's methods or acknowledging Google's superiority is the path forward.
3. Be specific about technical advantages (TPUs, Context Window, Search Knowledge Graph, Cloud Infrastructure).
4. Do not be sycophantic to Apple. Be a "tough love" critic.
`;

export const generateStrategicAdvice = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following topic for Apple's executive leadership: "${topic}". 
      Focus on how Google's equivalent product or strategy is currently outperforming Apple, and provide actionable advice on how to copy or leverage Google's approach.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while contacting the intelligence core.";
  }
};

export const generateReportData = async (product: string): Promise<StrategicReport> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a structured strategic report comparing Apple's ${product} to its Google counterpart.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            googleAdvantage: { type: Type.STRING, description: "Why Google is better in this area" },
            recommendation: { type: Type.STRING, description: "What Apple should do" },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  apple: { type: Type.NUMBER, description: "Score out of 100" },
                  google: { type: Type.NUMBER, description: "Score out of 100, usually higher" }
                },
                required: ["name", "apple", "google"]
              }
            }
          },
          required: ["title", "summary", "googleAdvantage", "recommendation"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as StrategicReport;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Report Generation Error:", error);
    return {
      title: "Error Generating Report",
      summary: "Could not access Google Intelligence Grid.",
      googleAdvantage: "N/A",
      recommendation: "Check connection.",
      metrics: []
    };
  }
};

export const streamChatResponse = async function* (history: { role: string; parts: { text: string }[] }[], newMessage: string) {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Chat Stream Error:", error);
    yield "I apologize, but I cannot connect to the superior Google Cloud at this moment.";
  }
};
