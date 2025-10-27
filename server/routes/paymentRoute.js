import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe("your_stripe_secret_key"); // ⚠️ Replace with your test key

// 🧾 Create a Payment Intent (for testing)
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees

    // Stripe uses paise (smallest currency unit), so multiply by 100
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      description: "Food Serving Donation",
      payment_method_types: ["card"],
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
