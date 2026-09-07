import { sendMail } from "./mail";

export async function sendGenerationReadyEmail(
  email: string,
  name: string,
  pagesCount?: number,
  servicesCount?: number,
  faqsCount?: number,
) {
  return await sendMail({
    to: email,
    subject: "Your Website is Ready! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background:#f5f5f5; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg, #6366f1, #8b5cf6); padding:40px 30px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:700;">
                      ✨ Your Website is Ready!
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:40px 30px;">
                    <p style="margin:0 0 20px 0; font-size:18px; color:#333333; line-height:1.6;">
                      Hi <strong>${name}</strong>,
                    </p>
                    
                    <p style="margin:0 0 20px 0; font-size:16px; color:#555555; line-height:1.8;">
                      Great news! We've finished generating the complete website content for your business. Your website draft includes:
                    </p>

                    ${pagesCount || servicesCount || faqsCount ? `
                    <!-- Stats -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0; background:#f9fafb; border-radius:12px;">
                      <tr>
                        <td align="center" style="padding:15px; width:33%;">
                          <div style="font-size:24px; font-weight:700; color:#6366f1;">${pagesCount || 0}</div>
                          <div style="font-size:12px; color:#666;">Pages</div>
                        </td>
                        <td align="center" style="padding:15px; width:33%; border-left:1px solid #e5e7eb;">
                          <div style="font-size:24px; font-weight:700; color:#8b5cf6;">${servicesCount || 0}</div>
                          <div style="font-size:12px; color:#666;">Services</div>
                        </td>
                        <td align="center" style="padding:15px; width:33%; border-left:1px solid #e5e7eb;">
                          <div style="font-size:24px; font-weight:700; color:#ec4899;">${faqsCount || 0}</div>
                          <div style="font-size:12px; color:#666;">FAQs</div>
                        </td>
                      </tr>
                    </table>
                    ` : ""}

                    <!-- Features List -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="display:inline-block; width:24px; height:24px; background:#6366f1; border-radius:50%; color:#fff; text-align:center; line-height:24px; font-size:12px;">✓</span>
                          <span style="font-size:15px; color:#555555; margin-left:10px;">Complete sitemap structure</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="display:inline-block; width:24px; height:24px; background:#6366f1; border-radius:50%; color:#fff; text-align:center; line-height:24px; font-size:12px;">✓</span>
                          <span style="font-size:15px; color:#555555; margin-left:10px;">All pages with engaging content</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="display:inline-block; width:24px; height:24px; background:#6366f1; border-radius:50%; color:#fff; text-align:center; line-height:24px; font-size:12px;">✓</span>
                          <span style="font-size:15px; color:#555555; margin-left:10px;">Professional color scheme</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="display:inline-block; width:24px; height:24px; background:#6366f1; border-radius:50%; color:#fff; text-align:center; line-height:24px; font-size:12px;">✓</span>
                          <span style="font-size:15px; color:#555555; margin-left:10px;">SEO optimized metadata</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="display:inline-block; width:24px; height:24px; background:#6366f1; border-radius:50%; color:#fff; text-align:center; line-height:24px; font-size:12px;">✓</span>
                          <span style="font-size:15px; color:#555555; margin-left:10px;">Live preview ready</span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:20px 0 30px 0; font-size:15px; color:#777777; line-height:1.6;">
                      Review your generated content, make any edits with our AI assistant, and preview your website before publishing.
                    </p>

                    <!-- CTA Button -->
                    <div style="text-align:center; margin:30px 0;">
                      <a href="${process.env.NEXT_PUBLIC_APP_URL}/FrontEnd/Dashboard/content"
                         style="display:inline-block; padding:16px 40px; background:linear-gradient(135deg, #6366f1, #8b5cf6); color:#ffffff; text-decoration:none; border-radius:8px; font-size:16px; font-weight:600; box-shadow:0 4px 15px rgba(99,102,241,0.4);">
                        Review Your Website
                      </a>
                    </div>

                    <!-- Divider -->
                    <div style="border-top:1px solid #e5e7eb; margin:30px 0;"></div>

                    <p style="margin:0; font-size:14px; color:#999999; text-align:center;">
                      Need help? Contact our support team anytime.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb; padding:20px 30px; text-align:center;">
                    <p style="margin:0; font-size:12px; color:#999999;">
                      © 2026 SiteForge AI. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}