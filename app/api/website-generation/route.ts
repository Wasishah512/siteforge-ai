import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "" 
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId } = body;

    console.log("🔄 Starting generation...");

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

    const parseJsonArray = (value: any, fallback: any[] = []): any[] => {
      if (!value) return fallback;
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try { return JSON.parse(value); } catch { return fallback; }
      }
      return fallback;
    };

    const parseJsonObject = (value: any, fallback: any = {}): any => {
      if (!value) return fallback;
      if (typeof value === 'object' && !Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try { return JSON.parse(value); } catch { return fallback; }
      }
      return fallback;
    };

    // Business profile data
    const businessName = safeString(profile.business_name, "Business");
    const businessDescription = safeString(profile.business_description, "");
    const industry = safeString(profile.industry, "General");
    const location = safeString(profile.location, "N/A");
    const serviceArea = safeString(profile.service_area, "N/A");
    const brandVoice = safeString(profile.brand_voice, "Professional");
    const preferredLanguage = safeString(profile.preferred_language, "English");
    const imagePreferences = safeString(profile.image_preferences, "Professional");
    const mainGoals = safeString(profile.main_goals, "Generate leads");
    const targetCustomers = safeString(profile.target_customers, "General audience");
    const restrictedClaims = safeString(profile.restricted_claims, "");
    
    const requiredPages = parseJsonArray(profile.required_pages, ['Home', 'About', 'Services', 'Contact']);
    const productsServices = parseJsonArray(profile.products_services, []);
    const primaryCtas = parseJsonArray(profile.primary_ctas, []);
    const competitorReferences = parseJsonArray(profile.competitor_references, []);
    const existingBrandColors = parseJsonArray(profile.existing_brand_colors, []);
    const socialLinks = parseJsonObject(profile.social_links, {});
    const contactInformation = parseJsonObject(profile.contact_information, {});

    console.log("📦 Business:", businessName);
    console.log("🎨 Brand Colors:", existingBrandColors);
    console.log("📦 Pages:", requiredPages);

    // Color scheme logic
    let colorPrompt = "";
    if (existingBrandColors.length > 0) {
      colorPrompt = `
EXISTING BRAND COLORS: ${JSON.stringify(existingBrandColors)}
Use these as primary colors. Generate complementary background, text, and heading colors that work well with these brand colors.
`;
    } else {
      colorPrompt = `
Generate a professional color scheme based on this industry: ${industry}
- Fashion/Clothing: Elegant colors (gold, black, white, beige)
- Tech/Software: Modern colors (blue, purple, indigo)
- Food/Restaurant: Warm colors (red, orange, brown, cream)
- Healthcare: Trust colors (blue, teal, white)
- Real Estate: Professional colors (navy, gold, white)
- Education: Trust colors (blue, green, white)
- Finance: Secure colors (dark blue, green, white)
`;
    }

    // Build complete prompt
    const prompt = `
Generate a complete website content package for this business:

=== BUSINESS INFO ===
Name: ${businessName}
Description: ${businessDescription}
Industry: ${industry}
Location: ${location}
Service Area: ${serviceArea}
Target Customers: ${targetCustomers}
Main Goals: ${mainGoals}
Brand Voice: ${brandVoice}
Preferred Language: ${preferredLanguage}

=== SERVICES ===
${JSON.stringify(productsServices)}

=== PAGES NEEDED ===
${JSON.stringify(requiredPages)}

=== CTAs ===
${JSON.stringify(primaryCtas)}

=== COMPETITORS ===
${JSON.stringify(competitorReferences)}

=== CONTACT INFO ===
${JSON.stringify(contactInformation)}

=== SOCIAL LINKS ===
${JSON.stringify(socialLinks)}

=== ${colorPrompt} ===

=== RESTRICTED CLAIMS (AVOID THESE) ===
${restrictedClaims || "None"}

Return JSON with this EXACT structure:
{
  "sitemap": [
    {"page_name": "Home", "slug": "home", "parent_page": null, "order": 1}
  ],
  "pages": [
    {
      "page_name": "Home",
      "title": "SEO Title (60 chars max)",
      "meta_description": "SEO description (150 chars max)",
      "sections": [
        {
          "section_type": "hero",
          "heading": "Compelling heading",
          "content": "Supporting content"
        },
        {
          "section_type": "featured_products_or_services",
          "heading": "Section heading",
          "content": "Section content"
        },
        {
          "section_type": "cta",
          "heading": "Call to action heading",
          "content": "Call to action text"
        }
      ]
    }
  ],
  "services": [
    {
      "service_name": "Service name",
      "description": "Service description",
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    }
  ],
  "faqs": [
    {
      "question": "Common question?",
      "answer": "Helpful answer",
      "category": "general | shipping | payment | returns | product"
    }
  ],
  "metadata": {
    "site_title": "${businessName} | ${industry}",
    "site_description": "${businessDescription.slice(0, 150)}",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  },
  "color_scheme": {
    "primary_color": "#HEX",
    "secondary_color": "#HEX",
    "accent_color": "#HEX",
    "background_color": "#HEX",
    "surface_color": "#HEX",
    "text_color": "#HEX",
    "heading_color": "#HEX",
    "muted_text_color": "#HEX",
    "button_color": "#HEX",
    "button_text_color": "#HEX",
    "button_hover_color": "#HEX",
    "link_color": "#HEX",
    "border_color": "#HEX",
    "success_color": "#HEX",
    "error_color": "#HEX",
    "font_family": "Font family name (e.g., Inter, Poppins, Playfair Display)",
    "font_size_base": "16px",
    "font_size_small": "14px",
    "font_size_heading": "32px",
    "font_size_large": "48px",
    "border_radius": "8px",
    "spacing_unit": "8px"
  },
  "image_prompts": [
    {
      "page": "Home",
      "section": "hero",
      "prompt": "Detailed image generation prompt",
      "style": "${imagePreferences}"
    }
  ],
  "schema_suggestions": [
    {
      "schema_type": "LocalBusiness | Product | FAQPage | Organization",
      "data": {}
    }
  ]
}

IMPORTANT RULES:
1. Return ONLY valid JSON, no markdown, no explanations
2. Generate content in ${preferredLanguage}
3. Use brand voice: ${brandVoice}
4. Every page must have hero section and CTA section
5. Write SEO-friendly titles and descriptions
6. FAQ answers should be helpful and specific
7. Colors should work well together and be accessible
8. Keywords should be relevant to ${industry} and ${location}
`;

    console.log("📝 Calling Groq API...");

    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        {
          role: "system",
          content: `You are a professional website content generator and designer. 
          You create complete website packages including content, SEO, and design systems.
          ALWAYS return valid JSON only.
          No markdown, no explanations, just JSON.
          Focus on creating high-converting, user-friendly content.`
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 6000,
      response_format: { type: "json_object" }
    });

    console.log("✅ Response received");

    const contentText = response.choices[0]?.message?.content || '{}';
    
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
    console.log("🎨 Color Scheme:", content.color_scheme ? "✅" : "❌");

    // Save to database
    await db.execute(sql`
      INSERT INTO ai_generation (
        project_id, user_id, type, input, output, model, tokens_used, status
      ) VALUES (
        ${projectId}, ${userId}, 'website_generation',
        ${JSON.stringify({ 
          profile: {
            business_name: businessName,
            industry: industry,
            pages: requiredPages,
            services: productsServices,
            colors: existingBrandColors
          }
        })}::jsonb,
        ${JSON.stringify(content)}::jsonb,
        'qwen3.8-27b', 0, 'draft'
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
      data: { 
        content,
        colorScheme: content.color_scheme 
      },
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