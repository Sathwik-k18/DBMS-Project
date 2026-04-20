const express = require("express");
const cors = require("cors");
const db = require("./database");
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRoutes);

// GET all complaints
app.get("/complaints", (req, res) => {
  const sql = `
    SELECT c.*,
      ac.status as admin_status,
      ac.resolution_note,
      ac.resolved_at,
      a.name as assigned_to
    FROM complaints c
    LEFT JOIN admin_complaints ac ON c.id = ac.complaint_id
    LEFT JOIN admins a ON ac.admin_id = a.id
    ORDER BY c.created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET complaints assigned to a specific officer
app.get("/my-complaints", (req, res) => {
  const { email } = req.query;

  if (!email)
    return res.status(400).json({ error: "Officer email is required." });

  db.all(
    "SELECT * FROM complaints WHERE assigned_engineer = ? ORDER BY created_at DESC",
    [email],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// POST new complaint
app.post("/complaints", (req, res) => {
  const { name, email, phone, address, complaint_type, description } = req.body;

  if (!name || !email || !complaint_type || !description)
    return res.status(400).json({ error: "Required fields missing." });

  const sql = `
    INSERT INTO complaints (name, email, phone, address, complaint_type, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, phone, address, complaint_type, description], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    db.run(
      "INSERT INTO admin_complaints (complaint_id, admin_id, status) VALUES (?, ?, 'pending')",
      [this.lastID, 1]
    );

    res.status(201).json({ message: "Complaint submitted!", id: this.lastID });
  });
});

// PUT assign engineer (stores officer email)
app.put("/complaints/:id/assign", (req, res) => {
  const { assigned_engineer } = req.body;

  if (!assigned_engineer)
    return res.status(400).json({ error: "Engineer email is required." });

  db.run(
    `UPDATE complaints 
     SET assigned_engineer = ?, engineer_status = 'assigned' 
     WHERE id = ?`,
    [assigned_engineer, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: `Complaint assigned to ${assigned_engineer}` });
    }
  );
});

// PUT resolve complaint
app.put("/complaints/:id/resolve", (req, res) => {
  const { resolution_note } = req.body;
  const now = new Date().toISOString();

  db.run(
    `UPDATE admin_complaints 
     SET status = 'resolved', resolution_note = ?, resolved_at = ?
     WHERE complaint_id = ?`,
    [resolution_note || "Resolved by admin", now, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      db.run("UPDATE complaints SET status = 'resolved' WHERE id = ?", [req.params.id]);
      res.json({ message: "Complaint resolved!" });
    }
  );
});

// DELETE complaint
app.delete("/complaints/:id", (req, res) => {
  db.run("DELETE FROM admin_complaints WHERE complaint_id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.run("DELETE FROM complaints WHERE id = ?", [req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Complaint deleted!" });
    });
  });
});

// GET all engineers
app.get("/engineers", (req, res) => {
  db.all("SELECT * FROM engineers ORDER BY name ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST add engineer
app.post("/engineers", (req, res) => {
  const { name, email, specialization, phone } = req.body;
  if (!name) return res.status(400).json({ error: "Engineer name is required." });

  db.run(
    "INSERT INTO engineers (name, email, specialization, phone) VALUES (?, ?, ?, ?)",
    [name, email || null, specialization || "", phone || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Engineer added!", id: this.lastID });
    }
  );
});

// DELETE engineer
app.delete("/engineers/:id", (req, res) => {
  db.run("DELETE FROM engineers WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Engineer deleted!" });
  });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));