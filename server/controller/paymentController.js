// backend/controllers/donateController.js
import Stripe from "stripe";
import { instance } from "../index.js";
import crypto from "crypto"
import { Payment } from "../model/Payment.js";

export const checkout = async (req,res) =>{
 
    const options = {
  amount: Number(req.body.amount * 100),  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  currency: "INR",
//   receipt: "order_rcptid_11"
};
   const order = await instance.orders.create(options);

  //  console.log(order)
  console.log("Received body:", req.body);
   res.status(200).json({
    success:true,
    order,
   });
}

 
  export const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  console.log("📩 Verification route hit!");
  console.log("Received:", req.body);

  // Combine order_id and payment_id
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  // Generate signature using your secret
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
  
     const isAuthentic = expectedSignature === razorpay_signature;

if (isAuthentic) {
  await Payment.create({
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature
  });

  res.status(200).json({
    success: true,
    paymentId: razorpay_payment_id,
    message: "Payment verified successfully"
  });
}
else {
    // ❌ If invalid (possible tampering)
    res.status(400).json({ success: false, message: "Signature mismatch" });
  }
};
