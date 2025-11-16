import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import Adoption from "../../models/adoption.model.js";
import AdoptionAnimal from "../../models/adoptionAnimal.model.js";
import User from "../../models/user.module.js";

const router = express.Router();

/**
 * ✔ 1. GET ALL ADOPTION REQUESTS (Corp Only)
 */
router.get("/requests", authMiddleware, async (req, res) => {
  try {
    if (!["corporation", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const requests = await Adoption.find()
      .populate({ path: "animal", select: "name images type age city" })
      .populate({ path: "user", model: "user", select: "name email city" })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("Error fetching adoption requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✔ 2. GET SINGLE REQUEST DETAILS
 */
router.get("/requests/:id", authMiddleware, async (req, res) => {
  try {
    if (!["corporation", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const request = await Adoption.findById(req.params.id)
      .populate({
        path: "animal",
        select: "name images type age city description medicalHistory"
      })
      .populate({
        path: "user",
        model: "user",
        select: "name email city"
      });

    if (!request)
      return res.status(404).json({ success: false, message: "Request not found" });

    res.json({ success: true, data: request });
  } catch (err) {
    console.error("Error fetching single adoption request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ✔ 3. UPDATE REQUEST STATUS
 */
router.put("/requests/:id/status", authMiddleware, async (req, res) => {
  try {
    if (!["corporation", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const { status } = req.body;
    const validStatus = ["pending", "in_process", "rejected", "adopted"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const request = await Adoption.findById(req.params.id);
    if (!request)
      return res.status(404).json({ success: false, message: "Request not found" });

    request.status = status;

    if (status === "adopted") {
      request.adoptedAt = new Date();
      await AdoptionAnimal.findByIdAndUpdate(request.animal, { status: "adopted" });
    }

    await request.save();

    res.json({ success: true, message: "Status updated", data: request });
  } catch (err) {
    console.error("Error updating request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
