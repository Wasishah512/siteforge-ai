import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/Emails/resetPassword";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { email, redirectTo } = await request.json();

    console.log("🔐 Forgot password request for:", email);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. User dhoondo
    const userResult = await pool.query(
      'SELECT id, email, name FROM "user" WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Security - don't reveal if user exists
      return NextResponse.json({ 
        success: true, 
        message: "If account exists, reset link sent" 
      });
    }

    const user = userResult.rows[0];
    console.log("✅ User found:", user.id);

    // 2. Reset token generate karo
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const identifier = `reset-password:${token}`;

    // 3. Purana token delete karo
    await pool.query(
      `DELETE FROM verification WHERE identifier LIKE 'reset-password:%' AND value = $1`,
      [user.id]
    );

    // 4. Naya token save karo
    await pool.query(
      `INSERT INTO verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
       VALUES (gen_random_uuid()::text, $1, $2, $3, NOW(), NOW())`,
      [identifier, user.id, expiresAt]
    );

    console.log("✅ Token saved:", token.substring(0, 20) + "...");

    // 5. Reset URL banao
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}${redirectTo || "/FrontEnd/reset-password"}?token=${token}`;

    console.log("🔗 Reset URL:", resetUrl);

    // 6. Email bhejo
    await sendResetPasswordEmail(
      user.email,
      user.name || "there",
      resetUrl,
    );

    console.log("✅ Reset email sent");

    return NextResponse.json({ 
      success: true, 
      message: "Reset link sent to your email" 
    });

  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}