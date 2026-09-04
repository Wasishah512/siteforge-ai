import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// Get sitemap for project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT * FROM ai_generation 
       WHERE project_id = $1 
       AND type = 'website_generation'
       ORDER BY created_at DESC 
       LIMIT 1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No content found" },
        { status: 404 }
      );
    }

    const row = result.rows[0];
    let output = row.output;

    if (typeof output === 'string') {
      try {
        output = JSON.parse(output);
      } catch {
        // Keep as is
      }
    }

    // Return sitemap data
    return NextResponse.json({
      success: true,
      sitemap: output.sitemap || [],
      pages: output.pages || [],
    });
  } catch (error) {
    console.error("Sitemap error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sitemap" },
      { status: 500 }
    );
  }
}

// Update sitemap (add/edit/delete pages)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, sitemap } = body;

    if (!projectId || !sitemap) {
      return NextResponse.json(
        { error: "Project ID and sitemap are required" },
        { status: 400 }
      );
    }

    // Get existing content
    const result = await query(
      `SELECT * FROM ai_generation 
       WHERE project_id = $1 
       AND type = 'website_generation'
       ORDER BY created_at DESC 
       LIMIT 1`,
      [projectId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No content found" },
        { status: 404 }
      );
    }

    let output = result.rows[0].output;
    if (typeof output === 'string') {
      output = JSON.parse(output);
    }

    // Update sitemap in output
    output.sitemap = sitemap;

    // Save updated output
    await query(
      `UPDATE ai_generation 
       SET output = $1, 
           status = 'in_progress',
           updated_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(output), result.rows[0].id]
    );

    return NextResponse.json({
      success: true,
      message: "Sitemap updated",
    });
  } catch (error) {
    console.error("Update sitemap error:", error);
    return NextResponse.json(
      { error: "Failed to update sitemap" },
      { status: 500 }
    );
  }
}