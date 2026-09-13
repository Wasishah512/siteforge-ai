import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { hashPassword } from "better-auth/crypto";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    console.log("🔐 Reset password request");

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // 1. Token verify karo
    const verificationResult = await pool.query(
      `SELECT * FROM verification 
       WHERE identifier = $1 AND "expiresAt" > NOW()`,
      [`reset-password:${token}`]
    );

    if (verificationResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    const userId = verificationResult.rows[0].value;
    console.log("✅ Token verified for user:", userId);

    // ✅ 2. Better Auth ka hashPassword use karo
    const hashedPassword = await hashPassword(newPassword);
    console.log("✅ Password hashed with Better Auth");

    // 3. Password update karo
    const updateResult = await pool.query(
      `UPDATE account 
       SET password = $1, "updatedAt" = NOW()
       WHERE "userId" = $2 AND "providerId" = 'credential'`,
      [hashedPassword, userId]
    );

    console.log("✅ Password updated, rows:", updateResult.rowCount);

    // 4. Token delete karo
    await pool.query(
      `DELETE FROM verification WHERE identifier = $1`,
      [`reset-password:${token}`]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successfully" 
    });

  } catch (error) {
    console.error("❌ Reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}