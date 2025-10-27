import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    age:{
        type: Number,
        required:false,
    }
})
   export const volunteer = mongoose.model("Volunteer",Schema)