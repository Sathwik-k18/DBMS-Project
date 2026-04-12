import { useState } from "react";
import "./styles.css";
import ComplaintForm from "./components/ComplaintForm";

export default function App() {
  const [page, setPage] = useState("login");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [showComplaintForm, setShowComplaintForm] = useState(false); // 🆕

  const passwords = {
    user: "user123",
    admin: "admin123",
    officer: "officer123",
  };

  const handleLogin = () => {
    if (password === passwords[role]) {
      setPage("home");
    } else {
      alert("❌ Wrong password. Please try again.");
    }
  };

  const handleLogout = () => {
    setPage("login");
    setPassword("");
    setRole("user");
    setShowComplaintForm(false); // 🆕 reset on logout
  };

  // LOGIN PAGE — unchanged
  if (page === "login") {
    return (
      <div className="login-page">
        <div className="login-top">
          <h1 className="main-heading">Municipal Corporation Complaint System</h1>
          <div className="divider"></div>
          <h2 className="title">🏛️ Municipal Corporation</h2>
          <p className="subtitle">Civic Complaint Management System</p>
          <p className="desc">
            Report civic issues like roads, water supply, and waste management.
            Officers and administrators monitor and resolve complaints efficiently
            to improve public services.
          </p>
        </div>

        <div className="login-card">
          <div className="input-group">
            <label>Login as</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User / Resident</option>
              <option value="admin">Administrator</option>
              <option value="officer">Municipal Officer</option>
            </select>
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button className="login-btn" onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">🏛️ Municipal Portal</div>
        <div className="nav-right">
          <span className="role-badge">{role.toUpperCase()}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="main">

        {/* 🆕 Complaint form modal — shown when user clicks "Submit New" */}
        {showComplaintForm && (
          <ComplaintForm onClose={() => setShowComplaintForm(false)} />
        )}

        {role === "user" && (
          <>
            <h2 className="section-title">User Dashboard</h2>
            <div className="grid">
              <div className="card">
                <h3>📋 My Complaints</h3>
                <p>Track status of your complaints</p>
                <button className="small-btn">View Status</button>
              </div>
              <div className="card">
                <h3>➕ New Complaint</h3>
                <p>Report a civic issue in your area</p>
                {/* 🆕 This button now opens the form */}
                <button className="small-btn primary" onClick={() => setShowComplaintForm(true)}>
                  Submit New
                </button>
              </div>
              <div className="card">
                <h3>📍 Nearby Issues</h3>
                <p>View complaints near your location</p>
                <button className="small-btn">Open Map</button>
              </div>
            </div>
          </>
        )}

        {role === "admin" && (
          <>
            <h2 className="section-title">Administrator Panel</h2>
            <div className="grid">
              <div className="card">
                <h3>📊 All Complaints</h3>
                <p>Monitor all system-wide complaints</p>
                <button className="small-btn">Review All</button>
              </div>
              <div className="card">
                <h3>👥 Manage Users</h3>
                <p>Control staff and user accounts</p>
                <button className="small-btn">Manage</button>
              </div>
              <div className="card">
                <h3>⚙️ Settings</h3>
                <p>System configuration & logs</p>
                <button className="small-btn">Open Settings</button>
              </div>
            </div>
          </>
        )}

        {role === "officer" && (
          <>
            <h2 className="section-title">Officer Dashboard</h2>
            <div className="grid">
              <div className="card">
                <h3>📌 Assigned Complaints</h3>
                <p>Check your active assigned tasks</p>
                <button className="small-btn">View Tasks</button>
              </div>
              <div className="card">
                <h3>✅ Resolve Issues</h3>
                <p>Update complaint status and photos</p>
                <button className="small-btn">Update Work</button>
              </div>
              <div className="card">
                <h3>📈 Work Report</h3>
                <p>View monthly performance report</p>
                <button className="small-btn">Download PDF</button>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}