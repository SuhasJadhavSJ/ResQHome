import express from 'express'

const router = express.Router();

router.get('/profile',(req,res)=>{
    return res.send("Profile Page")
})

export default router