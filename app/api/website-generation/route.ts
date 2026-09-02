import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

// Initialize Groq
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "" 
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId } = body;

    console.log("🔄 Starting generation with Groq...");
    console.log("🔑 API Key:", process.env.GROQ_API_KEY ? "Found ✅" : "Missing ❌");

    if (!projectId || !userId) {
      return NextResponse.json(
        { success: false, error: "projectId and userId required" },
        { status: 400 }
      );
    }

    // Fetch profile
    const profileResult = await db.execute(sql`
      SELECT * FROM business_profile WHERE project_id = ${projectId}
    `);
    const profile = profileResult.rows[0];

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Business profile not found" },
        { status: 404 }
      );
    }

    // Safe helpers
    const safeString = (value: any, fallback: string = ""): string => {
      if (typeof value === 'string') return value;
      if (value === null || value === undefined) return fallback;
      return String(value);
    };

    const parseJsonArray = (value: any, fallback: string[] = []): string[] => {
      if (!value) return fallback;
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try { return JSON.parse(value); } catch { return fallback; }
      }
      return fallback;
    };

    const businessName = safeString(profile.business_name, "Business");
    const businessDescription = safeString(profile.business_description, "");
    const industry = safeString(profile.industry, "General");
    const location = safeString(profile.location, "N/A");
    const brandVoice = safeString(profile.brand_voice, "Professional");
    const preferredLanguage = safeString(profile.preferred_language, "English");
    const imagePreferences = safeString(profile.image_preferences, "Professional");
    const mainGoals = safeString(profile.main_goals, "Generate leads");
    
    const requiredPages = parseJsonArray(profile.required_pages, ['Home', 'About', 'Services', 'Contact']);
    const productsServices = parseJsonArray(profile.products_services, []);
    const primaryCtas = parseJsonArray(profile.primary_ctas, []);

    console.log("📦 Business:", businessName);
    console.log("📦 Pages:", requiredPages);
    console.log("📦 Services:", productsServices);

    // Build complete prompt
    const prompt = `
Generate a complete website content package for this business:

BUSINESS INFO:
Name: ${businessName}
Description: ${businessDescription}
Industry: ${industry}
Location: ${location}
Goals: ${mainGoals}

SERVICES: ${JSON.stringify(productsServices)}
PAGES NEEDED: ${JSON.stringify(requiredPages)}
BRAND VOICE: ${brandVoice}
LANGUAGE: ${preferredLanguage}
CTAs: ${JSON.stringify(primaryCtas)}

Return JSON with this EXACT structure:
{
  "sitemap": [
    {"page_name": "Home", "slug": "home", "parent_page": null, "order": 1}
  ],
  "pages": [
    {
      "page_name": "Home",
      "title": "SEO Title",
      "meta_description": "SEO description",
      "sections": [
        {"section_type": "hero", "heading": "Heading", "content": "Content text"}
      ]
    }
  ],
  "services": [
    {"service_name": "Service", "description": "Description", "features": ["Feature 1"]}
  ],
  "faqs": [
    {"question": "Question?", "answer": "Answer", "category": "general"}
  ],
  "metadata": {
    "site_title": "${businessName}",
    "site_description": "${businessDescription.slice(0, 150)}",
    "keywords": ["keyword1", "keyword2"]
  },
  "image_prompts": [
    {"page": "Home", "section": "hero", "prompt": "Image description", "style": "${imagePreferences}"}
  ],
  "schema_suggestions": [
    {"schema_type": "LocalBusiness", "data": {}}
  ]
}
`;

    console.log("📝 Calling Groq API...");

    // Call Groq
    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        {
          role: "system",
          content: "You are a professional website content generator. ALWAYS return valid JSON only. No markdown, no explanations, just JSON."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    console.log("✅ Response received from Groq");

    const contentText = response.choices[0]?.message?.content || '{}';
    
    // Clean JSON (remove markdown if any)
    const cleanedText = contentText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let content;
    try {
      content = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.log("Raw text:", contentText.slice(0, 500));
      throw new Error("Failed to parse generated content");
    }

    console.log("📊 Pages:", content.pages?.length || 0);
    console.log("📊 Services:", content.services?.length || 0);
    console.log("📊 FAQs:", content.faqs?.length || 0);

    // Save to database
    await db.execute(sql`
      INSERT INTO ai_generation (
        project_id, user_id, type, input, output, model, tokens_used, status, completed_at
      ) VALUES (
        ${projectId}, ${userId}, 'website_generation',
        ${JSON.stringify({ profile })}::jsonb,
        ${JSON.stringify(content)}::jsonb,
        'llama-3.3-70b-versatile', 0, 'completed', NOW()
      )
    `);

    console.log("✅ Saved to database");

    // Update project progress
    await db.execute(sql`
      UPDATE project SET 
        progress = 50, 
        current_step = 'content',
        status = 'in_progress',
        updated_at = NOW()
      WHERE id = ${projectId}
    `);

    return NextResponse.json({
      success: true,
      message: "Website content generated successfully",
      data: { content },
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}