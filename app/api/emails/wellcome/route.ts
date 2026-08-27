import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/Emails/welcome"; // adjust path to match your project

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Welcome API is working",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body || {};

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    await sendWelcomeEmail(email, name); // <-- this was missing

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully",
      email,
      name,
    });
  } catch (error) {
    console.error("Welcome email error:", error); // log the real error too
    return NextResponse.json(
      { error: "Failed to send welcome email" },
      { status: 500 }
    );
  }
}