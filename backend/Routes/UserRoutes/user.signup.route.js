// routes/auth/signup.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.module.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, city, password, role } = req.body;

    if (!name || !email || !city || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      city,
      password: hash,
      role, // 'user' or 'corporation'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token: `Bearer ${token}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
