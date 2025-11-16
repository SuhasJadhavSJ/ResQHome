import express from "express";
import Rescued from "../../models/rescued.model.js";

const router = express.Router();

/**
 * PUBLIC — Anyone can view rescued animals
 */
router.get("/", async (req, res) => {
  try {
    const animals = await Rescued.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: animals
    });
  } catch (err) {
    console.error("Public rescued fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
