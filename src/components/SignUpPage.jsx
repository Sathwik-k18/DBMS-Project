import { useState } from "react";
import { signupUser, signupAdmin } from "../utils/api";
import { generateOTP, sendOTPEmail } from "../utils/sendOTP";

export default function SignupPage({ onGoToOTP, onGoToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Call correct signup based on role
    const result = form.role === "user"
      ? await signupUser(form)
      : await signupAdmin(form);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Generate + send OTP
    const otp = generateOTP();
    const emailResult = await sendOTPEmail({ name: form.name, email: form.email, otp });

    if (!emailResult.success) {
      setError("Failed to send OTP. Please try again.");
      setLoading(false);
      return;
    }

    setLoading(false);
    onGoToOTP(form.email, form.name, otp, form.role);
  };

  return (
    <div className="login-page">
      <div className="login-top">
        <h1 className="main-heading">Municipal Corporation</h1>
        <div className="divider"></div>
        <h2 className="title">🏛️ Create Account</h2>
        <p className="subtitle">Register to submit and track complaints</p>
      </div>

      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Register as</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User / Resident</option>
              <option value="admin">Administrator</option>
              <option value="officer">Municipal Officer</option>
            </select>
          </div>

          {error && <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>❌ {error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "14px" }}>
          Already have an account?{" "}
          <span style={{ color: "#1b5e20", cursor: "pointer", fontWeight: "bold" }} onClick={onGoToLogin}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}