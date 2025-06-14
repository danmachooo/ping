import nodemailer from "nodemailer";
import { config } from "../config";
import { SendMagicLinkEmailOptions } from "./interfaces/email-service.interface";

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendMagicLinkEmail = async ({
  to,
  magicLink,
}: SendMagicLinkEmailOptions): Promise<void> => {
  if (!config.email.user || !config.email.pass) {
    console.error("Email credentials not configured. Skipping email send.");
    return;
  }

  const mailOptions = {
    from: config.email.from,
    to: to,
    subject: "Login to Ping",
    html: `
      <p>Hello,</p>
      <p>Click the link below to log in to your account:</p>
      <p><a href="${magicLink}">Login to Your Account</a></p>
      <p>This link is valid for ${config.magicLinkExpiresInMinutes} minutes and can only be used once.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Thanks,</p>
      <p>Your App Team</p>
    `,
    text: `Hello,\n\nClick the link below to log in to your account:\n\n${magicLink}\n\nThis link is valid for ${config.magicLinkExpiresInMinutes} minutes and can only be used once.\n\nIf you did not request this, please ignore this email.\n\nThanks,\nYour App Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Magic link email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending magic link email to ${to}:`, error);
    throw new Error("Failed to send magic link email.");
  }
};
