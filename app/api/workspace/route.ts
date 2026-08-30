import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { auth } from "@/lib/auth"; // Server-side auth import

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const result = await query(
      "SELECT * FROM workspace WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );

    let workspaces = result.rows;

    if (workspaces.length === 0) {
      const insertResult = await query(
        "INSERT INTO workspace (user_id, name, slug) VALUES ($1, $2, $3) RETURNING *",
        [userId, "My Workspace", "my-workspace"],
      );
      workspaces = insertResult.rows;
    }

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch workspace",
        details: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const name = (body?.name || "My Workspace").trim();

    const baseSlug = (name || "my-workspace")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || "my-workspace";

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await query(
        "SELECT id FROM workspace WHERE user_id = $1 AND slug = $2",
        [userId, slug],
      );

      if (existing.rows.length === 0) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const result = await query(
      "INSERT INTO workspace (user_id, name, slug) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, slug],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Create workspace error:", error);
    return NextResponse.json(
      {
        error: "Failed to create workspace",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}