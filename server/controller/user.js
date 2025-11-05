import express from "express"
import { User } from "../model/user.js"
import { sendCookie } from "../utils/feature.js";
import jwt from "jsonwebtoken"
import bcrypt, { hash } from "bcryptjs";

const app = express();
app.use(express.json())

export const registerUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  let usr = await User.findOne({ email });
  if (usr) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  usr = await User.create({
    name,
    email,
    phone,
    password, // plain password (hook will hash)
    role: role || "user",
  });

  sendCookie(usr, res, "Registered successfully", 201);
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Check input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password",
      });
    }

    // 🔹 Find user and include password field
    const usr = await User.findOne({ email }).select("+password");

    if (!usr) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔹 Compare hashed password
    const isMatched = await bcrypt.compare(password, usr.password);

    if (!isMatched) {
      return res.status(404).json({
        success: false,
        message: "Invalid password",
      });
    }

    // 🔹 Update last login time
    usr.lastLogin = new Date();
    await usr.save();

    // 🔹 Send JWT token cookie
    return sendCookie(usr, res, `Welcome back ${usr.name}`, 200);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
    });
  }
};


export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // expire immediately
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
 
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const getMyProfile = async (req,res) =>{ 

  res.status(200).json({
    success:true,
    usr:req.usr,
  })
}


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Existing getProfile
export const getProfile = async (req, res) => {
  try {
    const user = await user.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, usr: user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// New updateProfile controller
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.usr.id,
      { name, email, phone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Error updating profile" });
  }
};


