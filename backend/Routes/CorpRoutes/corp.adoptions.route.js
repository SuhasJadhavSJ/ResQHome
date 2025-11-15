import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import authMiddleware from "../../middleware/auth.middleware.js";
import AdoptionAnimal from "../../models/adoptionAnimal.model.js";

const router = express.Router();

// -------------------------------------------
// 📁 Ensure required folders exist
// -------------------------------------------
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const baseDir = path.join(process.cwd(), "uploads/adoption");
const medicalDir = path.join(baseDir, "medical");
const videoDir = path.join(baseDir, "videos");

ensureDir(baseDir);
ensureDir(medicalDir);
ensureDir(videoDir);

// -------------------------------------------
// 📸 Multer Storage Engine
// -------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "medicalImages") return cb(null, medicalDir);
    if (file.fieldname === "video") return cb(null, videoDir);
    cb(null, baseDir);
  },

  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    ),
});

const upload = multer({ storage });

// ✔ supports multiple images, medicalImages, and 1 video
const uploadFields = upload.fields([
  { name: "images", maxCount: 10 },
  { name: "medicalImages", maxCount: 10 },
  { name: "video", maxCount: 1 },
]);

// -------------------------------------------
// 🟢 CREATE ADOPTION LISTING
// -------------------------------------------
router.post("/adoption/create", authMiddleware, uploadFields, async (req, res) => {
  try {
    const body = req.body;

    const images =
      req.files["images"]?.map(
        (f) => `${req.protocol}://${req.get("host")}/uploads/adoption/${f.filename}`
      ) || [];

    const medicalImages =
      req.files["medicalImages"]?.map(
        (f) => `${req.protocol}://${req.get("host")}/uploads/adoption/medical/${f.filename}`
      ) || [];

    const video = req.files["video"]
      ? `${req.protocol}://${req.get("host")}/uploads/adoption/videos/${req.files["video"][0].filename}`
      : null;

    // Format medical notes
    let medicalHistory = [];
    if (body.medicalHistory) {
      if (Array.isArray(body.medicalHistory)) {
        medicalHistory = body.medicalHistory.map((note) => ({
          note,
          date: new Date(),
        }));
      } else {
        medicalHistory = [{ note: body.medicalHistory, date: new Date() }];
      }
    }

    const animal = await AdoptionAnimal.create({
      ...body,
      images,
      medicalImages,
      video,
      medicalHistory,
      createdBy: req.user.id,
    });

    res.json({ success: true, data: animal });
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ success: false, message: "Error creating listing" });
  }
});

// -------------------------------------------
// 🟢 GET ALL LISTINGS
// -------------------------------------------
router.get("/adoptions", authMiddleware, async (req, res) => {
  try {
    const animals = await AdoptionAnimal.find().sort({ createdAt: -1 });
    res.json({ success: true, data: animals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// -------------------------------------------
// 🟢 GET SINGLE LISTING
// -------------------------------------------
router.get("/adoption/:id", authMiddleware, async (req, res) => {
  try {
    const animal = await AdoptionAnimal.findById(req.params.id);

    if (!animal)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, data: animal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// -------------------------------------------
// 🟡 EDIT LISTING (Supports image/video update)
// -------------------------------------------
router.put(
  "/adoption/:id/edit",
  authMiddleware,
  uploadFields,
  async (req, res) => {
    try {
      const body = req.body;
      const update = { ...body };

      // Replace images if uploaded
      if (req.files["images"])
        update.images = req.files["images"].map(
          (f) => `${req.protocol}://${req.get("host")}/uploads/adoption/${f.filename}`
        );

      // Replace medical images if uploaded
      if (req.files["medicalImages"])
        update.medicalImages = req.files["medicalImages"].map(
          (f) => `${req.protocol}://${req.get("host")}/uploads/adoption/medical/${f.filename}`
        );

      // Replace video if uploaded
      if (req.files["video"])
        update.video = `${req.protocol}://${req.get("host")}/uploads/adoption/videos/${req.files["video"][0].filename}`;

      const updated = await AdoptionAnimal.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
      );

      res.json({ success: true, data: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  }
);

// -------------------------------------------
// 🔴 DELETE LISTING
// -------------------------------------------
router.delete("/adoption/:id", authMiddleware, async (req, res) => {
  try {
    await AdoptionAnimal.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
