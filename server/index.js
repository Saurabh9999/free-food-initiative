import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";

import {
  getAllUsers,
  getMyProfile,
  loginUser,
  logout,
  registerUser,
  updateProfile,
} from "./controller/user.js";
import connectdb from "./data/database.js";
import { isAuthenticated } from "./middleware/auth.js";
import { registerVolunteer, getAllVolunteers } from "./controller/volunteer.js";
import { isAdmin } from "./utils/feature.js";
import { checkout, paymentVerification } from "./controller/paymentController.js";
import authRoutes from "./routes/authRoutes.js";
import { forgotPassword, resetPassword } from "./controller/emailLinks.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// React build path
const reactBuildPath = path.join(__dirname, "../client/build");

// ✅ Connect Database
connectdb();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Cookie Parser (must come before route handlers)
app.use(cookieParser());

// ✅ CORS setup (important for cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL, // React app URL
    credentials: true, // Allow cookies to be sent
  })
);

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.send("API is working fine 👍");
});

// ✅ Debug cookie (for testing)
app.use((req, res, next) => {
  console.log("Cookies received:", req.cookies);
  next();
});

// ✅ Routes
// app.use("/api/users", authRoutes);
app.post("/api/users/forgot-password",forgotPassword);
app.post("/api/users/reset-password/:token",resetPassword)
app.post("/api/users/register", registerUser);
app.get("/logout",isAuthenticated,logout)
app.post("/api/users/login", loginUser);
app.get("/me", isAuthenticated, getMyProfile);
app.post("/volunteer", registerVolunteer);
app.get("/users", getAllUsers);
app.get("/volunteers", getAllVolunteers);
app.put("/update-profile", isAuthenticated, updateProfile);

// ✅ Payment routes
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
app.post("/api/checkout", checkout);
app.post("/api/paymentVerification", paymentVerification);

// ✅ Serve React frontend
app.use(express.static(reactBuildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

// ✅ Start server
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
