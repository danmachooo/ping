import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "fallback_jwt_secret_change_me", // IMPORTANT: Use a strong secret in production
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: process.env.EMAIL_SECURE === "true", // Use 'true' for SSL/TLS (port 465), 'false' for STARTTLS (port 587)
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || "no-reply@your-app.com",
  },
  magicLinkExpiresInMinutes: 15, // How long a magic link is valid
  jwtExpiresInHours: "1h", // How long the JWT token issued after magic link login is valid
};

// Basic validation (add more robust validation in a real app)
if (!config.jwtSecret || config.jwtSecret === "fallback_jwt_secret_change_me") {
  console.warn(
    "WARNING: JWT_SECRET is not set or is using the default. Please set a strong secret in your .env file!"
  );
}
if (!config.email.user || !config.email.pass) {
  console.warn(
    "WARNING: Email credentials (EMAIL_USER, EMAIL_PASS) are not fully configured. Email sending might fail."
  );
}
