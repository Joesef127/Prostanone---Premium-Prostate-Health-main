import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) return null;

  return { resend: new Resend(apiKey), hostEmail: fromEmail };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function sendVerificationEmail(
  email: string,
  verificationCode: string,
  expiresAt: Date,
  deviceInfo?: string,
): Promise<boolean> {
  const client = getResendClient();
  if (!client) {
    console.error(
      "Email service not configured: missing RESEND_API_KEY or RESEND_FROM_EMAIL",
    );
    return false;
  }

  const expiryMinutes = Math.max(
    1,
    Math.ceil((expiresAt.getTime() - Date.now()) / 60000),
  );
  const safeDeviceInfo = deviceInfo ? escapeHtml(deviceInfo) : null;

  try {
    const result = await client.resend.emails.send({
      from: client.hostEmail,
      to: email,
      subject: "Your Holis Botanicals Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 500px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .code-box { 
                background: #f5f5f5; 
                border: 2px solid #00a86b; 
                border-radius: 8px; 
                padding: 20px; 
                text-align: center; 
                margin: 30px 0;
              }
              .code { 
                font-size: 36px; 
                letter-spacing: 5px; 
                font-weight: bold; 
                color: #00a86b;
                font-family: monospace;
              }
              .footer { 
                color: #666; 
                font-size: 12px; 
                margin-top: 20px; 
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Holis Botanicals Admin Portal</h2>
                <p>Login Verification Required</p>
              </div>

              <p>Someone is trying to log in to your Holis Botanicals admin account.</p>

              <div class="code-box">
                <p style="margin: 0; color: #666;">Your verification code is:</p>
                <div class="code">${verificationCode}</div>
              </div>

              <p><strong>⏱️ This code expires in ${expiryMinutes} minute${expiryMinutes !== 1 ? "s" : ""}</strong></p>

              ${safeDeviceInfo ? `<p style="color: #999; font-size: 12px;">Device: ${safeDeviceInfo}</p>` : ""}

              <p style="margin-top: 30px; color: #999; font-size: 12px;">
                If you didn't attempt to log in, please ignore this email and ensure your password is secure.
              </p>

              <div class="footer">
                <p>&copy; 2026 Holis Botanicals. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (!result?.data?.id) {
      console.error(
        "Failed to send verification email:",
        JSON.stringify(result?.error),
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}
