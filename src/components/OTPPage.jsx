import { useState } from "react";
import { verifyAccount } from "../utils/api";

export default function OTPPage({ email, otp, role, onVerified }) {
  const [enteredOTP, setEnteredOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (enteredOTP !== otp) {
      setError("Invalid OTP. Please try again.");
      setLoading(false);
      return;
    }

    // Verify correct table based on role
    await verifyAccount(email, role);
    setLoading(false);
    alert("✅ Account verified! Please login.");
    onVerified();
  };

  return (
    <div className="login-page">
      <div className="login-top">
        <h1 className="main-heading">Municipal Corporation</h1>
        <div className="divider"></div>
        <h2 className="title">📧 Verify Your Email</h2>
        <p className="subtitle">OTP sent to {email}</p>
      </div>

      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Enter 6-digit OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOTP}
              onChange={(e) => setEnteredOTP(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          {error && <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>❌ {error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}