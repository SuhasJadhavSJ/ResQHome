import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/user.module.js";
import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @desc Get logged-in user profile
 * @route GET /api/user/profile
 * @access Private
 */
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
