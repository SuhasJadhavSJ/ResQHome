import express from 'express'
import User from '../../models/user.module.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post("/signup", async (req,res)=>{
    try {
        const {name, email, password} = req.body;
        
        // 401 
        if(!name || !email || !password) return res.status(401).json({error : "All field are required"})

        // Find user if already present :
        const presentUser = await User.findOne({email})
        if(presentUser) return res.status(400).json({error : "User Already Exists"})
        
        // Hash the password :
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        // save the user info : 
        const user = new User({name, email,password : hashPassword})
        await user.save();

        // Create Token :
        const token = jwt.sign(
            {id : user._id, role : user.role, email : user.email},
            process.env.SECRET_KEY,
            {expiresIn : "1h"}
        )

        res.status(201).json({ message: "User created successfully" , token : token});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default router