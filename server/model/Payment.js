import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    razorpay_order_id:{
        type:String,
        reqyuired:true
    }, 
    razorpay_payment_id:{
        type:String,
        reqyuired:true
    },
     razorpay_signature:{
        type:String,
        reqyuired:true
     }
});

export const Payment = mongoose.model("Payment",paymentSchema)