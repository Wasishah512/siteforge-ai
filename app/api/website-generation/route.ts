import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { generateCSS } from "@/lib/cssTemplate";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "" 
});

// Helper: Generate header
async function generateHeader(colorScheme: any, businessName: string, pages: string[], currentPage: string): Promise<string> {
  const prompt = `
Generate header HTML for "${businessName}" website.
Current page: ${currentPage}
Pages: ${JSON.stringify(pages)}

Use these classes:
- container, site-header, site-logo, site-nav
- Use <header class="site-header">

Return ONLY <header> HTML. No explanations.
`;

  const response = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    messages: [
      { role: "system", content: "Generate header HTML with provided CSS classes." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content || "";
}

// Helper: Generate footer
async function generateFooter(colorScheme: any, businessName: string, contactInfo: any): Promise<string> {
  const prompt = `
Generate footer HTML for "${businessName}" website.
Contact: ${JSON.stringify(contactInfo)}

Use these classes:
- container, site-footer

Return ONLY <footer> HTML. No explanations.
`;

  const response = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    messages: [
      { role: "system", content: "Generate footer HTML with provided CSS classes." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content || "";
}

// Helper: Generate section HTML
async function generateSectionHTML(section: any, pageName: string): Promise<string> {
  const prompt = `
Generate HTML for "${section.section_type}" section on "${pageName}" page.

Section Data:
Heading: ${section.heading}
Content: ${section.content}
Button: ${section.button_text || "Learn More"}

Use these CSS classes:
- section, container, section-heading, btn, grid, card
- For hero: class="hero"
- For features: class="features"
- For grids: class="grid grid-3"

Example:
<section class="hero">
  <div class="container">
    <h1>${section.heading}</h1>
    <p>${section.content}</p>
    <a href="#" class="btn">${section.button_text || "Learn More"}</a>
  </div>
</section>

Return ONLY section HTML. No DOCTYPE, no html, no body.
`;

  const response = await groq.chat.completions.create({
    model: "qwen/qwen3.8-27b",
    messages: [
      { role: "system", content: "Generate section HTML using provided CSS classes only." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 400,
  });

  return response.choices[0]?.message?.content || "";
}

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
    const brandVoice = safeString(profile.brand_voice, "Professional");
    const preferredLanguage = safeString(profile.preferred_language, "English");
    const mainGoals = safeString(profile.main_goals, "Generate leads");
    const targetCustomers = safeString(profile.target_customers, "General audience");
    const restrictedClaims = safeString(profile.restricted_claims, "");
    
    const requiredPages = parseJsonArray(profile.required_pages, ['Home', 'About', 'Services', 'Contact']);
    const productsServices = parseJsonArray(profile.products_services, []);
    const existingBrandColors = parseJsonArray(profile.existing_brand_colors, []);
    const contactInformation = parseJsonObject(profile.contact_information, {});

    console.log("📦 Business:", businessName);

    // ============ CHUNK 1: CONTENT ============
    const contentPrompt = `
Generate content for ${businessName} (${industry}).

Business: ${businessDescription}
Pages: ${JSON.stringify(requiredPages)}
Services: ${JSON.stringify(productsServices)}
Brand voice: ${brandVoice}
Language: ${preferredLanguage}

Return JSON with ALL pages:
{
  "pages": [
    {
      "page_name": "Home",
      "title": "SEO Title",
      "meta_description": "SEO description",
      "sections": [
        {"section_type": "hero", "heading": "Heading", "content": "Content", "button_text": "Button"}
      ]
    }
  ],
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
    "font_family": "Inter",
    "font_size_base": "16px",
    "font_size_small": "14px",
    "font_size_heading": "32px",
    "font_size_large": "48px",
    "border_radius": "8px"
  }
}
`;

    const contentResponse = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        { role: "system", content: "Return ONLY valid JSON with ALL pages." },
        { role: "user", content: contentPrompt }
      ],
      temperature: 0.7,
      max_tokens: 900,
      response_format: { type: "json_object" }
    });

    const contentText = contentResponse.choices[0]?.message?.content || '{}';
    const content = JSON.parse(contentText.replace(/```json/g, '').replace(/```/g, '').trim());

    console.log("✅ Content generated");
    console.log("📊 Pages:", content.pages?.length || 0);

    // ============ CSS (Pre-built) ============
    const css = generateCSS(content.color_scheme);
    console.log("✅ CSS generated from template");

    // ============ HTML PER PAGE ============
    const pageNames = content.pages.map((p: any) => p.page_name);
    const previewHtml: Record<string, string> = {};

    for (const page of content.pages) {
      console.log(`📄 Generating: ${page.page_name}`);

      const header = await generateHeader(
        content.color_scheme,
        businessName,
        pageNames,
        page.page_name,
      );

      const footer = await generateFooter(
        content.color_scheme,
        businessName,
        contactInformation,
      );

      const sectionsHtml: string[] = [];
      for (const section of page.sections) {
        const sectionHtml = await generateSectionHTML(section, page.page_name);
        if (sectionHtml && !sectionHtml.includes("```html")) {
          sectionsHtml.push(sectionHtml);
        }
      }

      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${page.meta_description || ''}">
  <title>${page.title || page.page_name}</title>
  <style>${css}</style>
</head>
<body>
  ${header}
  <main>
    ${sectionsHtml.join('\n')}
  </main>
  ${footer}
</body>
</html>`;

      previewHtml[page.page_name] = fullHtml;
      console.log(`✅ ${page.page_name} completed`);
    }

    // ============ SAVE ============
    const finalContent = {
      ...content,
      preview_html: previewHtml,
      css: css,
    };

    await db.execute(sql`
      INSERT INTO ai_generation (
        project_id, user_id, type, input, output, model, tokens_used, status
      ) VALUES (
        ${projectId}, ${userId}, 'website_generation',
        ${JSON.stringify({ profile: { business_name: businessName, industry } })}::jsonb,
        ${JSON.stringify(finalContent)}::jsonb,
        'qwen3.8-27b', 0, 'draft'
      )
    `);

    console.log("✅ Saved to database");

    await db.execute(sql`
      UPDATE project SET 
        progress = 60, 
        current_step = 'content',
        status = 'in_progress'
      WHERE id = ${projectId}
    `);

    return NextResponse.json({
      success: true,
      message: "Website generated successfully",
      data: { content: finalContent, previewHtml },
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}