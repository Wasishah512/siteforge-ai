import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { generateCompleteHTML } from "@/lib/htmlGenerator";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "" 
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, editType, prompt, targetData, currentContent } = body;

    console.log("🔄 AI Edit started...");
    console.log("Edit type:", editType);

    if (!projectId || !editType || !prompt) {
      return NextResponse.json(
        { success: false, error: "projectId, editType, and prompt are required" },
        { status: 400 }
      );
    }

    // Current content fetch karo
    const result = await db.execute(sql`
      SELECT output FROM ai_generation 
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No content found" },
        { status: 404 }
      );
    }

    let content = result.rows[0].output;
    if (typeof content === 'string') {
      content = JSON.parse(content);
    }

    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      return NextResponse.json(
        { success: false, error: "Invalid content structure" },
        { status: 500 }
      );
    }

    let updatedContent: Record<string, any> = { ...content };

    switch (editType) {
      case "section": {
        const { pageName, sectionIndex } = targetData;
        const page = updatedContent.pages.find((p: any) => p.page_name === pageName);
        if (!page || !page.sections[sectionIndex]) {
          return NextResponse.json(
            { success: false, error: "Section not found" },
            { status: 404 }
          );
        }

        const section = page.sections[sectionIndex];

        const editPrompt = `
Edit this website section content.

CURRENT SECTION:
Type: ${section.section_type}
Heading: ${section.heading}
Content: ${section.content}
Button: ${section.button_text || "None"}

USER INSTRUCTION:
${prompt}

Return JSON:
{
  "section_type": "${section.section_type}",
  "heading": "Updated heading",
  "content": "Updated content",
  "button_text": "Updated button text"
}
`;

        const editResponse = await groq.chat.completions.create({
          model: "qwen/qwen3.8-27b",
          messages: [
            { role: "system", content: "Edit section content. Return ONLY valid JSON." },
            { role: "user", content: editPrompt }
          ],
          temperature: 0.5,
          max_tokens: 500,
          response_format: { type: "json_object" }
        });

        const editedText = editResponse.choices[0]?.message?.content || '{}';
        const editedSection = JSON.parse(editedText.replace(/```json/g, '').replace(/```/g, '').trim());

        updatedContent.pages = updatedContent.pages.map((p: any) => {
          if (p.page_name === pageName) {
            const newSections = [...p.sections];
            newSections[sectionIndex] = {
              ...newSections[sectionIndex],
              ...editedSection,
            };
            return { ...p, sections: newSections };
          }
          return p;
        });

        console.log("✅ Section edited");
        break;
      }

      case "service": {
        const { serviceIndex } = targetData;
        if (!updatedContent.services || !updatedContent.services[serviceIndex]) {
          return NextResponse.json(
            { success: false, error: "Service not found" },
            { status: 404 }
          );
        }

        const service = updatedContent.services[serviceIndex];

        const editPrompt = `
Edit this service.

CURRENT SERVICE:
Name: ${service.service_name}
Description: ${service.description}
Features: ${JSON.stringify(service.features)}

USER INSTRUCTION:
${prompt}

Return JSON:
{
  "service_name": "Updated name",
  "description": "Updated description",
  "features": ["Feature 1", "Feature 2"]
}
`;

        const editResponse = await groq.chat.completions.create({
          model: "qwen/qwen3.8-27b",
          messages: [
            { role: "system", content: "Edit service. Return ONLY valid JSON." },
            { role: "user", content: editPrompt }
          ],
          temperature: 0.5,
          max_tokens: 500,
          response_format: { type: "json_object" }
        });

        const editedText = editResponse.choices[0]?.message?.content || '{}';
        const editedService = JSON.parse(editedText.replace(/```json/g, '').replace(/```/g, '').trim());

        updatedContent.services[serviceIndex] = {
          ...updatedContent.services[serviceIndex],
          ...editedService,
        };

        console.log("✅ Service edited");
        break;
      }

      case "faq": {
        const { faqIndex } = targetData;
        if (!updatedContent.faqs || !updatedContent.faqs[faqIndex]) {
          return NextResponse.json(
            { success: false, error: "FAQ not found" },
            { status: 404 }
          );
        }

        const faq = updatedContent.faqs[faqIndex];

        const editPrompt = `
Edit this FAQ.

CURRENT FAQ:
Question: ${faq.question}
Answer: ${faq.answer}
Category: ${faq.category}

USER INSTRUCTION:
${prompt}

Return JSON:
{
  "question": "Updated question",
  "answer": "Updated answer",
  "category": "Updated category"
}
`;

        const editResponse = await groq.chat.completions.create({
          model: "qwen/qwen3.8-27b",
          messages: [
            { role: "system", content: "Edit FAQ. Return ONLY valid JSON." },
            { role: "user", content: editPrompt }
          ],
          temperature: 0.5,
          max_tokens: 500,
          response_format: { type: "json_object" }
        });

        const editedText = editResponse.choices[0]?.message?.content || '{}';
        const editedFAQ = JSON.parse(editedText.replace(/```json/g, '').replace(/```/g, '').trim());

        updatedContent.faqs[faqIndex] = {
          ...updatedContent.faqs[faqIndex],
          ...editedFAQ,
        };

        console.log("✅ FAQ edited");
        break;
      }

      case "seo": {
        const editPrompt = `
Edit SEO metadata.

CURRENT METADATA:
Title: ${updatedContent.metadata?.site_title}
Description: ${updatedContent.metadata?.site_description}
Keywords: ${JSON.stringify(updatedContent.metadata?.keywords)}

USER INSTRUCTION:
${prompt}

Return JSON:
{
  "metadata": {
    "site_title": "Updated title",
    "site_description": "Updated description",
    "keywords": ["keyword1", "keyword2"]
  }
}
`;

        const editResponse = await groq.chat.completions.create({
          model: "qwen/qwen3.8-27b",
          messages: [
            { role: "system", content: "Edit SEO. Return ONLY valid JSON." },
            { role: "user", content: editPrompt }
          ],
          temperature: 0.5,
          max_tokens: 500,
          response_format: { type: "json_object" }
        });

        const editedText = editResponse.choices[0]?.message?.content || '{}';
        const editedSEO = JSON.parse(editedText.replace(/```json/g, '').replace(/```/g, '').trim());

        updatedContent.metadata = {
          ...updatedContent.metadata,
          ...editedSEO.metadata,
        };

        console.log("✅ SEO edited");
        break;
      }

      case "color": {
        const editPrompt = `
Edit color scheme.

CURRENT COLORS:
${JSON.stringify(updatedContent.color_scheme)}

USER INSTRUCTION:
${prompt}

Return JSON with all color fields:
{
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
    "font_family": "Font name",
    "font_size_base": "16px",
    "font_size_small": "14px",
    "font_size_heading": "32px",
    "font_size_large": "48px",
    "border_radius": "8px"
  }
}
`;

        const editResponse = await groq.chat.completions.create({
          model: "qwen/qwen3.8-27b",
          messages: [
            { role: "system", content: "Edit color scheme. Return ONLY valid JSON." },
            { role: "user", content: editPrompt }
          ],
          temperature: 0.5,
          max_tokens: 700,
          response_format: { type: "json_object" }
        });

        const editedText = editResponse.choices[0]?.message?.content || '{}';
        const editedColors = JSON.parse(editedText.replace(/```json/g, '').replace(/```/g, '').trim());

        updatedContent.color_scheme = {
          ...updatedContent.color_scheme,
          ...editedColors.color_scheme,
        };

        console.log("✅ Colors edited");
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid edit type" },
          { status: 400 }
        );
    }

    // ============ MANUAL HTML REGENERATION ============
    console.log("🔄 Regenerating HTML manually...");

    const pageNames = updatedContent.pages.map((p: any) => p.page_name);
    const previewHtml: Record<string, string> = {};

    for (const page of updatedContent.pages) {
      const html = generateCompleteHTML(
        page,
        updatedContent.color_scheme,
        updatedContent.metadata?.site_title || "Website",
        pageNames,
      );
      previewHtml[page.page_name] = html;
    }

    updatedContent.preview_html = previewHtml;

    console.log("✅ HTML regenerated");

    // ============ SAVE ============
    await db.execute(sql`
      UPDATE ai_generation 
      SET output = ${JSON.stringify(updatedContent)}::jsonb,
          status = 'in_progress',
          completed_at = NOW()
      WHERE project_id = ${projectId}
    `);

    console.log("✅ Saved to database");

    return NextResponse.json({
      success: true,
      message: "Content edited successfully",
      updatedContent,
    });

  } catch (error) {
    console.error("❌ Edit error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to edit content",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}