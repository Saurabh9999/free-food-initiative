import jwt from "jsonwebtoken"
import { User } from "../model/user.js";
import dotenv from "dotenv";

export const sendCookie = (usr, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: usr._id }, process.env.JWT_SECRET ,{
    expiresIn: "15m",
  });

  res.status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "Lax",
      secure: false,     // ✅ set false for localhost (true only in production)
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message,
      role: usr.role,
      user: {
        id: usr._id,
        name: usr.name,
        email: usr.email,
        phone: usr.phone,
      },
    });
};

export const isAdmin = async (req, res, next) => {

  try {

    console.log("Cookies received:", req.cookies);
    const { token } = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usr = await User.findById(decoded._id);

    if (!usr || usr.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.usr = usr;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};