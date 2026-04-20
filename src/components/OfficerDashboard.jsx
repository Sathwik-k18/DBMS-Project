import { useEffect, useState } from "react";
import { fetchComplaints } from "../utils/api";

export default function OfficerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | pending | resolved | assigned | not assigned

  const loadComplaints = async () => {
    const data = await fetchComplaints();
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => { loadComplaints(); }, []);

  // Filter logic
  const filtered = complaints.filter((c) => {
    if (filter === "all") return true;
    if (filter === "pending") return c.status === "pending";
    if (filter === "resolved") return c.status === "resolved";
    if (filter === "assigned") return c.engineer_status === "assigned";
    if (filter === "not assigned") return c.engineer_status === "not assigned";
    return true;
  });

  if (loading) return <p style={{ padding: "20px" }}>Loading complaints...</p>;

  return (
    <div>

      {/* Stats Row */}
      <div className="grid" style={{ marginBottom: "20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "#1b5e20" }}>{complaints.length}</h3>
          <p>Total Complaints</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "#f57f17" }}>
            {complaints.filter(c => c.status === "pending").length}
          </h3>
          <p>Pending</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "#2e7d32" }}>
            {complaints.filter(c => c.status === "resolved").length}
          </h3>
          <p>Resolved</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "#1565c0" }}>
            {complaints.filter(c => c.engineer_status === "assigned").length}
          </h3>
          <p>Assigned</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" }}>
        {["all", "pending", "resolved", "assigned", "not assigned"].map(f => (
          <button
            key={f}
            className="small-btn"
            style={{
              background: filter === f ? "#1b5e20" : "#ccc",
              color: filter === f ? "white" : "#333",
            }}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Complaints Count */}
      <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
        Showing {filtered.length} complaint{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "#888" }}>No complaints found for this filter.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            fontSize: "14px",
          }}>
            <thead>
              <tr style={{ background: "#1b5e20", color: "white" }}>
                <th style={th}>ID</th>
                <th style={th}>Citizen Name</th>
                <th style={th}>Email</th>
                <th style={th}>Complaint Type</th>
                <th style={th}>Description</th>
                <th style={th}>Complaint Status</th>
                <th style={th}>Assigned Engineer</th>
                <th style={th}>Engineer Status</th>
                <th style={th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>

                  <td style={td}>{c.id}</td>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{c.email}</td>
                  <td style={td}>{c.complaint_type}</td>
                  <td style={td}>{c.description}</td>

                  {/* Complaint Status Badge */}
                  <td style={td}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      background: c.status === "resolved" ? "#c8e6c9" : "#fff9c4",
                      color: c.status === "resolved" ? "#1b5e20" : "#f57f17",
                    }}>
                      {c.status}
                    </span>
                  </td>

                  {/* Assigned Engineer */}
                  <td style={td}>
                    {c.assigned_engineer ? c.assigned_engineer : (
                      <span style={{ color: "#aaa", fontStyle: "italic" }}>Not Assigned</span>
                    )}
                  </td>

                  {/* Engineer Status Badge */}
                  <td style={td}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      background: c.engineer_status === "assigned" ? "#bbdefb" : "#f5f5f5",
                      color: c.engineer_status === "assigned" ? "#1565c0" : "#888",
                    }}>
                      {c.engineer_status || "not assigned"}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={td}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = { padding: "12px 15px", textAlign: "left", fontWeight: "500" };
const td = { padding: "10px 15px", fontSize: "14px" };