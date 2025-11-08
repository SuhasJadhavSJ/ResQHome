import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import Adoption from "../../models/adoption.model.js";

const router = express.Router();

// ✅ Get all adoptions by the logged-in user
router.get("/my-adoptions", authMiddleware, async (req, res) => {
  try {
    const adoptions = await Adoption.find({ user: req.user.id })
      .populate("animal", "name type age city image description")
      .sort({ createdAt: -1 });

    if (!adoptions || adoptions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You have not adopted any animals yet.",
        adoptions: [],
      });
    }

    res.status(200).json({ success: true, adoptions });
  } catch (error) {
    console.error("Error fetching adoptions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
