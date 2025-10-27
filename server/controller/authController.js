import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { user } from "../model/user.js"; // ✅ use the correct model path

dotenv.config(); // ✅ make sure env variables load

// 🔹 Setup mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔹 Forgot Password (Send reset email)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const usr = await user.findOne({ email });
    if (!usr)
      return res.json({
        message: "If this email exists, a reset link has been sent.",
      });

    // ✅ FIX: use usr._id and make sure JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env file!");
      return res.status(500).json({ message: "Server config error" });
    }

    // Create reset token (valid for 15 minutes)
    const token = jwt.sign({ id: usr._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}" 
           style="background:#2563eb;color:white;padding:10px 14px;
                  border-radius:6px;text-decoration:none;">Reset Password</a>
        <p style="margin-top:10px;">This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      message: "If this email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error sending reset link" });
  }
};

// 🔹 Reset Password (Verify token and update password)
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password)
      return res.status(400).json({ message: "Password is required" });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usr = await user.findById(decoded.id);
    if (!usr)
      return res.status(400).json({ message: "User not found" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    usr.password = hashedPassword;
    await usr.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    console.error("Reset password error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link expired." });
    }
    res.status(500).json({ message: "Invalid or expired token" });
  }
};
