import { useState } from "react";
import { sendEmail } from "../utils/sendEmail";

export default function ComplaintForm({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", title: "", description: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Send confirmation email
    const result = await sendEmail({
      name: form.name,
      email: form.email,
      complaintTitle: form.title,
    });

    setStatus(result.success ? "success" : "error");
  };

  // Show success message after submission
  if (status === "success") {
    return (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3>✅ Complaint Submitted!</h3>
          <p>A confirmation email has been sent to <strong>{form.email}</strong>.</p>
          <button className="small-btn primary" onClick={onClose}>
            Back to Dashboard
          </button>
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
            <label>Your Name</label>
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Your Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Issue Title</label>
            <input
              name="title"
              placeholder="e.g. Broken road near park"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Describe the issue..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "5px", resize: "vertical" }}
              required
            />
          </div>

          {status === "error" && (
            <p style={{ color: "red", fontSize: "13px" }}>
              ❌ Email failed to send. Check console for details.
            </p>
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