import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const result = await query(
      `SELECT 
        bp.*,
        p.name as project_name,
        p.slug as project_slug,
        p.type as project_type,
        p.status as project_status,
        p.progress as project_progress
      FROM business_profile bp
      LEFT JOIN project p ON p.id = bp.project_id
      WHERE bp.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Business profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching business profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch business profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await query('DELETE FROM business_profile WHERE id = $1', [id]);

    return NextResponse.json({ message: "Business profile deleted" });
  } catch (error) {
    console.error("Error deleting business profile:", error);
    return NextResponse.json(
      { error: "Failed to delete business profile" },
      { status: 500 }
    );
  }
}