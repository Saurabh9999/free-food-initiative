import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import cookieParser from "cookie-parser";
import cors from 'cors'
import dotenv from "dotenv"
import Razorpay from "razorpay";

import { getAllUsers, getMyProfile, loginUser, registerUser, updateProfile } from "./controller/user.js";
import connectdb from "./data/database.js";
import { isAuthenticated } from "./middleware/auth.js";
import { registerVolunteer,getAllVolunteers } from "./controller/volunteer.js";
import { isAdmin } from "./utils/feature.js";
import { checkout, paymentVerification } from "./controller/paymentController.js";
import { forgotPassword, resetPassword } from "./controller/authController.js";

const app = express();
const server = http.createServer(app);
dotenv.config();

const PORT = process.env.PORT || 5000;

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to client/build correctly
const reactBuildPath = path.join(__dirname, "../client/build");

// Connect DB
connectdb();

// Middleware
// app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔹 API Routes
app.get("/api/test", (req, res) => {
  res.send("API is working fine 👍");
});

app.get("/reset-password/:token", (req, res) => {
  res.sendFile(path.join(process.cwd(), "reset-password.html"));
})


app.post("/api/users/register", registerUser);
app.post("/api/users/login", loginUser);
// app.get("/api/logout", logout);
app.get("/me", isAuthenticated, getMyProfile);
app.post("/volunteer", registerVolunteer);
app.get("/users",isAdmin,getAllUsers);
app.get("/volunteers",isAdmin,getAllVolunteers);
// app.post("/api/payment",createPaymentIntent);
app.post("/api/users/forgot-password", forgotPassword);
app.post("/api/users/reset-password/:token", resetPassword);
app.put("/update-profile",isAuthenticated,updateProfile)

// 🔹 Serve React frontend (AFTER API routes)
app.use(express.static(reactBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"));
});

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.post("/api/checkout",checkout)
app.post("/api/paymentVerification",paymentVerification)

// Start Server
server.listen(PORT, () => {
  console.log("server is running on port 5000");
});
