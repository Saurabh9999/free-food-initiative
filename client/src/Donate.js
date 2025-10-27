import React, { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

// ✅ Load your Stripe publishable key once
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// 🔹 Checkout Form Component
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success", // ✅ Redirect after payment success
      },
    });

    if (error) {
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <PaymentElement />
      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        style={styles.payButton}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

// 🔹 Main Donate Component
export default function Donate() {
  const [amount, setAmount] = useState(100);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Memoize options so Elements doesn't re-render unnecessarily
  const options = useMemo(() => ({ clientSecret }), [clientSecret]);

  const handleDonate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        alert("Failed to create payment. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating payment.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1>💖 Support Our Food Initiative</h1>
      <p>Your contribution helps us serve meals to those in need.</p>

      {!clientSecret ? (
        <div style={styles.donateBox}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
            style={styles.input}
          />
          <button
            onClick={handleDonate}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Please wait..." : `Donate ₹${amount}`}
          </button>
        </div>
      ) : (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

// 🔹 Simple CSS-in-JS styling
const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "#f9fafb",
    borderRadius: "16px",
    maxWidth: "500px",
    margin: "50px auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  donateBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
  },
  input: {
    width: "120px",
    padding: "8px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  button: {
    backgroundColor: "#ff5722",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  payButton: {
    marginTop: "20px",
    backgroundColor: "#ff5722",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
};
