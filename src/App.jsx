import { useState } from "react";
import "./styles.css";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignUpPage";
import OTPPage from "./components/OTPPage";
import ComplaintForm from "./components/ComplaintForm";
import AdminPanel from "./components/AdminPanel";
import OfficerDashboard from "./components/OfficerDashboard";
import MyComplaints from "./components/MyComplaints";

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [otpData, setOtpData] = useState({ email: "", name: "", otp: "", role: "" });
  const [showComplaintForm, setShowComplaintForm] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage("home");
  };

  const handleGoToOTP = (email, name, otp, role) => {
    setOtpData({ email, name, otp, role });
    setPage("otp");
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
    setShowComplaintForm(false);
  };

  if (page === "signup") {
    return <SignupPage onGoToOTP={handleGoToOTP} onGoToLogin={() => setPage("login")} />;
  }

  if (page === "otp") {
    return (
      <OTPPage
        email={otpData.email}
        otp={otpData.otp}
        role={otpData.role}
        onVerified={() => setPage("login")}
      />
    );
  }

  if (page === "login") {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onGoToSignup={() => setPage("signup")} />;
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="logo">🏛️ Municipal Portal</div>
        <div className="nav-right">
          <span style={{ color: "white", fontSize: "14px" }}>👤 {user?.name}</span>
          <span className="role-badge">{user?.role?.toUpperCase()}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="main">
        {showComplaintForm && (
          <ComplaintForm onClose={() => setShowComplaintForm(false)} user={user} />
        )}

        {/* USER */}
      {user?.role === "user" && (
  <>
    <h2 className="section-title">User Dashboard</h2>
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <div className="card" style={{ width: "250px" }}>
        <h3>➕ New Complaint</h3>
        <p>Report a civic issue in your area</p>
        <button className="small-btn primary" onClick={() => setShowComplaintForm(true)}>
          Submit New
        </button>
      </div>
    </div>
  </>
)}

        {/* ADMIN */}
        {user?.role === "admin" && (
          <>
            <h2 className="section-title">Administrator Panel</h2>
            <AdminPanel />
          </>
        )}

        {/* OFFICER — sees all complaints + their assigned ones */}
        {user?.role === "officer" && (
          <>
            <h2 className="section-title">Officer Dashboard</h2>
            <OfficerDashboard />

            <h2 className="section-title" style={{ marginTop: "30px" }}>
              📌 My Assigned Complaints
            </h2>
            <MyComplaints user={user} />
          </>
        )}

      </main>
    </div>
  );
}