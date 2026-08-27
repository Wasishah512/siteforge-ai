import { NextResponse } from "next/server";
import { sendLoginEmail } from "@/lib/Emails/login"; // adjust path to match your project

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Login email API is working",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body || {};

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await sendLoginEmail(email, name || "there"); // fallback if name is missing

    return NextResponse.json({
      success: true,
      message: "Login email sent successfully",
      email,
    });
  } catch (error) {
    console.error("Login email error:", error);
    return NextResponse.json(
      { error: "Failed to send login email" },
      { status: 500 }
    );
  }
}