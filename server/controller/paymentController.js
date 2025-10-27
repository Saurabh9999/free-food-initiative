// backend/controllers/donateController.js
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const  createPaymentIntent  = async (req, res) => {
  try {
    const { amount } = req.body;

   const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert ₹ to paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
