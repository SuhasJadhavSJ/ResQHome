import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import Rescued from "../../models/rescued.model.js";

const router = express.Router();

/**
 * 👉 GET all rescued animals
 */
router.get("/rescued", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "corporation") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const animals = await Rescued.find().sort({ createdAt: -1 });

    res.json({ success: true, data: animals });
  } catch (err) {
    console.error("Error fetching rescued animals:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/rescued/:id", authMiddleware, async (req, res) => {
  try {
    const animal = await Rescued.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({ success: false, message: "Animal not found" });
    }

    res.json({ success: true, data: animal });
  } catch (err) {
    console.error("Error fetching rescued animal:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Add new medical entry
 */
router.post("/rescued/:id/medical", authMiddleware, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ success: false, message: "Note is required" });
    }

    const animal = await Rescued.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({ success: false, message: "Animal not found" });
    }

    animal.meta = animal.meta || {};
    animal.meta.medicalHistory = animal.meta.medicalHistory || [];

    animal.meta.medicalHistory.push({
      date: new Date(),
      note,
    });

    await animal.save();

    res.json({ success: true, data: animal });
  } catch (err) {
    console.error("Error updating medical history:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
