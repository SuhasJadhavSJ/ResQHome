import express from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import Adoption from "../../models/adoption.model.js";
import AdoptionAnimal from "../../models/adoptionAnimal.model.js";

const router = express.Router();

/**
 * ================================
 *  GET: Logged-in user's adoption records
 * ================================
 */
router.get("/my-adoptions", authMiddleware, async (req, res) => {
  try {
    const allAdoptions = await Adoption.find({ user: req.user.id })
      .populate("animal", "name type age city images description") // using images[]
      .sort({ createdAt: -1 });

    const underProcess = allAdoptions.filter((a) => a.status === "pending");
    const approved = allAdoptions.filter((a) => a.status === "approved");
    const rejected = allAdoptions.filter((a) => a.status === "rejected");

    return res.json({
      success: true,
      data: {
        pending: underProcess,
        approved,
        rejected
      }
    });

  } catch (error) {
    console.error("❌ Error fetching adoptions:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ================================
 *  POST: Adoption request
 * ================================
 */
router.post("/adopt/:animalId", authMiddleware, async (req, res) => {
  try {
    const { animalId } = req.params;
    const userId = req.user.id;

    // Validate animal existence
    const animalExists = await AdoptionAnimal.findById(animalId);
    if (!animalExists) {
      return res.status(404).json({ success: false, message: "Animal not found" });
    }

    // Prevent duplicate pending/approved request
    const existingRequest = await Adoption.findOne({
      user: userId,
      animal: animalId,
      status: { $in: ["pending", "approved"] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have an active/approved request for this animal"
      });
    }

    const adoption = await Adoption.create({
      user: userId,
      animal: animalId,
      status: "pending"
    });

    return res.json({
      success: true,
      message: "Your adoption request has been submitted and is under review.",
      data: adoption
    });

  } catch (error) {
    console.error("❌ Adoption request error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * ================================
 * OPTIONAL: Get all animals available for adoption (public view)
 * ================================
 */
router.get("/available", async (req, res) => {
  try {
    const animals = await AdoptionAnimal.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: animals
    });

  } catch (error) {
    console.error("❌ Fetch animals error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
