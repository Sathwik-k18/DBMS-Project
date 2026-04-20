import { useState } from "react";
import { submitComplaint } from "../utils/api";
import { sendEmail } from "../utils/sendEmail";

export default function ComplaintForm({ onClose, user }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    complaint_type: "",
    description: "",
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const result = await submitComplaint(form);

      if (result.error) {
        alert("❌ " + result.error);
        setStatus(null);
        return;
      }

      await sendEmail({
        name: form.name,
        email: form.email,
        complaintTitle: form.complaint_type,
      });

      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>✅ Complaint Submitted!</h3>
          <p>Saved and confirmation email sent to <strong>{form.email}</strong>.</p>
          <button className="small-btn primary" onClick={onClose}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>➕ Submit New Complaint</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Address</label>
            <input name="address" placeholder="Your area" value={form.address} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Complaint Type *</label>
            <select name="complaint_type" value={form.complaint_type} onChange={handleChange} required>
              <option value="">-- Select Type --</option>
              <option value="Road">Road</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Waste Management">Waste Management</option>
              <option value="Street Light">Street Light</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="input-group">
            <label>Description *</label>
            <textarea
              name="description"
              placeholder="Describe the issue..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px", resize: "vertical", boxSizing: "border-box" }}
              required
            />
          </div>

          {status === "error" && (
            <p style={{ color: "red", fontSize: "13px" }}>❌ Submission failed. Is backend running?</p>
          )}

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button type="submit" className="small-btn primary" disabled={status === "sending"}>
              {status === "sending" ? "Submitting..." : "Submit Complaint"}
            </button>
            <button type="button" className="small-btn" onClick={onClose}
              style={{ background: "#ccc", color: "#333" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}