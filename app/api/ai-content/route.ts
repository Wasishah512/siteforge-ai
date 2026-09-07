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

    console.log("🔍 Fetching content for project:", projectId);

    // Sab content fetch karo - bina type filter ke
    const result = await db.execute(sql`
      SELECT * FROM ai_generation 
      WHERE project_id = ${projectId}
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    console.log("📊 Result rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("❌ No content found in database");
      return NextResponse.json(
        { error: "No content found" },
        { status: 404 }
      );
    }

    const row = result.rows[0] as any;
    console.log("📄 Row type:", row.type);
    console.log("📄 Row status:", row.status);

    let output = row.output;

    // Output parse karo
    if (typeof output === 'string') {
      try {
        output = JSON.parse(output);
      } catch (parseError) {
        console.error("❌ Parse error:", parseError);
        output = {};
      }
    }

    // Null/undefined check
    if (!output || typeof output !== 'object' || Array.isArray(output)) {
      console.log("⚠️ Output is empty or invalid");
      output = {};
    }

    console.log("✅ Content found");
    console.log("📄 Pages:", output.pages?.length || 0);
    console.log("📄 Services:", output.services?.length || 0);
    console.log("📄 FAQs:", output.faqs?.length || 0);
    console.log("📄 Has preview_html:", !!output.preview_html);
    console.log("📄 Has color_scheme:", !!output.color_scheme);

    return NextResponse.json([{
      id: row.id,
      project_id: row.project_id,
      type: row.type,
      status: row.status,
      created_at: row.created_at,
      completed_at: row.completed_at,
      output: output,
    }]);
  } catch (error) {
    console.error("❌ Fetch content error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch content",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}