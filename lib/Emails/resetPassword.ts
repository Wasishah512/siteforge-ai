import { sendMail } from "./mail";

export async function sendResetPasswordEmail(
  email: string,
  name: string,
  resetUrl: string,
) {
  return await sendMail({
    to: email,
    subject: "Reset Your Password - SiteForge AI",
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
                
                <tr>
                  <td style="background:linear-gradient(135deg, #6366f1, #8b5cf6); padding:40px 30px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:700;">
                      🔐 Reset Your Password
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:40px 30px;">
                    <p style="margin:0 0 20px 0; font-size:18px; color:#333333; line-height:1.6;">
                      Hi <strong>${name}</strong>,
                    </p>
                    
                    <p style="margin:0 0 20px 0; font-size:16px; color:#555555; line-height:1.8;">
                      We received a request to reset your password. Click the button below to create a new password.
                    </p>

                    <p style="margin:0 0 30px 0; font-size:14px; color:#888888; line-height:1.6;">
                      ⏰ This link will expire in 1 hour.<br>
                      If you didn't request this, you can safely ignore this email.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="${resetUrl}"
                         style="display:inline-block; padding:16px 40px; background:linear-gradient(135deg, #6366f1, #8b5cf6); color:#ffffff; text-decoration:none; border-radius:8px; font-size:16px; font-weight:600; box-shadow:0 4px 15px rgba(99,102,241,0.4);">
                        Reset Password
                      </a>
                    </div>

                    <div style="border-top:1px solid #e5e7eb; margin:30px 0;"></div>

                    <p style="margin:0 0 10px 0; font-size:13px; color:#999999; text-align:center;">
                      If the button doesn't work, copy this link:
                    </p>
                    <p style="margin:0; font-size:12px; color:#6366f1; word-break:break-all; text-align:center;">
                      ${resetUrl}
                    </p>

                    <div style="margin-top:30px; padding:15px; background:#fef3c7; border-left:4px solid #f59e0b; border-radius:8px;">
                      <p style="margin:0; font-size:13px; color:#92400e;">
                        <strong>Security Tip:</strong> If you didn't request this reset, please ignore this email.
                      </p>
                    </div>
                  </td>
                </tr>

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