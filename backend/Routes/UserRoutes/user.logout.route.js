import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post("/logout",(req,res)=>{
    try {
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
})

export default router