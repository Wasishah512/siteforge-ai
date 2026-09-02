import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, projectId, ...profileData } = body;

    if (!profileData.businessName || !profileData.businessDescription) {
      return NextResponse.json(
        { error: "Business name and description are required" },
        { status: 400 }
      );
    }

    let finalProjectId = projectId;

    // If no projectId, create new project
    if (!finalProjectId) {
      if (!workspaceId) {
        return NextResponse.json(
          { error: "Workspace ID is required" },
          { status: 400 }
        );
      }

      let slug = generateSlug(profileData.businessName);
      let counter = 1;

      // Check unique slug
      while (true) {
        const existing = await db.execute(sql`
          SELECT id FROM project 
          WHERE workspace_id = ${workspaceId} AND slug = ${slug}
          LIMIT 1
        `);
        
        if (existing.rows.length === 0) break;
        slug = `${generateSlug(profileData.businessName)}-${counter}`;
        counter++;
      }

      // Create new project with correct enum values
      const newProject = await db.execute(sql`
        INSERT INTO project (workspace_id, name, slug, type, status, progress, current_step)
        VALUES (
          ${workspaceId}, 
          ${profileData.businessName}, 
          ${slug}, 
          'client_website', 
          'in_progress', 
          25, 
          'business_profile'
        )
        RETURNING *
      `);
      
      finalProjectId = newProject.rows[0].id;
    }

    // Check if business profile exists
    const existing = await db.execute(sql`
      SELECT id FROM business_profile WHERE project_id = ${finalProjectId}
    `);

    let result;

    if (existing.rows.length > 0) {
      // Update existing profile
      result = await db.execute(sql`
        UPDATE business_profile SET 
          business_name = ${profileData.businessName},
          business_description = ${profileData.businessDescription},
          industry = ${profileData.industry || null},
          location = ${profileData.location || null},
          service_area = ${profileData.serviceArea || null},
          target_customers = ${profileData.targetCustomers || null},
          products_services = ${JSON.stringify(profileData.productsServices || [])}::jsonb,
          main_goals = ${profileData.mainGoals || null},
          brand_voice = ${profileData.brandVoice || "Professional"},
          preferred_language = ${profileData.preferredLanguage || "English"},
          primary_ctas = ${JSON.stringify(profileData.primaryCTAs || [])}::jsonb,
          competitor_references = ${JSON.stringify(profileData.competitorReferences || [])}::jsonb,
          social_links = ${JSON.stringify(profileData.socialLinks || {})}::jsonb,
          contact_information = ${JSON.stringify(profileData.contactInformation || {})}::jsonb,
          existing_brand_colors = ${JSON.stringify(profileData.existingBrandColors || [])}::jsonb,
          image_preferences = ${profileData.imagePreferences || null},
          required_pages = ${JSON.stringify(profileData.requiredPages || [])}::jsonb,
          restricted_claims = ${profileData.restrictedClaims || null},
          updated_at = NOW()
        WHERE project_id = ${finalProjectId}
        RETURNING *
      `);
    } else {
      // Create new profile
      result = await db.execute(sql`
        INSERT INTO business_profile (
          project_id, business_name, business_description, industry, location,
          service_area, target_customers, products_services, main_goals, brand_voice,
          preferred_language, primary_ctas, competitor_references, social_links,
          contact_information, existing_brand_colors, image_preferences, required_pages,
          restricted_claims
        ) VALUES (
          ${finalProjectId},
          ${profileData.businessName},
          ${profileData.businessDescription},
          ${profileData.industry || null},
          ${profileData.location || null},
          ${profileData.serviceArea || null},
          ${profileData.targetCustomers || null},
          ${JSON.stringify(profileData.productsServices || [])}::jsonb,
          ${profileData.mainGoals || null},
          ${profileData.brandVoice || "Professional"},
          ${profileData.preferredLanguage || "English"},
          ${JSON.stringify(profileData.primaryCTAs || [])}::jsonb,
          ${JSON.stringify(profileData.competitorReferences || [])}::jsonb,
          ${JSON.stringify(profileData.socialLinks || {})}::jsonb,
          ${JSON.stringify(profileData.contactInformation || {})}::jsonb,
          ${JSON.stringify(profileData.existingBrandColors || [])}::jsonb,
          ${profileData.imagePreferences || null},
          ${JSON.stringify(profileData.requiredPages || [])}::jsonb,
          ${profileData.restrictedClaims || null}
        )
        RETURNING *
      `);
    }

    // Update project progress with correct enum value
    await db.execute(sql`
      UPDATE project SET 
        progress = 25, 
        status = 'in_progress',
        current_step = 'sitemap',
        updated_at = NOW()
      WHERE id = ${finalProjectId}
    `);

    // Get updated project
    const projectData = await db.execute(sql`
      SELECT * FROM project WHERE id = ${finalProjectId}
    `);

    return NextResponse.json({
      ...result.rows[0],
      project: projectData.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error("Save business profile error:", error);
    return NextResponse.json(
      { 
        error: "Failed to save business profile",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let result;
    if (projectId) {
      result = await db.execute(sql`
        SELECT bp.*, p.name as project_name, p.slug as project_slug, p.status as project_status
        FROM business_profile bp
        JOIN project p ON p.id = bp.project_id
        WHERE bp.project_id = ${projectId}
      `);
    } else {
      result = await db.execute(sql`
        SELECT bp.*, p.name as project_name, p.slug as project_slug, p.status as project_status
        FROM business_profile bp
        JOIN project p ON p.id = bp.project_id
        ORDER BY bp.created_at DESC
      `);
    }

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Fetch business profiles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch business profiles" },
      { status: 500 }
    );
  }
}