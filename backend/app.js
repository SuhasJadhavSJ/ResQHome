import express from 'express'
import dotenv from 'dotenv/config'
import connectDb from './config/db.js';
import signupRoute from './Routes/UserRoutes/user.signup.route.js'
import loginRoute from './Routes/UserRoutes/user.login.route.js'
import authMiddleware from './middleware/auth.middleware.js';
import userProfile from './Routes/UserRoutes/user.profile.route.js'

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

// Database Connection :
connectDb();

// Routes :

// Signup Route
app.use('/',signupRoute)
// Login Route
app.use('/',loginRoute)
// Profile Route
app.use('/',authMiddleware,userProfile)

app.listen(PORT,()=>{
    console.log(`Server Running On Port ${PORT}`)
})