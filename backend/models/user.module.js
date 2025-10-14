import mongoose from "mongoose";

const userModule = mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    role : {
        type : String,
        default : 'user'
    },
    city : {
        type : String,
        require : true
    }
})

const User = mongoose.model("user",userModule)

export default User