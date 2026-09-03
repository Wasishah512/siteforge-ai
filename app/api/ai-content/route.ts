import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

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
       AND status = 'draft'
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
    
    // Output ko properly parse karo
    let output = row.output;
    
    // Agar output string hai to parse karo
    if (typeof output === 'string') {
      try {
        output = JSON.parse(output);
      } catch {
        // Agar parse nahi ho raha to as is return karo
        console.log("Output is not valid JSON, returning as is");
      }
    }

    return NextResponse.json([{
      ...row,
      output: output // Parsed output
    }]);
  } catch (error) {
    console.error("Fetch content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}