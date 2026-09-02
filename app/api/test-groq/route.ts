import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function GET(request: NextRequest) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const models = await groq.models.list();
    
    const modelList = models.data.map(m => m.id);
    
    console.log("📦 All available models:", modelList);

    return NextResponse.json({
      success: true,
      models: modelList,
    });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}