const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
const db = new sqlite3.Database("./complaints.db");

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  complaint_type TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// POST: Add complaint
app.post("/complaints", (req, res) => {
  const { name, email, phone, address, complaint_type, description } = req.body;

  const query = `
    INSERT INTO complaints (name, email, phone, address, complaint_type, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, phone, address, complaint_type, description], function(err) {
    if (err) return res.status(500).send(err.message);
    res.send({ message: "Complaint submitted", id: this.lastID });
  });
});

// GET: All complaints
app.get("/complaints", (req, res) => {
  db.all("SELECT * FROM complaints", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
// PUT: Update status
app.put("/complaints/:id", (req, res) => {
  const { status } = req.body;

  db.run(
    "UPDATE complaints SET status=? WHERE id=?",
    [status, req.params.id],
    function(err) {
      if (err) return res.status(500).send(err.message);
      res.send("Updated successfully");
    }
  );
});

// DELETE
app.delete("/complaints/:id", (req, res) => {
  db.run("DELETE FROM complaints WHERE id=?", req.params.id, function(err) {
    if (err) return res.status(500).send(err.message);
    res.send("Deleted successfully");
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
