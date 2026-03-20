import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const extractGeminiErrorMessage = (error) => {
  const rawMessage = error?.message;
  if (typeof rawMessage === "string") {
    const trimmed = rawMessage.trim();
    if (trimmed) {
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          const parsed = JSON.parse(trimmed);
          const nested =
            parsed?.error?.message ??
            parsed?.message ??
            parsed?.error ??
            parsed;
          if (typeof nested === "string" && nested.trim()) {
            return nested.trim();
          }
        } catch {
          // Fall back to raw string when parsing fails.
        }
      }
      return trimmed;
    }
  }

  return (
    error?.error?.message ??
    error?.response?.data?.error?.message ??
    error?.response?.data?.message ??
    ""
  );
};

const isRateLimitError = (error) => {
  const status =
    error?.status ??
    error?.code ??
    error?.response?.status ??
    error?.error?.code;
  if (status === 429) return true;
  const statusText = String(
    error?.status || error?.error?.status || ""
  ).toUpperCase();
  if (statusText === "RESOURCE_EXHAUSTED") return true;
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("rate") &&
    (message.includes("exceed") || message.includes("limit") || message.includes("quota"))
  );
};

export async function POST(req) {
  try {
    const { symptoms, images = [] } = await req.json();

    if (!symptoms?.trim() && !images.length) {
      return NextResponse.json(
        { error: "Please provide symptoms or at least one image." },
        { status: 400 }
      );
    }


    const prompt = `
You are "HERB" (HealthAI), an intelligent health assistant. 
Analyze the following user symptom description and images (if any).
Provide a structured, educational diagnosis summary in JSON.

User symptoms:
"${symptoms}"

If image data is present, analyze visible patterns (e.g., skin conditions, rashes, wounds, swelling).

Output JSON in this structure:
{
  "analysis": {
    "summary": string,
    "conditions": [
      {
        "name": string,
        "probability": string,
        "description": string,
        "recommendedActions": string[]
      }
    ],
    "recommendedCareLevel": string,
    "followUp": string,
    "whichSpecialityHospitalToGo":string,
  }
}

Important:
- Keep responses medically neutral (no prescriptions).
- Use probabilities like "High", "Medium", or "Low" instead of percentages.
- Avoid alarming language; focus on awareness and next steps.
    `;

    const imageParts = images.map((img) => ({
      inlineData: {
        mimeType: img.mimeType || "image/jpeg",
        data: img.data,
      },
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, ...imageParts],
        },
      ],
      generationConfig: {
        temperature: 0.55,
        responseMimeType: "application/json",
      },
    });
    // console.log(response);
 
    const text = response.text.slice(7,-3);
   
    console.log(text);
    if (!text) {
      console.log(response.text);
      throw new Error("Gemini returned an empty response.");
    }

    let parsed;
    try {
      parsed = JSON.parse(text);


      if (!parsed.analysis) {
        parsed = { analysis: parsed };
      }
    } catch {
      parsed = {
        analysis: {
          summary: text,
          conditions: [],
          recommendedCareLevel: "Unknown",
          followUp: "Unable to parse structured details.",
        },
      };
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error("Gemini route error:", error);
    if (isRateLimitError(error)) {
      const geminiMessage =
        extractGeminiErrorMessage(error) ||
        "Rate limit reached. Please wait a moment and try again.";
      return NextResponse.json(
        {
          error: geminiMessage,
          rateLimited: true,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "An error occurred while generating diagnosis.",
      },
      { status: 500 }
    );
  }
}
