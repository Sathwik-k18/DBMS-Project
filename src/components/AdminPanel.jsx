import { useEffect, useState } from "react";
import {
  fetchComplaints, resolveComplaint, deleteComplaint,
  assignEngineer, fetchEngineers, addEngineer, deleteEngineer
} from "../utils/api";

export default function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedEngineer, setSelectedEngineer] = useState({});
  const [newOfficer, setNewOfficer] = useState({ name: "", email: "", specialization: "" });
  const [showOfficerForm, setShowOfficerForm] = useState(false);

  const loadComplaints = async () => {
    const data = await fetchComplaints();
    setComplaints(data);
    setLoading(false);
  };

  const loadOfficers = async () => {
  const data = await fetchEngineers();
  setOfficers(Array.isArray(data) ? data : []);
};

  useEffect(() => {
    loadComplaints();
    loadOfficers();
  }, []);

  const handleResolve = async (id) => {
    const note = prompt("Enter resolution note (optional):") || "Resolved by admin";
    await resolveComplaint(id, note);
    loadComplaints();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this complaint?")) {
      await deleteComplaint(id);
      loadComplaints();
    }
  };

  const handleAssign = async (id) => {
    const officerEmail = selectedEngineer[id];
    if (!officerEmail) {
      alert("Please select an officer first.");
      return;
    }
    await assignEngineer(id, officerEmail);
    loadComplaints();
  };

  const handleAddOfficer = async (e) => {
    e.preventDefault();
    if (!newOfficer.email) {
      alert("Officer email is required.");
      return;
    }
    const result = await addEngineer(newOfficer);
    if (result.error) { alert("❌ " + result.error); return; }
    setNewOfficer({ name: "", email: "", specialization: "" });
    setShowOfficerForm(false);
    loadOfficers();
  };

  const handleDeleteOfficer = async (id) => {
    if (window.confirm("Remove this officer?")) {
      await deleteEngineer(id);
      loadOfficers();
    }
  };

  const filtered = filter === "all"
    ? complaints
    : complaints.filter(c => c.status === filter);

  if (loading) return <p>Loading...</p>;

  return (
    <div>

      {/* Stats */}
      <div className="grid" style={{ marginBottom: "20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "#1b5e20" }}>{complaints.length}</h3>
          <p>Total</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "#f57f17" }}>{complaints.filter(c => c.status === "pending").length}</h3>
          <p>Pending</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "#2e7d32" }}>{complaints.filter(c => c.status === "resolved").length}</h3>
          <p>Resolved</p>
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h3 style={{ color: "#1565c0" }}>{complaints.filter(c => c.engineer_status === "assigned").length}</h3>
          <p>Assigned</p>
        </div>
      </div>

      {/* Officer Management */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, color: "#1b5e20" }}>👷 Officers ({officers.length})</h3>
          <button className="small-btn primary" onClick={() => setShowOfficerForm(!showOfficerForm)}>
            {showOfficerForm ? "Cancel" : "+ Add Officer"}
          </button>
        </div>

        {/* Add Officer Form */}
        {showOfficerForm && (
          <form onSubmit={handleAddOfficer}
            style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              placeholder="Officer Name *"
              value={newOfficer.name}
              onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
              required
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
            />
            <input
              placeholder="Officer Email *"
              type="email"
              value={newOfficer.email}
              onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
              required
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
            />
            <input
              placeholder="Specialization (e.g. Roads)"
              value={newOfficer.specialization}
              onChange={(e) => setNewOfficer({ ...newOfficer, specialization: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", flex: 1 }}
            />
            <button type="submit" className="small-btn primary">Save</button>
          </form>
        )}

        {/* Officers List */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "15px" }}>
          {officers.length === 0 ? (
            <p style={{ color: "#888", fontSize: "14px" }}>No officers added yet.</p>
          ) : (
            officers.map(o => (
              <div key={o.id} style={{
                background: "#f0f4f8", padding: "8px 14px",
                borderRadius: "20px", fontSize: "13px",
                display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span>👷 {o.name}</span>
                <span style={{ color: "#666" }}>({o.email})</span>
                {o.specialization && <span style={{ color: "#999" }}>— {o.specialization}</span>}
                <span style={{ color: "red", cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => handleDeleteOfficer(o.id)}>✕</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        {["all", "pending", "resolved"].map(f => (
          <button key={f} className="small-btn"
            style={{ background: filter === f ? "#1b5e20" : "#ccc", color: filter === f ? "white" : "#333" }}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Complaints Table */}
      {filtered.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "10px", overflow: "hidden" }}>
            <thead>
              <tr style={{ background: "#1b5e20", color: "white" }}>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Type</th>
                <th style={th}>Description</th>
                <th style={th}>Status</th>
                <th style={th}>Assigned Officer</th>
                <th style={th}>Engineer Status</th>
                <th style={th}>Assign</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={td}>{c.id}</td>
                  <td style={td}>{c.name}</td>
                  <td style={td}>{c.complaint_type}</td>
                  <td style={td}>{c.description}</td>

                  <td style={td}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                      background: c.status === "resolved" ? "#c8e6c9" : "#fff9c4",
                      color: c.status === "resolved" ? "#1b5e20" : "#f57f17"
                    }}>{c.status}</span>
                  </td>

                  {/* Show officer name from officers list */}
                  <td style={td}>
                    {c.assigned_engineer
                      ? officers.find(o => o.email === c.assigned_engineer)?.name || c.assigned_engineer
                      : "—"}
                  </td>

                  <td style={td}>
                    <span style={{
                      padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                      background: c.engineer_status === "assigned" ? "#bbdefb" : "#f5f5f5",
                      color: c.engineer_status === "assigned" ? "#1565c0" : "#888"
                    }}>{c.engineer_status}</span>
                  </td>

                  {/* Dropdown shows officer name but stores email */}
                  <td style={td}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <select
                        value={selectedEngineer[c.id] || ""}
                        onChange={(e) =>
                          setSelectedEngineer({ ...selectedEngineer, [c.id]: e.target.value })
                        }
                        style={{ padding: "4px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "12px" }}
                      >
                        <option value="">-- Select Officer --</option>
                        {officers.map(o => (
                          // value = email (stored in DB), label = name (shown in UI)
                          <option key={o.id} value={o.email}>{o.name}</option>
                        ))}
                      </select>
                      <button className="small-btn primary"
                        style={{ fontSize: "12px", padding: "4px 10px" }}
                        onClick={() => handleAssign(c.id)}>
                        Assign
                      </button>
                    </div>
                  </td>

                  <td style={td}>
                    {c.status !== "resolved" && (
                      <button className="small-btn primary"
                        style={{ marginRight: "6px", fontSize: "12px", padding: "4px 10px" }}
                        onClick={() => handleResolve(c.id)}>
                        ✅ Resolve
                      </button>
                    )}
                    <button className="small-btn"
                      style={{ fontSize: "12px", padding: "4px 10px", background: "#c62828", color: "white" }}
                      onClick={() => handleDelete(c.id)}>
                      🗑️ Delete
                    </button>
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