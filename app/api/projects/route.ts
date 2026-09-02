import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "project";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "workspaceId is required" },
        { status: 400 }
      );
    }

    const result = await db.execute(sql`
      SELECT * FROM project 
      WHERE workspace_id = ${workspaceId} 
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const workspaceId = body?.workspaceId || body?.workspace_id;
    const projectName = (body?.name || "New Project").trim();
    const projectType = body?.type || "client_website";

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    // Validate project type
    const validTypes = [
      "client_website",
      "product_website",
      "landing_page",
      "campaign_website",
      "industry_website"
    ];
    
    if (!validTypes.includes(projectType)) {
      return NextResponse.json(
        { error: `Invalid project type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const baseSlug = generateSlug(projectName);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await db.execute(sql`
        SELECT id FROM project 
        WHERE workspace_id = ${workspaceId} AND slug = ${slug}
      `);

      if (existing.rows.length === 0) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const result = await db.execute(sql`
      INSERT INTO project (workspace_id, name, slug, type, status, progress, current_step)
      VALUES (
        ${workspaceId}, 
        ${projectName}, 
        ${slug}, 
        ${projectType}, 
        'draft', 
        0, 
        'business_profile'
      )
      RETURNING *
    `);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      {
        error: "Failed to create project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}