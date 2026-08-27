import { sendMail } from "./mail";

export async function sendWelcomeEmail(
  email: string,
  name: string
) {
  return await sendMail({
    to: email,
    subject: "Welcome to Siteforge AI 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Siteforge AI</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#111827; padding:32px 40px; text-align:center;">
                    <span style="color:#ffffff; font-size:22px; font-weight:700; letter-spacing:0.5px;">Siteforge AI</span>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h1 style="margin:0 0 16px; font-size:22px; color:#111827; font-weight:700;">
                      Welcome aboard, ${name}! 👋
                    </h1>
                    <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#4b5563;">
                      Your account has been created successfully. We're really excited to have you on Siteforge AI — let's start building something great.
                    </p>
                    <p style="margin:0 0 32px; font-size:15px; line-height:1.6; color:#4b5563;">
                      You can jump straight into your dashboard and start creating your first AI-powered website in minutes.
                    </p>

    
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <hr style="border:none; border-top:1px solid #e5e7eb; margin:0;" />
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 40px 32px;">
                    <p style="margin:0; font-size:13px; color:#9ca3af; line-height:1.5;">
                      If you didn't create this account, you can safely ignore this email.
                    </p>
                    <p style="margin:8px 0 0; font-size:13px; color:#9ca3af;">
                      © ${new Date().getFullYear()} Siteforge AI. All rights reserved.
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