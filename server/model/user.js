import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
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
    password:{
        type: String,
        select:false,
        required:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    lastLogin: {
    type: Date, // track last login time
  },
})
   export const user = mongoose.model("User",Schema)