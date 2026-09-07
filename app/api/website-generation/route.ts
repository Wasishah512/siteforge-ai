import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { generateCompleteHTML } from "@/lib/htmlGenerator";
import { sendGenerationReadyEmail } from "@/lib/Emails/generationReady";

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

    // ============ ALL BUSINESS PROFILE DATA ============
    const businessName = safeString(profile.business_name, "Business");
    const businessDescription = safeString(profile.business_description, "");
    const industry = safeString(profile.industry, "General");
    const location = safeString(profile.location, "N/A");
    const serviceArea = safeString(profile.service_area, "N/A");
    const brandVoice = safeString(profile.brand_voice, "Professional");
    const preferredLanguage = safeString(profile.preferred_language, "English");
    const mainGoals = safeString(profile.main_goals, "Generate leads");
    const targetCustomers = safeString(profile.target_customers, "General audience");
    const restrictedClaims = safeString(profile.restricted_claims, "");
    const imagePreferences = safeString(profile.image_preferences, "Professional");
    
    const requiredPages = parseJsonArray(profile.required_pages, ['Home', 'About', 'Services', 'Contact']);
    const productsServices = parseJsonArray(profile.products_services, []);
    const primaryCtas = parseJsonArray(profile.primary_ctas, []);
    const competitorReferences = parseJsonArray(profile.competitor_references, []);
    const existingBrandColors = parseJsonArray(profile.existing_brand_colors, []);
    const contactInformation = parseJsonObject(profile.contact_information, {});
    const socialLinks = parseJsonObject(profile.social_links, {});

    console.log("📦 Business:", businessName);
    console.log("🏢 Industry:", industry);
    console.log("📍 Location:", location);
    console.log("🎯 Target:", targetCustomers);
    console.log("🎯 Goals:", mainGoals);
    console.log("📄 Pages:", requiredPages);
    console.log("🛠️ Services:", productsServices);
    console.log("📢 CTAs:", primaryCtas);

    // ============ CONTENT GENERATION ============
    console.log("📝 Generating content...");

    const contentPrompt = `
Generate a complete website for this business:

=== BUSINESS PROFILE ===
Name: ${businessName}
Description: ${businessDescription}
Industry: ${industry}
Location: ${location}
Service Area: ${serviceArea}

=== TARGET AUDIENCE ===
${targetCustomers}

=== BUSINESS GOALS ===
${mainGoals}

=== BRAND VOICE ===
${brandVoice}

=== LANGUAGE ===
${preferredLanguage}

=== SERVICES ===
${JSON.stringify(productsServices)}

=== PAGES NEEDED ===
${JSON.stringify(requiredPages)}

=== CALL TO ACTIONS ===
Use these CTAs in buttons: ${JSON.stringify(primaryCtas.length > 0 ? primaryCtas : ["Learn More", "Contact Us", "Get Started", "Shop Now"])}

=== COMPETITORS ===
${JSON.stringify(competitorReferences)}

=== CONTACT INFO ===
${JSON.stringify(contactInformation)}

=== SOCIAL LINKS ===
${JSON.stringify(socialLinks)}

=== IMAGE PREFERENCES ===
${imagePreferences}

=== RESTRICTED CLAIMS (AVOID) ===
${restrictedClaims || "None"}

=== CRITICAL REQUIREMENTS ===
1. Write content that appeals to: ${targetCustomers}
2. Content should achieve: ${mainGoals}
3. Use brand voice: ${brandVoice}
4. EVERY section MUST have button_text (CTA)
5. EVERY page MUST have at least 2 sections
6. Hero sections MUST have image_prompt
7. Content should mention location: ${location}
8. Content should mention service area: ${serviceArea}
9. Generate at least 4 FAQs
10. Generate complete color scheme
11. Generate sitemap array with all pages

Return JSON with ALL these fields:
{
  "sitemap": [
    {"page_name": "Home", "slug": "home", "parent_page": null, "order": 1}
  ],
  "pages": [
    {
      "page_name": "Home",
      "title": "SEO Title for ${businessName}",
      "meta_description": "SEO description targeting ${targetCustomers}",
      "sections": [
        {
          "section_type": "hero",
          "heading": "Heading for ${targetCustomers}",
          "content": "Content about ${mainGoals}",
          "button_text": "Shop Now",
          "image_prompt": "Image showing ${businessName} services"
        },
        {
          "section_type": "cta",
          "heading": "Ready to start?",
          "content": "Contact us today",
          "button_text": "Contact Us"
        }
      ]
    }
  ],
  "services": [
    {"service_name": "...", "description": "...", "features": ["..."]}
  ],
  "faqs": [
    {"question": "...", "answer": "...", "category": "general"}
  ],
  "metadata": {
    "site_title": "${businessName}",
    "site_description": "${businessDescription.slice(0, 150)}",
    "keywords": ["${businessName}", "${industry}", "${location}", "services"]
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
    "font_family": "Inter",
    "font_size_base": "16px",
    "font_size_small": "14px",
    "font_size_heading": "32px",
    "font_size_large": "48px",
    "border_radius": "8px"
  },
  "image_prompts": [
    {"page": "Home", "section": "hero", "prompt": "Image description"}
  ],
  "schema_suggestions": [
    {"schema_type": "LocalBusiness", "data": {}}
  ]
}
`;

    const contentResponse = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      messages: [
        { role: "system", content: "Professional website content generator. Return ONLY valid JSON. Include ALL requested fields including sitemap." },
        { role: "user", content: contentPrompt }
      ],
      temperature: 0.7,
      max_tokens: 900,
      response_format: { type: "json_object" }
    });

    const contentText = contentResponse.choices[0]?.message?.content || '{}';
    const content = JSON.parse(contentText.replace(/```json/g, '').replace(/```/g, '').trim());

    console.log("✅ Content generated from AI");
    console.log("📊 AI pages:", content.pages?.length || 0);
    console.log("📊 AI sitemap:", content.sitemap?.length || 0);
    console.log("📊 AI services:", content.services?.length || 0);
    console.log("📊 AI FAQs:", content.faqs?.length || 0);

    // ============ SITEMAP CHECK ============
    if (!content.sitemap || content.sitemap.length === 0) {
      content.sitemap = content.pages.map((page: any, index: number) => ({
        page_name: page.page_name,
        slug: page.page_name.toLowerCase().replace(/\s+/g, '-'),
        parent_page: null,
        order: index + 1
      }));
      console.log("✅ Generated sitemap from pages");
    }

    // ============ MISSING DATA CHECK ============
    
    // 1. Pages check
    if (!content.pages || content.pages.length === 0) {
      content.pages = requiredPages.map((pageName: string) => ({
        page_name: pageName,
        title: `${pageName} | ${businessName}`,
        meta_description: `${pageName} for ${businessName} in ${location}`,
        sections: [
          {
            section_type: "hero",
            heading: `${pageName} - ${businessName}`,
            content: `Welcome to ${businessName}. We serve ${targetCustomers} in ${location}.`,
            button_text: primaryCtas[0] || "Contact Us",
            image_prompt: `${businessName} ${pageName}`
          },
          {
            section_type: "cta",
            heading: "Get Started Today",
            content: `Contact ${businessName} for ${productsServices[0] || "our services"}.`,
            button_text: primaryCtas[1] || "Learn More"
          }
        ]
      }));
      console.log("✅ Added default pages with CTAs");
    }

    // 2. Missing pages check
    const generatedPages = content.pages.map((p: any) => p.page_name);
    const missingPages = requiredPages.filter((p: string) => !generatedPages.includes(p));

    if (missingPages.length > 0) {
      console.log(`⚠️ Missing pages: ${missingPages.join(', ')}`);
      missingPages.forEach((pageName: string) => {
        content.pages.push({
          page_name: pageName,
          title: `${pageName} | ${businessName}`,
          meta_description: `${pageName} for ${businessName}`,
          sections: [
            {
              section_type: "hero",
              heading: pageName,
              content: `Welcome to our ${pageName} page`,
              button_text: primaryCtas[0] || "Contact Us",
              image_prompt: `${businessName} ${pageName}`
            }
          ]
        });
      });
    }

    // 3. Sitemap sync with pages
    const finalPageNames = content.pages.map((p: any) => p.page_name);
    const sitemapNames = content.sitemap.map((s: any) => s.page_name);
    const missingSitemapPages = finalPageNames.filter((p: string) => !sitemapNames.includes(p));
    
    if (missingSitemapPages.length > 0) {
      missingSitemapPages.forEach((pageName: string) => {
        content.sitemap.push({
          page_name: pageName,
          slug: pageName.toLowerCase().replace(/\s+/g, '-'),
          parent_page: null,
          order: content.sitemap.length + 1
        });
      });
      console.log("✅ Synced sitemap with pages");
    }

    // 4. Ensure every section has button_text
    content.pages.forEach((page: any) => {
      page.sections.forEach((section: any) => {
        if (!section.button_text) {
          section.button_text = primaryCtas[0] || "Learn More";
        }
        if (!section.image_prompt && section.section_type === "hero") {
          section.image_prompt = `${businessName} ${page.page_name} hero image`;
        }
      });
    });

    // 5. Services check
    if (!content.services || content.services.length === 0) {
      content.services = productsServices.map((service: string) => ({
        service_name: service,
        description: `${service} by ${businessName}. We serve ${targetCustomers} in ${location}.`,
        features: ["Professional service", "Quality guaranteed", "Affordable pricing"]
      }));
      console.log("✅ Added default services");
    }

    // 6. FAQs check
    if (!content.faqs || content.faqs.length === 0) {
      content.faqs = [
        {
          question: `What services does ${businessName} offer?`,
          answer: `We offer ${productsServices.slice(0, 3).join(', ')} and more. Contact us for details.`,
          category: "general"
        },
        {
          question: `Where is ${businessName} located?`,
          answer: `We are located in ${location} and serve ${serviceArea}.`,
          category: "location"
        },
        {
          question: "How can I contact you?",
          answer: `You can reach us through our contact page or email.`,
          category: "general"
        },
        {
          question: "Do you offer free consultations?",
          answer: "Yes, we offer free initial consultations to understand your needs.",
          category: "general"
        }
      ];
      console.log("✅ Added default FAQs");
    }

    // 7. Color scheme check
    if (!content.color_scheme || Object.keys(content.color_scheme).length === 0) {
      content.color_scheme = {
        primary_color: existingBrandColors[0] || "#6366F1",
        secondary_color: existingBrandColors[1] || "#8B5CF6",
        accent_color: "#818CF8",
        background_color: "#FFFFFF",
        surface_color: "#F8F9FA",
        text_color: "#333333",
        heading_color: "#111111",
        muted_text_color: "#6B7280",
        button_color: existingBrandColors[0] || "#6366F1",
        button_text_color: "#FFFFFF",
        button_hover_color: "#5558E6",
        link_color: "#6366F1",
        border_color: "#E5E7EB",
        font_family: "Inter, sans-serif",
        font_size_base: "16px",
        font_size_small: "14px",
        font_size_heading: "32px",
        font_size_large: "48px",
        border_radius: "8px"
      };
      console.log("✅ Added default color scheme");
    }

    // 8. Metadata check
    if (!content.metadata || !content.metadata.site_title) {
      content.metadata = {
        site_title: businessName,
        site_description: businessDescription.slice(0, 150),
        keywords: [
          businessName.toLowerCase(),
          industry.toLowerCase(),
          location.toLowerCase(),
          ...productsServices.slice(0, 3).map((s: string) => s.toLowerCase()),
          "best services",
          "affordable"
        ]
      };
      console.log("✅ Added default metadata");
    }

    console.log(`📊 Final pages: ${content.pages.length}`);
    console.log(`📊 Final sitemap: ${content.sitemap.length}`);
    console.log(`📊 Final services: ${content.services.length}`);
    console.log(`📊 Final FAQs: ${content.faqs.length}`);
    console.log(`📊 Color scheme: ${Object.keys(content.color_scheme).length} fields`);
    console.log(`📊 Metadata: ${content.metadata ? "✅" : "❌"}`);

    // ============ MANUAL HTML GENERATION ============
    console.log("📝 Generating HTML manually...");

    const pageNames = content.pages.map((p: any) => p.page_name);
    const previewHtml: Record<string, string> = {};

    for (const page of content.pages) {
      const html = generateCompleteHTML(
        page,
        content.color_scheme,
        businessName,
        pageNames,
      );
      previewHtml[page.page_name] = html;
      console.log(`✅ ${page.page_name} HTML generated`);
    }

    // ============ SAVE ============
    const finalContent = {
      ...content,
      preview_html: previewHtml,
    };

    await db.execute(sql`
      INSERT INTO ai_generation (
        project_id, user_id, type, input, output, model, tokens_used, status
      ) VALUES (
        ${projectId}, ${userId}, 'website_generation',
        ${JSON.stringify({ 
          profile: { 
            business_name: businessName, 
            industry,
            target_customers: targetCustomers,
            main_goals: mainGoals,
            location
          } 
        })}::jsonb,
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

    // ============ SEND EMAIL ============
try {
  const userResult = await db.execute(sql`
    SELECT email, name FROM "user" WHERE id = ${userId}
  `);
  
  const user = userResult.rows[0] as any;
  
  if (user?.email) {
    await sendGenerationReadyEmail(
      user.email,
      user.name || "User",
      content.pages.length,
      content.services.length,
      content.faqs.length,
    );
    console.log("✅ Email sent to:", user.email);
  } else {
    console.log("⚠️ No email found for user");
  }
} catch (emailError) {
  console.error("⚠️ Email sending failed (non-critical):", emailError);
}

    return NextResponse.json({
      success: true,
      message: "Website generated successfully",
      data: { 
        content: finalContent, 
        previewHtml,
        pagesCount: content.pages.length,
        sitemapCount: content.sitemap.length,
        servicesCount: content.services.length,
        faqsCount: content.faqs.length,
        hasColorScheme: !!content.color_scheme,
        hasMetadata: !!content.metadata,
      },
    });

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate", details: error instanceof Error ? error.message : "Unknown" },
      { status: 500 }
    );
  }
}