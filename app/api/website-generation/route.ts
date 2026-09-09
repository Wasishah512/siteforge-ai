import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { generateCompleteHTML } from "@/lib/htmlGenerator";
import { sendGenerationReadyEmail } from "@/lib/Emails/generationReady";

// ============ TYPES & INTERFACES ============
interface PageSection {
  section_type: string;
  heading: string;
  content: string;
  button_text: string;
  image_prompt: string;
}

interface PageContent {
  title: string;
  meta_description: string;
  sections: PageSection[];
}

interface Page {
  page_name: string;
  title: string;
  meta_description: string;
  sections: PageSection[];
}

interface ColorScheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  surface_color: string;
  text_color: string;
  heading_color: string;
  muted_text_color: string;
  button_color: string;
  button_text_color: string;
  button_hover_color: string;
  link_color: string;
  border_color: string;
  font_family: string;
  font_size_base: string;
  font_size_small: string;
  font_size_heading: string;
  font_size_large: string;
  border_radius: string;
}

interface Service {
  service_name: string;
  description: string;
  features: string[];
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

interface SitemapEntry {
  page_name: string;
  slug: string;
  parent_page: string | null;
  order: number;
}

interface WebsiteContent {
  pages: Page[];
  color_scheme: ColorScheme;
  services: Service[];
  faqs: FAQ[];
  sitemap: SitemapEntry[];
}

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "" 
});

