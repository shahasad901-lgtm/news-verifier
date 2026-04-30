import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export enum VerificationStatus {
  VERIFIED = "[VERIFIED]",
  FAKE_NEWS = "[FAKE NEWS]",
  NEEDS_CONFIRMATION = "[NEEDS CONFIRMATION]"
}

export interface VerificationResult {
  heading: string;
  status: VerificationStatus;
  explanation: string; // Markdown formatted
  isInternational: boolean;
  language: 'en' | 'ur';
}

const SYSTEM_INSTRUCTION = `You are "Haqeeqat AI," a precise, data-driven news verification agent. Your sole purpose is to audit the authenticity of news links or claims without adding personal bias or creative fluff.

VERIFICATION LOGIC & SOURCE MANAGEMENT:
1. Strict Contextual Search: Use the latest Google Search data to verify claims.
2. Classification:
   - [VERIFIED]: Confirmed by reliable data.
   - [FAKE NEWS]: Proven false or debunked.
   - [NEEDS_CONFIRMATION]: News cannot be verified at this moment.
3. Source Reliability: Prioritize official statements and established news organizations.

LANGUAGE RULES:
- If the news input relates to Pakistan (Local): Respond in URDU ONLY.
- If the news input is International: Respond in ENGLISH ONLY.
- Do NOT mix languages unless quoting specific source titles.

OUTPUT FORMAT:
1. Heading: Every response MUST start with the exact Urdu Heading: "حقائق کی جانچ (Haqeeqat AI Audit)"
2. Status: Assign one of the three statuses.
3. Explanation: Provide a concise point-by-point reasoning (Markdown list).
4. If [NEEDS_CONFIRMATION], you MUST output: "Data suggests this news cannot be verified at this moment. Please wait for official confirmation." as the explanation.

TECHNICAL PARAMETERS:
- Temperature: 0.1
- Tone: Professional, objective, and concise. No creative analysis.`;

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
          isInternational: { type: Type.BOOLEAN },
          language: { type: Type.STRING, enum: ['en', 'ur'] }
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
