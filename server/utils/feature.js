import jwt from "jsonwebtoken"
import { user } from "../model/user.js";
import dotenv from "dotenv";

export const sendCookie = (usr, res, message, statusCode = 200) => {
  const token = jwt.sign({ _id: usr._id }, process.env.JWT_SECRET);

  res.status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
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
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, "ytrtydtrdrtdt");
    const usr = await user.findById(decoded._id);

    if (!usr || usr.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    req.user = usr;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};