// ============ CLEAN COLOR HELPER ============
function cleanColor(color: string): string {
  if (!color) return "#6366F1";
  const hexMatch = color.match(/#[0-9A-Fa-f]{6}/);
  return hexMatch ? hexMatch[0] : "#6366F1";
}

// ============ DYNAMIC PAGE CONTENT GENERATOR ============
function generatePageContent(
  pageName: string,
  businessName: string,
  industry: string,
  location: string,
  targetCustomers: string,
  mainGoals: string,
  productsServices: string[],
  serviceArea: string,
  primaryCtas: string[],
): any {
  const cleanCta = (cta: string) => cta?.replace(/^[-•\s]+/, '').trim() || "Contact Us";
  const cta1 = cleanCta(primaryCtas[0] || "Contact Us");
  const cta2 = cleanCta(primaryCtas[1] || "Learn More");

  const pageTemplates: Record<string, any> = {
    "Home": {
      title: `${businessName} | ${industry} in ${location}`,
      meta_description: `${businessName} offers ${productsServices.slice(0, 3).join(', ')} for ${targetCustomers} in ${location}.`,
      sections: [
        { section_type: "hero", heading: `${businessName} - ${industry} Excellence`, content: `Welcome to ${businessName}. We provide ${productsServices.slice(0, 3).join(', ')} for ${targetCustomers} in ${location}.`, button_text: cta1, image_prompt: `${businessName} hero` },
        { section_type: "features", heading: `Why Choose ${businessName}?`, content: `Our goal is to ${mainGoals}. We serve ${targetCustomers} with professional ${industry} solutions.`, button_text: cta2, image_prompt: `${businessName} features` },
        { section_type: "services_overview", heading: "Our Services", content: productsServices.join(', '), button_text: "View All Services", image_prompt: `${businessName} services` },
        { section_type: "cta", heading: "Ready to Get Started?", content: `Contact ${businessName} today and let us help you ${mainGoals}.`, button_text: cta1, image_prompt: `${businessName} cta` }
      ]
    },
    "About": {
      title: `About ${businessName} | ${industry} in ${location}`,
      meta_description: `Learn about ${businessName}, our mission, values, and commitment to serving ${targetCustomers}.`,
      sections: [
        { section_type: "hero", heading: `About ${businessName}`, content: `${businessName} is a leading ${industry} company based in ${location}.`, button_text: cta2, image_prompt: `${businessName} about` },
        { section_type: "story", heading: "Our Story", content: `Founded to serve ${targetCustomers}, ${businessName} provides ${productsServices.join(', ')} with excellence.`, button_text: "Our Journey", image_prompt: `${businessName} story` },
        { section_type: "values", heading: "Our Core Values", content: `Integrity, quality, and customer satisfaction drive ${businessName}.`, button_text: "Our Values", image_prompt: `${businessName} values` },
        { section_type: "cta", heading: "Work With Us", content: `Partner with ${businessName} for all your ${industry} needs.`, button_text: cta1, image_prompt: `${businessName} about cta` }
      ]
    },
    "Services": {
      title: `Our Services | ${businessName}`,
      meta_description: `Explore ${businessName}'s services: ${productsServices.join(', ')} for ${targetCustomers}.`,
      sections: [
        { section_type: "hero", heading: "Our Services", content: `${businessName} offers ${productsServices.join(', ')}.`, button_text: cta1, image_prompt: `${businessName} services` },
        { section_type: "services_grid", heading: "What We Offer", content: productsServices.join(', '), button_text: "Get Started", image_prompt: `${businessName} services grid` },
        { section_type: "cta", heading: "Need a Custom Solution?", content: `Contact ${businessName} for personalized ${industry} services.`, button_text: cta1, image_prompt: `${businessName} services cta` }
      ]
    },
    "Contact": {
      title: `Contact ${businessName} | ${location}`,
      meta_description: `Get in touch with ${businessName} in ${location}. We serve ${targetCustomers} across ${serviceArea}.`,
      sections: [
        { section_type: "hero", heading: "Contact Us", content: `Have questions? Reach out to ${businessName} in ${location}.`, button_text: "Send Message", image_prompt: `${businessName} contact` },
        { section_type: "contact_form", heading: "Send Us a Message", content: `Fill out the form and we'll respond within 24 hours.`, button_text: "Submit", image_prompt: `${businessName} contact form` },
        { section_type: "contact_info", heading: "Our Location", content: `Visit us in ${location}. We serve ${targetCustomers}.`, button_text: "Get Directions", image_prompt: `${businessName} location` }
      ]
    },
    "Blog": {
      title: `Blog | ${businessName}`,
      meta_description: `Insights, tips, and updates from ${businessName} about ${industry}.`,
      sections: [
        { section_type: "hero", heading: "Our Blog", content: `Latest insights about ${industry} from ${businessName}.`, button_text: "Read Articles", image_prompt: `${businessName} blog` },
        { section_type: "blog_grid", heading: "Latest Articles", content: `Expert tips for ${targetCustomers}.`, button_text: "Read More", image_prompt: `${businessName} blog grid` },
        { section_type: "cta", heading: "Subscribe for Updates", content: `Get ${industry} insights delivered to your inbox.`, button_text: "Subscribe", image_prompt: `${businessName} blog cta` }
      ]
    },
    "FAQ": {
      title: `FAQ | ${businessName}`,
      meta_description: `Frequently asked questions about ${businessName}'s services.`,
      sections: [
        { section_type: "hero", heading: "Frequently Asked Questions", content: `Find answers about ${businessName} and our services.`, button_text: "Contact Us", image_prompt: `${businessName} faq` },
        { section_type: "faq_accordion", heading: "Common Questions", content: `Questions about ${productsServices.join(', ')} answered.`, button_text: "Ask a Question", image_prompt: `${businessName} faq` },
        { section_type: "cta", heading: "Still Have Questions?", content: `Contact ${businessName} in ${location}.`, button_text: cta1, image_prompt: `${businessName} faq cta` }
      ]
    },
    "Pricing": {
      title: `Pricing | ${businessName}`,
      meta_description: `Affordable pricing for ${productsServices.slice(0, 3).join(', ')}.`,
      sections: [
        { section_type: "hero", heading: "Our Pricing", content: `Transparent pricing for ${productsServices.join(', ')}.`, button_text: "Get Quote", image_prompt: `${businessName} pricing` },
        { section_type: "pricing_cards", heading: "Choose Your Plan", content: `Flexible pricing for ${targetCustomers}.`, button_text: "Select Plan", image_prompt: `${businessName} pricing plans` },
        { section_type: "cta", heading: "Need Custom Pricing?", content: `Contact ${businessName} for a personalized quote.`, button_text: cta1, image_prompt: `${businessName} pricing cta` }
      ]
    }
  };

  const template = pageTemplates[pageName];

  if (template) {
    return template;
  }

  // Default for any other page (Shop, Track Order, Return Policy, etc.)
  return {
    title: `${pageName} | ${businessName}`,
    meta_description: `${pageName} - ${businessName} provides ${productsServices.slice(0, 3).join(', ')} for ${targetCustomers} in ${location}.`,
    sections: [
      { section_type: "hero", heading: pageName, content: `Welcome to ${businessName}'s ${pageName} page.`, button_text: cta1, image_prompt: `${businessName} ${pageName}` },
      { section_type: "content", heading: `About Our ${pageName}`, content: `${businessName} serves ${targetCustomers} in ${location} and ${serviceArea}.`, button_text: cta2, image_prompt: `${businessName} ${pageName} content` },
      { section_type: "cta", heading: "Get In Touch", content: `Contact ${businessName} today to learn more about our ${pageName}.`, button_text: cta1, image_prompt: `${businessName} ${pageName} cta` }
    ]
  };
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
    const existingBrandColors = parseJsonArray(profile.existing_brand_colors, []);
    const contactInformation = parseJsonObject(profile.contact_information, {});

    console.log("📦 Business:", businessName);
    console.log("📄 Required pages:", requiredPages);
    console.log("🎨 Brand colors:", existingBrandColors);

    // ============ GENERATE ALL PAGES (GUARANTEED) ============
    console.log("📝 Generating all pages...");

    const allPages:any[] = [];

    requiredPages.forEach((pageName: string, index: number) => {
      const dynamicContent = generatePageContent(
        pageName,
        businessName,
        industry,
        location,
        targetCustomers,
        mainGoals,
        productsServices,
        serviceArea,
        primaryCtas,
      );

      allPages.push({
        page_name: pageName,
        title: dynamicContent.title,
        meta_description: dynamicContent.meta_description,
        sections: dynamicContent.sections,
      });

      console.log(`  ✓ ${pageName} (${dynamicContent.sections.length} sections)`);
    });

    const content: any = {};
    content.pages = allPages;

    console.log(`✅ Generated ${content.pages.length} pages`);

    // ============ COLOR SCHEME ============
    content.color_scheme = {
      primary_color: cleanColor(existingBrandColors[0] || "#6366F1"),
      secondary_color: cleanColor(existingBrandColors[1] || "#8B5CF6"),
      accent_color: "#818CF8",
      background_color: "#FFFFFF",
      surface_color: "#F8F9FA",
      text_color: "#333333",
      heading_color: "#111111",
      muted_text_color: "#6B7280",
      button_color: cleanColor(existingBrandColors[0] || "#6366F1"),
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

    console.log("✅ Color scheme generated");

    // ============ SERVICES ============
    content.services = productsServices.map((service: string) => ({
      service_name: service,
      description: `${service} by ${businessName} for ${targetCustomers}.`,
      features: ["Professional service", "Quality guaranteed", "Affordable pricing"]
    }));

    console.log(`✅ Generated ${content.services.length} services`);

    // ============ FAQS ============
    content.faqs = [
      { question: `What services does ${businessName} offer?`, answer: `We offer ${productsServices.join(', ')}.`, category: "general" },
      { question: `Where is ${businessName} located?`, answer: `We are in ${location} serving ${serviceArea}.`, category: "location" },
      { question: "How can I contact you?", answer: "Contact us through our contact page.", category: "general" },
      { question: "Do you offer free consultations?", answer: "Yes, we offer free initial consultations.", category: "general" }
    ];

    console.log(`✅ Generated ${content.faqs.length} FAQs`);

    // ============ SITEMAP ============
    content.sitemap = content.pages.map((page: any, index: number) => ({
      page_name: page.page_name,
      slug: page.page_name.toLowerCase().replace(/\s+/g, '-'),
      parent_page: null,
      order: index + 1
    }));

    console.log(`✅ Generated sitemap with ${content.sitemap.length} pages`);

    // ============ METADATA ============
    content.metadata = {
      site_title: businessName,
      site_description: businessDescription.slice(0, 150),
      keywords: [
        businessName.toLowerCase(),
        industry.toLowerCase(),
        location.toLowerCase(),
        ...productsServices.slice(0, 3).map(s => s.toLowerCase())
      ]
    };

    console.log("✅ Metadata generated");

    // ============ HTML GENERATION ============
    console.log("📝 Generating HTML for all pages...");

    const pageNames = content.pages.map((p: any) => p.page_name);
    const previewHtml: Record<string, string> = {};

    for (const page of content.pages) {
      const html = generateCompleteHTML(
        page,
        content.color_scheme,
        businessName,
        pageNames,
        contactInformation,
        industry,
        productsServices,
      );
      
      previewHtml[page.page_name] = html;
      console.log(`✅ ${page.page_name} HTML generated`);
    }

    console.log(`📊 Total HTML pages: ${Object.keys(previewHtml).length}`);

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
        ${JSON.stringify({ profile: { business_name: businessName, industry } })}::jsonb,
        ${JSON.stringify(finalContent)}::jsonb,
        'dynamic-template', 0, 'draft'
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
      }
    } catch (emailError) {
      console.error("⚠️ Email sending failed:", emailError);
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