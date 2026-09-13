import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sendResetPasswordEmail } from "./Emails/resetPassword";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    // ✅ Reset Password Email
    sendResetPassword: async ({ user, url, token }) => {
      console.log("📧 Sending password reset email to:", user.email);
      console.log("🔗 Reset URL:", url);

      await sendResetPasswordEmail(
        user.email,
        user.name || "there",
        url,
      );

      console.log("✅ Password reset email sent");
    },

    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
    minPasswordLength: 8,
  },

  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL || "",
  ].filter(Boolean),
});