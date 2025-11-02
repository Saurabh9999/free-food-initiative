import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Get reference number from query string
  const referenceNum = searchParams.get("reference");

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>🎉 Payment Successful</h1>
        <p style={styles.text}>Thank you for your donation!</p>

        {referenceNum && (
          <p style={styles.reference}>
            Reference No: <span style={styles.referenceValue}>{referenceNum}</span>
          </p>
        )}

        <button style={styles.button} onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    </div>
  );
};

// 💅 Inline Styles
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom, #fff5e6, #ffe0b2)",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  heading: {
    color: "#2e7d32",
    fontSize: "24px",
    marginBottom: "10px",
    textTransform: "uppercase",
  },
  text: {
    color: "#444",
    fontSize: "16px",
    marginBottom: "15px",
  },
  reference: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  referenceValue: {
    color: "#ff5722",
  },
  button: {
    backgroundColor: "#ff5722",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default PaymentSuccess;
