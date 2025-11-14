// backend/Routes/rescued.route.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "../../middleware/auth.middleware.js"; // adjust path if needed
import Rescued from "../../models/rescued.model.js";

const router = express.Router();

// ensure uploads/rescued exists
const uploadDir = path.join(process.cwd(), "uploads", "rescued");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// multer (store files locally)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Public: get list of rescued animals (paginated)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 12, city, type } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (type) filter.type = type;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Rescued.countDocuments(filter);
    const items = await Rescued.find(filter)
      .sort({ rescuedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.json({ success: true, data: items, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (err) {
    console.error("Error getting rescued list:", err);
    res.status(500).json({ success: false, message: "Failed to fetch rescued animals" });
  }
});

// Public: get single rescued item
router.get("/:id", async (req, res) => {
  try {
    const item = await Rescued.findById(req.params.id).populate("rescuedBy", "name email profilePic");
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error("Error getting rescued item:", err);
    res.status(500).json({ success: false, message: "Failed to fetch item" });
  }
});

// Protected: create a rescued animal (corporation/admin)
router.post("/",
  authMiddleware,
  upload.single("image"), // frontend must send "image"
  async (req, res) => {
    try {
      // require corp role (change if you want users to add)
      if (!["corporation", "admin"].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const { name, type, age, city, description, status } = req.body;
      if (!name || !req.file) {
        return res.status(400).json({ success: false, message: "Name and image required" });
      }

      const host = `${req.protocol}://${req.get("host")}`;
      // serve from /uploads/rescued/<filename> — app.js must serve uploads
      const imageUrl = `${host}/uploads/rescued/${req.file.filename}`;

      const newItem = new Rescued({
        name,
        type,
        age,
        city,
        description,
        imageUrl,
        status: status || "available",
        rescuedBy: req.user.id,
      });

      await newItem.save();
      res.status(201).json({ success: true, data: newItem });
    } catch (err) {
      console.error("Error creating rescued item:", err);
      res.status(500).json({ success: false, message: "Failed to create rescued animal" });
    }
  }
);

// Protected: mark adopted/fostered or delete (only corp/admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (!["corporation", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const update = req.body;
    const item = await Rescued.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error("Error updating rescued item:", err);
    res.status(500).json({ success: false, message: "Failed to update" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!["corporation", "admin"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const item = await Rescued.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Error deleting rescued item:", err);
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
});

export default router;
