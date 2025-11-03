import React, { useState } from "react";
import axios from "axios";

export default function Donate() {
  const [amount, setAmount] = useState(100);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!amount || amount < 1) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      // ✅ 1. Create order via backend
      const { data } = await axios.post("http://localhost/5000/api/checkout", {
        amount,
      });

      const { order } = data;

      // ✅ 2. Initialize Razorpay with order details
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "💖 Food Initiative",
        description: "Support Our Food Initiative",
        order_id: order.id,
         handler: async function (response) {
    try {
      // Verify payment via backend
      const verify = await axios.post(
        "http://localhost/5000/api/paymentVerification",
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }
      );

      if (verify.data.success) {
        window.location.href = `/paymentsuccess?reference=${response.razorpay_payment_id}`;
      } else {
        alert("Payment verification failed!");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Something went wrong during payment verification.");
    }
  },

  
        prefill: {
          name: "Saurabh",
          email: "saurabh@example.com",
        },
        theme: {
          color: "#ff5722",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>💖 Support Our Food Initiative</h1>
      <p>Your contribution helps us serve meals to those in need.</p>

      <div style={styles.donateBox}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="10"
          style={styles.input}
        />
        <button onClick={handleDonate} style={styles.button}>
          Donate ₹{amount}
        </button>
      </div>
    </div>
  );
}

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
};
