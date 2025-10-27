import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordModal() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState(""); // password strength state

  // ✅ Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

    if (strongRegex.test(password)) return "Strong";
    return "Medium";
  };

  useEffect(() => {
    setStrength(checkPasswordStrength(password));
  }, [password]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    // ✅ Frontend validation before sending request
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!strongPassword.test(password)) {
      setMessage(
        "⚠️ Password must be at least 8 characters, include uppercase, lowercase, number, and special symbol."
      );
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      setMessage(data.message);

      if (data.message.toLowerCase().includes("successful")) {
        setTimeout(() => navigate("/"), 1500); // redirect after 1.5s
      }
    } catch (err) {
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  // ✅ Get color for strength meter
  const getStrengthColor = () => {
    switch (strength) {
      case "Weak":
        return "red";
      case "Medium":
        return "orange";
      case "Strong":
        return "green";
      default:
        return "#ccc";
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Reset Your Password</h2>
        {message && <p className="message">{message}</p>}

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ✅ Password strength indicator */}
          {password && (
            <p
              style={{
                color: getStrengthColor(),
                fontWeight: "bold",
                marginTop: "4px",
              }}
            >
              Strength: {strength}
            </p>
          )}

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{
              backgroundColor: "#ff5722",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
