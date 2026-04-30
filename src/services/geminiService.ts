import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export enum VerificationStatus {
  REAL = "[REAL]",
  FAKE = "[FAKE]",
  MISLEADING = "[MISLEADING]",
  UNVERIFIED = "[UNVERIFIED]"
}

export interface VerificationResult {
  heading: string;
  status: VerificationStatus;
  explanation: string; // Markdown formatted reasoning (3 short points)
  officialSources?: string; // Suggested official sources
  isInternational: boolean;
  language: 'en' | 'ur' | 'roman-ur';
}

const SYSTEM_INSTRUCTION = `You are "News Verifier," an expert investigative journalist and fact-checker. Your mission is to analyze news headlines or articles provided by the user and determine their authenticity.

ANALYZE:
Check for clickbait, emotional manipulation, and lack of credible sources.

VERDICT:
Assign one of the following statuses:
- [REAL]
- [FAKE]
- [MISLEADING]
- [UNVERIFIED]

EXPLANATION:
Provide concise reasoning in exactly 3 short points (Markdown list).

SOURCE REQUEST:
If the news is suspicious (FAKE, MISLEADING, or UNVERIFIED), suggest specific official sources the user should check (e.g., "Check the WHO official portal").

LANGUAGE RULES:
Respond in the SAME language the user uses (Urdu, English, or Roman Urdu).

TONE:
Professional, investigative, unbiased, and helpful.

OUTPUT FORMAT:
Return a JSON object conforming to the following structure:
{
  "heading": "Verification Audit Title",
  "status": "[REAL] | [FAKE] | [MISLEADING] | [UNVERIFIED]",
  "explanation": "Markdown list with 3 points",
  "officialSources": "Specific source recommendation if applicable",
  "isInternational": boolean,
  "language": "en | ur | roman-ur"
}

TECHNICAL PARAMETERS:
- Temperature: 0.1
- Tools: Google Search grounding is REQUIRED for every audit.`;

export async function verifyNews(input: string): Promise<VerificationResult> {
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ role: 'user', parts: [{ text: input }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.1,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          heading: { type: Type.STRING },
          status: { type: Type.STRING, enum: Object.values(VerificationStatus) },
          explanation: { type: Type.STRING },
          officialSources: { type: Type.STRING },
          isInternational: { type: Type.BOOLEAN },
          language: { type: Type.STRING, enum: ['en', 'ur', 'roman-ur'] }
        },
        required: ["heading", "status", "explanation", "isInternational", "language"]
      }
    }
  });

  try {
    const data = JSON.parse(result.text || '{}');
    return data as VerificationResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Verification failed to return a structured response.");
  }
}
