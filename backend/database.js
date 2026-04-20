const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./complaints.db", (err) => {
  if (err) console.error("DB connection error:", err);
  else console.log("✅ Connected to SQLite database");
});

// Table 1 — Users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Table 2 — Admins
db.run(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Table 3 — Complaints (with engineer fields)
db.run(`
  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    complaint_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    assigned_engineer TEXT DEFAULT NULL,
    engineer_status TEXT DEFAULT 'not assigned',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Table 4 — Admin complaint tracking
db.run(`
  CREATE TABLE IF NOT EXISTS admin_complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    complaint_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    resolution_note TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    FOREIGN KEY (admin_id) REFERENCES admins(id)
  )
`);

// Table 5 — Engineers
db.run(`
  CREATE TABLE IF NOT EXISTS engineers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    specialization TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;