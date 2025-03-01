"use server";

import { Resend } from "resend";

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(data: EmailPayload) {
  const { to, subject, html } = data;

  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `African Real Estate <noreply@african-realestate.com>`,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Failed to send email:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return emailData;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
