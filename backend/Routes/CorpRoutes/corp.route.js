// backend/Routes/CorpRoutes/corp.route.js
import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import Report from "../../models/report.model.js";
import Rescued from "../../models/rescued.model.js";
import Adoption from "../../models/adoption.model.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const inProcess = await Report.countDocuments({ status: "in-progress" });
    const rescued = await Rescued.countDocuments();
    const adoptionListed = await Rescued.countDocuments({ status: "available" });
    const pendingRequests = await Adoption.countDocuments({
      status: "pending",
    });

    const recentReports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totalReports,
        inProcess,
        rescued,
        adoptionListed,
        pendingRequests,
        recentReports,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Dashboard error" });
  }
});

export default router;
