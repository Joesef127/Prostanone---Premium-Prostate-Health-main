import twilio from "twilio";

const E164_RE = /^\+[1-9]\d{7,14}$/;

let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (twilioClient) return twilioClient;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error(
      "TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are required for SMS functionality",
    );
  }

  twilioClient = twilio(accountSid, authToken);
  return twilioClient;
}

export async function sendVerificationSMS(
  phoneNumber: string,
  verificationCode: string,
  expiresAt: Date,
): Promise<boolean> {
  if (!E164_RE.test(phoneNumber)) {
    console.error("Invalid phone number format — must be E.164 (e.g. +2348012345678)");
    return false;
  }

  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!fromNumber) {
    throw new Error("TWILIO_FROM_NUMBER is required to send SMS");
  }

  const expiryMinutes = Math.round((expiresAt.getTime() - Date.now()) / 60000);

  try {
    const client = getTwilioClient();
    const message = await client.messages.create({
      body: `Your Holis Botanicals verification code is: ${verificationCode}. Valid for ${expiryMinutes} minute${expiryMinutes !== 1 ? "s" : ""}. Do not share this code.`,
      from: fromNumber,
      to: phoneNumber,
    });

    console.log("SMS sent:", message.sid);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}