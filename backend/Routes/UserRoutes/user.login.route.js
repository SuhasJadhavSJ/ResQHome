import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../../models/user.module.js';


const router = express.Router();

router.post('/login',async(req,res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password) return res.status(403).json({message : "All field are Required"})

        const user = await User.findOne({email})
        if(!user) return res.status(404).json({message : "User not Found"})    

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(401).json({message : "Invalid Credentials"})
        }
        
        const token = jwt.sign(
            {id : user._id, email : user.email, role : user.role},
            process.env.SECRET_KEY,
            {expiresIn : "1h"}
        )

        res.status(200).json({message : "Login Successfully",token : token})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router;