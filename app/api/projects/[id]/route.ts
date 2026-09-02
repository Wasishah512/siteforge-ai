import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log("🔄 Updating project:", id, body);

    // Simple update - sirf jo fields aaye unhe update karo
    const result = await db.execute(sql`
      UPDATE project 
      SET 
        progress = ${body.progress ?? 0},
        current_step = ${body.current_step ?? body.currentStep ?? 'business_profile'},
        status = ${body.status ?? 'draft'},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    console.log("✅ Project updated:", result.rows[0]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ Update project error:", error);
    return NextResponse.json(
      { 
        error: "Failed to update project",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}