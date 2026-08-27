import { sendMail } from "./mail";

export async function sendLoginEmail(
  email: string,
  name: string
) {
  const loginTime = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return await sendMail({
    to: email,
    subject: "New login to your Siteforge AI account",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Login Detected</title>
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

                <!-- Icon / Alert badge -->
                <tr>
                  <td style="padding:32px 40px 0; text-align:center;">
                    <div style="display:inline-block; width:56px; height:56px; line-height:56px; border-radius:50%; background-color:#fef3c7; font-size:26px;">
                      🔐
                    </div>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:20px 40px 40px; text-align:center;">
                    <h1 style="margin:0 0 12px; font-size:20px; color:#111827; font-weight:700;">
                      New login detected
                    </h1>
                    <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#4b5563;">
                      Hi ${name}, we noticed a new sign-in to your Siteforge AI account.
                    </p>

                    <!-- Details box -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb; border-radius:8px; margin-bottom:24px;">
                      <tr>
                        <td style="padding:16px 20px; text-align:left;">
                          <p style="margin:0 0 6px; font-size:13px; color:#6b7280;">
                            <strong style="color:#374151;">Account:</strong> ${email}
                          </p>
                          <p style="margin:0; font-size:13px; color:#6b7280;">
                            <strong style="color:#374151;">Time:</strong> ${loginTime}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 24px; font-size:14px; line-height:1.6; color:#4b5563;">
                      If this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.
                    </p>

                    <!-- CTA Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td style="border-radius:8px; background-color:#dc2626;">
                          <a href="https://your-siteforge-domain.com/account/security" 
                             style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;">
                            Secure My Account →
                          </a>
                        </td>
                      </tr>
                    </table>
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
                    <p style="margin:0; font-size:13px; color:#9ca3af; line-height:1.5; text-align:center;">
                      This is an automated security notification from Siteforge AI.
                    </p>
                    <p style="margin:8px 0 0; font-size:13px; color:#9ca3af; text-align:center;">
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