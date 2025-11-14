// backend/Routes/CorpRoutes/corp.reports.route.js
import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import Report from "../../models/report.model.js";

const router = express.Router();

// Get all user reports for corporation
router.get("/reports", authMiddleware, async (req, res) => {
  try {
    // Only corporation can access
    if (req.user.role !== "corporation") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    // Fetch ALL reports in descending order
    const reports = await Report.find().sort({ createdAt: -1 });

    res.json({ success: true, data: reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error fetching reports" });
  }
});

router.put("/reports/update-status/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "corporation")
      return res.status(403).json({ success: false, message: "Not allowed" });

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
});


export default router;
