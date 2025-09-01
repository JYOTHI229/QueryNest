// sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, token) => {
  try {
    const clientUrl = process.env.CLIENT_URL;

    // SPA route for reset password
    const resetUrl = `${clientUrl.replace(/\/$/, "")}/reset-password/${token}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #1a73e8;">QueryNest Password Reset</h2>
        <p>You requested a password reset for your QueryNest account.</p>
        <p>Click the button below to reset your password. The link is valid for 1 hour.</p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 10px 20px; margin: 10px 0;
                  background-color: #1a73e8; color: white; text-decoration: none;
                  border-radius: 5px;">
          Reset Password
        </a>
        <p style="margin-top: 10px;">After resetting your password, return to the login page to access your account.</p>
        <hr />
        <p style="font-size: 0.9em; color: #777;">— QueryNest Team</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"QueryNest" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error("Email could not be sent");
  }
};
