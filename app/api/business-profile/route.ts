import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

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
        const existing = await query(
          'SELECT id FROM project WHERE workspace_id = $1 AND slug = $2',
          [workspaceId, slug]
        );
        if (existing.rows.length === 0) break;
        slug = `${generateSlug(profileData.businessName)}-${counter}`;
        counter++;
      }

      // Create project
      const projectResult = await query(
        `INSERT INTO project (workspace_id, name, slug, type, status, progress, current_step) 
         VALUES ($1, $2, $3, 'client_website', 'in_progress', 25, 'site_structure') 
         RETURNING *`,
        [workspaceId, profileData.businessName, slug]
      );

      finalProjectId = projectResult.rows[0].id;
    }

    // Check if business profile exists
    const existing = await query(
      'SELECT id FROM business_profile WHERE project_id = $1',
      [finalProjectId]
    );

    let result;

    if (existing.rows.length > 0) {
      // Update existing profile
      result = await query(
        `UPDATE business_profile SET 
          business_name = $1,
          business_description = $2,
          industry = $3,
          location = $4,
          service_area = $5,
          target_customers = $6,
          products_services = $7::jsonb,
          main_goals = $8,
          brand_voice = $9,
          preferred_language = $10,
          primary_ctas = $11::jsonb,
          competitor_references = $12::jsonb,
          social_links = $13::jsonb,
          contact_information = $14::jsonb,
          existing_brand_colors = $15::jsonb,
          image_preferences = $16,
          required_pages = $17::jsonb,
          restricted_claims = $18,
          updated_at = NOW()
        WHERE project_id = $19
        RETURNING *`,
        [
          profileData.businessName,
          profileData.businessDescription,
          profileData.industry || null,
          profileData.location || null,
          profileData.serviceArea || null,
          profileData.targetCustomers || null,
          JSON.stringify(profileData.productsServices || []),
          profileData.mainGoals || null,
          profileData.brandVoice || "Professional",
          profileData.preferredLanguage || "English",
          JSON.stringify(profileData.primaryCTAs || []),
          JSON.stringify(profileData.competitorReferences || []),
          JSON.stringify(profileData.socialLinks || {}),
          JSON.stringify(profileData.contactInformation || {}),
          JSON.stringify(profileData.existingBrandColors || []),
          profileData.imagePreferences || null,
          JSON.stringify(profileData.requiredPages || []),
          profileData.restrictedClaims || null,
          finalProjectId
        ]
      );
    } else {
      // Create new profile
      result = await query(
        `INSERT INTO business_profile (
          project_id, business_name, business_description, industry, location,
          service_area, target_customers, products_services, main_goals, brand_voice,
          preferred_language, primary_ctas, competitor_references, social_links,
          contact_information, existing_brand_colors, image_preferences, required_pages,
          restricted_claims
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11, $12::jsonb,
          $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb, $17, $18::jsonb, $19
        )
        RETURNING *`,
        [
          finalProjectId,
          profileData.businessName,
          profileData.businessDescription,
          profileData.industry || null,
          profileData.location || null,
          profileData.serviceArea || null,
          profileData.targetCustomers || null,
          JSON.stringify(profileData.productsServices || []),
          profileData.mainGoals || null,
          profileData.brandVoice || "Professional",
          profileData.preferredLanguage || "English",
          JSON.stringify(profileData.primaryCTAs || []),
          JSON.stringify(profileData.competitorReferences || []),
          JSON.stringify(profileData.socialLinks || {}),
          JSON.stringify(profileData.contactInformation || {}),
          JSON.stringify(profileData.existingBrandColors || []),
          profileData.imagePreferences || null,
          JSON.stringify(profileData.requiredPages || []),
          profileData.restrictedClaims || null
        ]
      );
    }

    // Update project progress
    await query(
      `UPDATE project SET 
        progress = 25, 
        current_step = 'site_structure',
        status = 'in_progress',
        updated_at = NOW()
      WHERE id = $1`,
      [finalProjectId]
    );

    // Get updated project
    const projectData = await query(
      'SELECT * FROM project WHERE id = $1',
      [finalProjectId]
    );

    return NextResponse.json({
      ...result.rows[0],
      project: projectData.rows[0]
    }, { status: 201 });
  } catch (error) {
    console.error("Save business profile error:", error);
    return NextResponse.json(
      { error: "Failed to save business profile" },
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
      result = await query(
        `SELECT bp.*, p.name as project_name, p.slug as project_slug, p.status as project_status
         FROM business_profile bp
         JOIN project p ON p.id = bp.project_id
         WHERE bp.project_id = $1`,
        [projectId]
      );
    } else {
      result = await query(
        `SELECT bp.*, p.name as project_name, p.slug as project_slug, p.status as project_status
         FROM business_profile bp
         JOIN project p ON p.id = bp.project_id
         ORDER BY bp.created_at DESC`
      );
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