import { useState } from "react";
import { loginUser, loginAdmin } from "../utils/api";
import { sendLoginEmail } from "../utils/sendEmail"; // ← from sendEmail.js

export default function LoginPage({ onLoginSuccess, onGoToSignup }) {
  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Call correct login based on role
    const result = form.role === "user"
      ? await loginUser(form)
      : await loginAdmin(form);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Send login notification (won't block login if email fails)
    await sendLoginEmail({
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    });

    onLoginSuccess(result.user);
  };

  return (
    <div className="login-page">
      <div className="login-top">
        <h1 className="main-heading">Municipal Corporation Complaint System</h1>
        <div className="divider"></div>
        <h2 className="title">🏛️ Municipal Corporation</h2>
        <p className="subtitle">Civic Complaint Management System</p>
        <p className="desc">
          Report civic issues like roads, water supply, and waste management.
        </p>
      </div>

      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Login as</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User / Resident</option>
              <option value="admin">Administrator</option>
              <option value="officer">Municipal Officer</option>
            </select>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>
              ❌ {error}
            </p>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "12px", fontSize: "14px" }}>
          New user?{" "}
          <span
            style={{ color: "#1b5e20", cursor: "pointer", fontWeight: "bold" }}
            onClick={onGoToSignup}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}