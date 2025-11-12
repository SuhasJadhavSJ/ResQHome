import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/user.module.js";
import authMiddleware from "../../middleware/auth.middleware.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = express.Router();

/**
 * @desc Get logged-in user profile
 * @route GET /api/user/profile
 * @access Private
 */


// 🔹 Profile Picture Upload Directory
const uploadDir = path.join(process.cwd(), "uploads", "profiles");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Update profile
router.put("/update-profile", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const { name, city } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.name = name || user.name;
    user.city = city || user.city;

    if (req.file) {
      user.profilePic = `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
});

// ✅ Update password
router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: "Incorrect current password" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update failed:", error);
    res.status(500).json({ success: false, message: "Failed to update password" });
  }
});


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
/**
 * @desc Update user profile
 * @route PUT /api/user/profile
 * @access Private
 */
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, city, password, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic info
    if (name) user.name = name;
    if (city) user.city = city;

    // Password change logic
    if (password && newPassword) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Incorrect current password" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
