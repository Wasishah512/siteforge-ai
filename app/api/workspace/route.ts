import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth";

// ============ GET - Fetch workspaces ============
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    console.log("📊 Fetching workspaces for user:", userId);

    let result = await query(
      "SELECT * FROM workspace WHERE user_id = $1 ORDER BY created_at ASC",
      [userId]
    );

    let workspaces = result.rows;

    if (workspaces.length === 0) {
      const slug = `workspace-${userId.slice(0, 8)}-${Date.now()}`;
      const insertResult = await query(
        `INSERT INTO workspace (user_id, name, slug) 
         VALUES ($1, $2, $3) RETURNING *`,
        [userId, "My Workspace", slug]
      );
      workspaces = insertResult.rows;
    }

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("❌ GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 500 }
    );
  }
}

// ============ POST - Create workspace ============
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;
    const userId = session.user.id;

    if (!name) {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let slug = `${baseSlug}-${userId.slice(0, 8)}`;
    let counter = 1;

    while (true) {
      const check = await query("SELECT id FROM workspace WHERE slug = $1", [
        slug,
      ]);
      if (check.rows.length === 0) break;
      slug = `${baseSlug}-${userId.slice(0, 8)}-${counter}`;
      counter++;
    }

    const result = await query(
      `INSERT INTO workspace (user_id, name, slug) 
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, name.trim(), slug]
    );

    console.log("✅ Workspace created:", result.rows[0]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("❌ POST error:", error);
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  }
}

// ============ PATCH - Update workspace name ============
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId, name } = body;
    const userId = session.user.id;

    console.log("🔍 PATCH received:", { workspaceId, name, userId });

    if (!workspaceId || !name) {
      return NextResponse.json(
        { error: "Workspace ID and name required" },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const checkResult = await query(
      "SELECT id FROM workspace WHERE id = $1 AND user_id = $2",
      [workspaceId, userId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let slug = `${baseSlug}-${userId.slice(0, 8)}`;
    let counter = 1;

    while (true) {
      const slugCheck = await query(
        "SELECT id FROM workspace WHERE slug = $1 AND id != $2",
        [slug, workspaceId]
      );
      if (slugCheck.rows.length === 0) break;
      slug = `${baseSlug}-${userId.slice(0, 8)}-${counter}`;
      counter++;
    }

    const result = await query(
      `UPDATE workspace 
       SET name = $1, slug = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [name.trim(), slug, workspaceId, userId]
    );

    console.log("✅ Workspace updated:", result.rows[0]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("❌ PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update workspace" },
      { status: 500 }
    );
  }
}