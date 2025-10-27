import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    start_time:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:false
    },
      coordinates: {
    lat: Number,
    lng: Number
  },
})

export const location = mongoose.model("Location",Schema)