import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDb from "./config/db.js";
import fs from "fs";
import signupRoute from "./Routes/UserRoutes/user.signup.route.js";
import loginRoute from "./Routes/UserRoutes/user.login.route.js";
import logoutRoute from "./Routes/UserRoutes/user.logout.route.js";
import userProfile from "./Routes/UserRoutes/user.profile.route.js";
import userAdoptionRoute from "./Routes/UserRoutes/user.adoption.route.js";
import reportRoute from "./Routes/UserRoutes/report.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Database connection
connectDb();

// ✅ Serve uploads folder (includes /reports, /profilePics, etc.)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

console.log("🗂 Serving static from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

// Routes
app.use("/api/auth", signupRoute);
app.use("/api/auth", loginRoute);
app.use("/api/auth", logoutRoute);
app.use("/api/user", userProfile);
app.use("/api/user", userAdoptionRoute);
app.use("/api/user", reportRoute);

// Server start
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
