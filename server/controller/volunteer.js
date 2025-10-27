import express from "express";
import { volunteer} from "../model/volunteer.js";
import { sendCookie } from "../utils/feature.js";

const app = express()
app.use(express.json())

export const registerVolunteer = (req,res) =>{
    const {name,email,phone} = req.body;

    const volunter = volunteer.create({
        name,
        email,
        phone
    })

    sendCookie(volunter,res,"wlcome",201)
}

export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await volunteer.find();
    return res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};