import express from 'express'
import dotenv from 'dotenv/config'
import cors from 'cors'
import connectDb from './config/db.js';
import signupRoute from './Routes/UserRoutes/user.signup.route.js'
import loginRoute from './Routes/UserRoutes/user.login.route.js'
import authMiddleware from './middleware/auth.middleware.js';
import userProfile from './Routes/UserRoutes/user.profile.route.js'
import logoutRoute from './Routes/UserRoutes/user.logout.route.js'
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

// Database Connection :
connectDb();

// Cors for cross origin platform
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

// Routes :

// Signup Route
app.use('/api/auth',signupRoute)
// Login Route
app.use('/api/auth',loginRoute)
// logout Route
app.use('/api/auth',logoutRoute)
// Profile Route
app.use('/api/user',authMiddleware,userProfile)

app.listen(PORT,()=>{
    console.log(`Server Running On Port ${PORT}`)
})