// routes/auth/logout.js
import express from "express";
const router = express.Router();

router.post("/logout", (req, res) => {
  try {
    // Client just needs to clear token
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;
