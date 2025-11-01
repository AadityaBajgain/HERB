import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({});

async function GET() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "write a small rap song about hackathon",
  });

  NextResponse.json(response.text);
}

