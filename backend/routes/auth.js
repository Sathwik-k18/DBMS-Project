const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../database");

// ─────────────────────────────
// USER SIGNUP
// ─────────────────────────────
router.post("/signup/user", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (user) return res.status(400).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "User registered!", userId: this.lastID });
      }
    );
  });
});

// ─────────────────────────────
// ADMIN SIGNUP
// ─────────────────────────────
router.post("/signup/admin", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  db.get("SELECT * FROM admins WHERE email = ?", [email], async (err, admin) => {
    if (admin) return res.status(400).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role || "admin"],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Admin registered!", adminId: this.lastID });
      }
    );
  });
});

// ─────────────────────────────
// VERIFY USER ACCOUNT
// ─────────────────────────────
router.post("/verify-account/user", (req, res) => {
  const { email } = req.body;
  db.run("UPDATE users SET is_verified = 1 WHERE email = ?", [email], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User account verified!" });
  });
});

// ─────────────────────────────
// VERIFY ADMIN ACCOUNT
// ─────────────────────────────
router.post("/verify-account/admin", (req, res) => {
  const { email } = req.body;
  db.run("UPDATE admins SET is_verified = 1 WHERE email = ?", [email], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Admin account verified!" });
  });
});

// ─────────────────────────────
// USER LOGIN
// ─────────────────────────────
router.post("/login/user", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(400).json({ error: "Email not registered." });
    if (!user.is_verified) return res.status(400).json({ error: "Account not verified. Check your email for OTP." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password." });

    res.json({
      message: "Login successful!",
      user: { id: user.id, name: user.name, email: user.email, role: "user" },
    });
  });
});

// ─────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────
router.post("/login/admin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  db.get("SELECT * FROM admins WHERE email = ?", [email], async (err, admin) => {
    if (!admin) return res.status(400).json({ error: "Email not registered." });
    if (!admin.is_verified) return res.status(400).json({ error: "Account not verified. Check your email for OTP." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password." });

    res.json({
      message: "Login successful!",
      user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    });
  });
});

module.exports = router;