import { NextRequest, NextResponse } from "next/server";
import { sendGenerationReadyEmail } from "../../../../lib/Emails/generationReady";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, pagesCount, servicesCount, faqsCount } = body;

    console.log("📧 Sending generation ready email...");
    console.log("To:", email);
    console.log("Name:", name);

    // Validate
    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: "Email and name are required" },
        { status: 400 }
      );
    }

    // Email send karo
    await sendGenerationReadyEmail(
      email,
      name,
      pagesCount || 0,
      servicesCount || 0,
      faqsCount || 0,
    );

    console.log("✅ Email sent successfully to:", email);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (error) {
    console.error("❌ Email sending error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}