import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { renderToBuffer } from "@react-pdf/renderer";
import { SiteForgePDF } from "@/lib/export/pdf-document";
import React from "react";

// ⚠️ @react-pdf/renderer Edge pe kaam nahi karta
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") ?? "json").toLowerCase();

    console.log(`📦 Export request for project ${id} → type=${type}`);

    // ---------- 1. Project fetch ----------
    const projectResult = await db.execute(sql`
      SELECT * FROM project WHERE id = ${id} LIMIT 1
    `);

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const project = projectResult.rows[0] as any;

    // ---------- 2. AI generation content fetch ----------
    // Latest completed generation nikaalo
    const aiResult = await db.execute(sql`
      SELECT * FROM ai_generation 
      WHERE project_id = ${id} 
      ORDER BY created_at DESC 
      LIMIT 1
    `);

    if (aiResult.rows.length === 0) {
      return NextResponse.json(
        { error: "No AI content generated yet for this project" },
        { status: 404 }
      );
    }

    const generation = aiResult.rows[0] as any;
    const content = generation.output ?? {};

    console.log("✅ Content loaded from ai_generation.output");

    // ---------- 3. Assemble export payload ----------
    const exportData = {
      faqs: content.faqs ?? [],
      pages: content.pages ?? [],
      sitemap: content.sitemap ?? [],
      metadata: content.metadata ?? {
        site_title: project.name ?? "",
        site_description: "",
        keywords: [],
      },
      services: content.services ?? [],
      color_scheme: content.color_scheme ?? {},
      preview_html: content.preview_html ?? {},
    };

    const slug = project.slug ?? project.name ?? id;
    const timestamp = Date.now();

    // ==================== JSON ====================
    if (type === "json") {
      const jsonString = JSON.stringify(exportData, null, 2);
      const filename = `siteforge-${slug}-${timestamp}.json`;

      console.log("✅ JSON export ready:", filename);

      return new NextResponse(jsonString, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    // ==================== PDF ====================
    if (type === "pdf") {
      console.log("📄 Rendering PDF...");

      const pdfBuffer = await renderToBuffer(
        React.createElement(SiteForgePDF, { data: exportData }) as any
      );

      const filename = `siteforge-${slug}-${timestamp}.pdf`;

      

      console.log("✅ PDF ready:", filename);

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json(
      { error: `Unsupported type: ${type}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}