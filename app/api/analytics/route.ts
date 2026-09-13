import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    console.log("📊 Fetching analytics for workspace:", workspaceId);

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID required" },
        { status: 400 }
      );
    }

    // 1. Projects count
    const projectsResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM project WHERE workspace_id = ${workspaceId}
    `);
    const totalProjects = Number(projectsResult.rows[0]?.count || 0);

    console.log("✅ Projects:", totalProjects);

    // 2. Generation stats - SAFE
    let generationStats = {
      total_generations: 0,
      drafts: 0,
      in_progress: 0,
      completed: 0,
    };

    try {
      const genResult = await db.execute(sql`
        SELECT 
          COUNT(*) as total_generations,
          COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts,
          COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM ai_generation ag
        JOIN project p ON p.id = ag.project_id
        WHERE p.workspace_id = ${workspaceId}
      `);
      if (genResult.rows[0]) {
        generationStats = {
          total_generations: Number(genResult.rows[0].total_generations || 0),
          drafts: Number(genResult.rows[0].drafts || 0),
          in_progress: Number(genResult.rows[0].in_progress || 0),
          completed: Number(genResult.rows[0].completed || 0),
        };
      }
    } catch (e) {
      console.log("⚠️ Generation stats error:", e);
    }

    console.log("✅ Generations:", generationStats);

    // 3. Content stats - SAFE
    let totalPages = 0;
    let totalServices = 0;
    let totalFaqs = 0;

    try {
      const contentResult = await db.execute(sql`
        SELECT output
        FROM ai_generation ag
        JOIN project p ON p.id = ag.project_id
        WHERE p.workspace_id = ${workspaceId}
      `);

      contentResult.rows.forEach((row: any) => {
        let output = row.output;
        if (typeof output === 'string') {
          try { output = JSON.parse(output); } catch { output = {}; }
        }
        
        if (output?.pages && Array.isArray(output.pages)) {
          totalPages += output.pages.length;
        }
        if (output?.services && Array.isArray(output.services)) {
          totalServices += output.services.length;
        }
        if (output?.faqs && Array.isArray(output.faqs)) {
          totalFaqs += output.faqs.length;
        }
      });
    } catch (e) {
      console.log("⚠️ Content stats error:", e);
    }

    console.log("✅ Content:", { totalPages, totalServices, totalFaqs });

    // 4. Recent generations - SAFE
    let recentGenerations: any[] = [];
    try {
      const recentResult = await db.execute(sql`
        SELECT 
          ag.id,
          ag.type,
          ag.status,
          ag.created_at,
          p.name as project_name
        FROM ai_generation ag
        JOIN project p ON p.id = ag.project_id
        WHERE p.workspace_id = ${workspaceId}
        ORDER BY ag.created_at DESC
        LIMIT 10
      `);
      recentGenerations = recentResult.rows;
    } catch (e) {
      console.log("⚠️ Recent error:", e);
    }

    // 5. Project stats - SAFE
    let projectStats: any[] = [];
    try {
      const projectStatsResult = await db.execute(sql`
        SELECT 
          p.id,
          p.name,
          p.status,
          p.progress,
          p.current_step,
          p.updated_at,
          COUNT(ag.id) as generation_count
        FROM project p
        LEFT JOIN ai_generation ag ON ag.project_id = p.id
        WHERE p.workspace_id = ${workspaceId}
        GROUP BY p.id, p.name, p.status, p.progress, p.current_step, p.updated_at
        ORDER BY p.updated_at DESC
      `);
      projectStats = projectStatsResult.rows;
    } catch (e) {
      console.log("⚠️ Project stats error:", e);
    }

    // 6. Weekly activity - SAFE
    let weeklyData: any[] = [];
    try {
      const weeklyResult = await db.execute(sql`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count
        FROM ai_generation ag
        JOIN project p ON p.id = ag.project_id
        WHERE p.workspace_id = ${workspaceId}
        AND created_at >= NOW() - INTERVAL '7 days'
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `);

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const found = weeklyResult.rows.find((r: any) => {
          try {
            return new Date(r.date).toISOString().split('T')[0] === dateStr;
          } catch {
            return false;
          }
        });
        
        weeklyData.push({
          date: dateStr,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          count: found ? Number(found.count) : 0,
        });
      }
    } catch (e) {
      console.log("⚠️ Weekly error:", e);
      // Fallback empty data
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        weeklyData.push({
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          count: 0,
        });
      }
    }

    console.log("✅ Weekly data ready");

    return NextResponse.json({
      success: true,
      overview: {
        totalProjects,
        totalPages,
        totalServices,
        totalFaqs,
        totalGenerations: generationStats.total_generations,
        drafts: generationStats.drafts,
        inProgress: generationStats.in_progress,
        completed: generationStats.completed,
      },
      weeklyActivity: weeklyData,
      recentGenerations: recentGenerations,
      projectStats: projectStats,
    });

  } catch (error) {
    console.error("❌ Analytics error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch analytics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}