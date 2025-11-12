import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "../../middleware/auth.middleware.js";
import Report from "../../models/report.model.js";

const router = express.Router();

// ✅ Ensure uploads/reports directory exists
const uploadDir = path.join(process.cwd(), "uploads", "reports");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ POST /api/user/report
router.post(
  "/report",
  authMiddleware,
  upload.single("photo"), // this must match the frontend field name
  async (req, res) => {
    try {
      const { type, description, city, address, location } = req.body;

      if (!type || !description || !city) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Image is required" });
      }

      // ✅ Full file URL (so frontend gets correct path)
      const fullImageUrl = `${req.protocol}://${req.get(
        "host"
      )}/uploads/reports/${req.file.filename}`;
      console.log("✅ Image stored at:", fullImageUrl);

      const newReport = new Report({
        user: req.user.id,
        type,
        description,
        city,
        address,
        location: JSON.parse(location || "{}"),
        imageUrl: fullImageUrl, // ✅ use correct field name and absolute URL
      });

      await newReport.save();

      res.status(201).json({
        success: true,
        message: "Report saved successfully",
        report: newReport,
      });
    } catch (error) {
      console.error("❌ Error saving report:", error);
      res
        .status(500)
        .json({ success: false, message: "Error saving report", error });
    }
  }
);

// ✅ GET /api/user/my-reports
router.get("/my-reports", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reports" });
  }
});


// ✅ GET /api/user/report/:id
router.get("/report/:id", authMiddleware, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report)
      return res.status(404).json({ success: false, message: "Report not found" });

    // ensure only owner can view
    if (report.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    res.status(200).json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching report" });
  }
});

// ✅ DELETE /api/user/delete-report/:id
router.delete("/delete-report/:id", authMiddleware, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report)
      return res.status(404).json({ success: false, message: "Report not found" });

    if (report.user.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: "Unauthorized" });

    await report.deleteOne();
    res.status(200).json({ success: true, message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting report" });
  }
});


export default router;
