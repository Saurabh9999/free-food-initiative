// routes/authRoutes.js
import express from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { User } from "../model/user.js";

// const router = express.Router();

// 🟢 Step 1: Send reset email

 export const forgotPassword =  async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save hashed token + expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Create reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email
     const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
     port: 465,
     secure: true,
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    },
    });

    const mailOptions = {
      from: `"Free Food Initiative" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      html: `
        <p>You requested a password reset.</p>
        <p>Click here to reset: <a href="${resetURL}">${resetURL}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending email" });
  }
};

// 🟢 Step 2: Reset password using token

export const resetPassword = async (req, res) => {
  
   try {
       const { password } = req.body;
       const { token } = req.params;
   
       const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
   
       const user = await User.findOne({
         resetPasswordToken: hashedToken,
         resetPasswordExpire: { $gt: Date.now() },
       });
   
       if (!user) return res.status(400).json({ message: "Invalid or expired token" });
   
       user.password = password;
       user.resetPasswordToken = undefined;
       user.resetPasswordExpire = undefined;
       await user.save();
   
       res.json({ message: "Password reset successful!" });
     } catch (err) {
       console.error(err);
       res.status(500).json({ message: "Something went wrong" });
     }
   }

// router.post("/reset-password/:token", )

