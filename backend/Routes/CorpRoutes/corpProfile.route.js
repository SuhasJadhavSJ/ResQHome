import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import User from "../../models/user.module.js";

const router = express.Router();

/* ===== Ensure Upload Directory Exists ===== */
const uploadDir = path.join("uploads", "profile");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===== Multer Config ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});

const upload = multer({ storage });

/* ===== GET PROFILE ===== */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const corp = await User.findById(req.user.id).select("-password");
    if (!corp || corp.role !== "corporation") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, data: corp });
  } catch (err) {
    console.error("GET profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ===== UPDATE PROFILE ===== */
router.put("/profile", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const corp = await User.findById(req.user.id);
    if (!corp || corp.role !== "corporation") {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, city, bio, website } = req.body;

    if (name) corp.name = name;
    if (city) corp.city = city;
    if (bio) corp.bio = bio;
    if (website) corp.website = website;

    if (req.file) {
      corp.profilePic = req.file.path.replace(/\\/g, "/");  // Normalize path
    }

    await corp.save();

    res.json({ success: true, message: "Profile updated successfully", data: corp });
  } catch (err) {
    console.error("PUT profile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
