import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

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

    console.log("🔍 Fetching preview for project:", projectId);

    const result = await db.execute(sql`
      SELECT output, status, completed_at, created_at
      FROM ai_generation 
      WHERE project_id = ${projectId}
      AND type = 'website_generation'
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "No content found" },
        { status: 404 }
      );
    }

    const row = result.rows[0] as any; // ✅ any use karo
    
    let output: any = row.output; // ✅ any type

    // Agar output string hai to parse karo
    if (typeof output === 'string') {
      try {
        output = JSON.parse(output);
      } catch {
        output = {};
      }
    }

    // Agar output null ya undefined hai to empty object
    if (!output) {
      output = {};
    }

    const previewHtml = output.preview_html || {};
    const colorScheme = output.color_scheme || {};
    const pages = output.pages || [];
    const metadata = output.metadata || {};

    console.log("✅ Preview pages:", Object.keys(previewHtml));

    return NextResponse.json({
      success: true,
      previewHtml: previewHtml,
      colorScheme: colorScheme,
      pages: pages,
      metadata: metadata,
      status: row.status || "draft",
      updatedAt: row.completed_at || row.created_at || null,
    });
  } catch (error) {
    console.error("Preview API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch preview",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}