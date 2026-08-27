import { sendMail } from "./mail";

export async function sendGenerationReadyEmail(
  email: string,
  name: string
) {
  return await sendMail({
    to: email,
    subject: "Your Siteforge AI data is ready",
    html: `
      <div>
        <h1>Your data is ready, ${name}!</h1>
        <p>
          We've finished generating the content for your business.
        </p>
        <p>Your generated data is now ready to review.</p>

        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#000;
            color:#fff;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Go to Dashboard
        </a>
      </div>
    `,
  });
}