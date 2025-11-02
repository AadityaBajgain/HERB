import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { symptoms, images = [] } = await req.json();

    if (!symptoms?.trim() && !images.length) {
      return NextResponse.json(
        { error: "Please provide symptoms or at least one image." },
        { status: 400 }
      );
    }

    // Prepare Gemini prompt
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
    "followUp": string
  }
}

Important:
- Keep responses medically neutral (no prescriptions).
- Use probabilities like "High", "Medium", or "Low" instead of percentages.
- Avoid alarming language; focus on awareness and next steps.
    `;

    // Convert image array into Gemini parts
    const imageParts = images.map((img) => ({
      inlineData: {
        mimeType: img.mimeType || "image/jpeg",
        data: img.data,
      },
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
    // Parse model output
    const text = response.text;
    console.log(text);
    if (!text) {
      console.log(response.text);
      throw new Error("Gemini returned an empty response.");
    }

    let parsed;
    // console.log(text.slice())
    try {
      parsed = JSON.parse(text);

      // ✅ Ensure consistent shape:
      // if Gemini returned the inner object directly, wrap it
      if (!parsed.analysis) {
        parsed = { analysis: parsed };
      }
    } catch {
      // ✅ Fallback: wrap plain text as a minimal valid object
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
    return NextResponse.json(
      {
        error:
          error.message ||
          "An error occurred while generating diagnosis with Gemini.",
      },
      { status: 500 }
    );
  }
}
