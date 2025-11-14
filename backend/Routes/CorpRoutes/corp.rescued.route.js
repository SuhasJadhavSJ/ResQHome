// backend/Routes/CorpRoutes/rescued.route.js
import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import Report from "../../models/report.model.js";
import Rescued from "../../models/rescued.model.js";

const router = express.Router();

/**
 * 👉 MARK REPORT AS RESCUED + CREATE RESCUED ENTRY
 */
// backend/Routes/CorpRoutes/corp.rescue.route.js

router.post("/report/:id/rescue", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "corporation") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    // Mark report as rescued
    report.status = "rescued";
    await report.save();

    // Add rescued animal record
    const rescuedAnimal = await Rescued.create({
      name: report.type,
      type: report.type,
      city: report.city,
      description: report.description,
      imageUrl: report.imageUrl,
      rescuedBy: req.user.id,
      rescuedAt: new Date(),
      status: "available",
      meta: {
        medicalHistory: [
          { date: new Date(), note: "Initial rescue completed" }
        ],
      },
    });

    return res.json({
      success: true,
      message: "Animal marked as rescued successfully",
      data: rescuedAnimal,
    });
  } catch (err) {
    console.error("Rescue processing error:", err);
    return res.status(500).json({
      success: false,
      message: "Error processing rescue request",
    });
  }
});


/**
 * 👉 GET all rescued animals
 */


/**
 * 👉 GET single rescued animal details
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

/**
 * ---------------------------------------------------------
 * 3️⃣ GET SINGLE RESCUED ANIMAL DETAILS
 * ---------------------------------------------------------
 */
router.get("/rescued/:id", authMiddleware, async (req, res) => {
  try {
    const animal = await Rescued.findById(req.params.id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    res.json({ success: true, data: animal });
  } catch (err) {
    console.error("Error fetching rescued animal:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ---------------------------------------------------------
 * 4️⃣ ADD MEDICAL HISTORY ENTRY
 * ---------------------------------------------------------
 */
router.post("/rescued/:id/medical", authMiddleware, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res
        .status(400)
        .json({ success: false, message: "Note is required" });
    }

    const animal = await Rescued.findById(req.params.id);
    if (!animal) {
      return res
        .status(404)
        .json({ success: false, message: "Animal not found" });
    }

    if (!animal.meta) animal.meta = {};
    if (!animal.meta.medicalHistory) animal.meta.medicalHistory = [];

    animal.meta.medicalHistory.push({ date: new Date(), note });

    await animal.save();

    res.json({ success: true, data: animal });
  } catch (err) {
    console.error("Error updating medical history:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
