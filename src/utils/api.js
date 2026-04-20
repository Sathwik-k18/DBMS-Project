const BASE_URL = "http://localhost:5000";

export const signupUser = async (data) => {
  const res = await fetch(`${BASE_URL}/signup/user`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const signupAdmin = async (data) => {
  const res = await fetch(`${BASE_URL}/signup/admin`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const verifyAccount = async (email, role) => {
  const endpoint = role === "user" ? "user" : "admin";
  const res = await fetch(`${BASE_URL}/verify-account/${endpoint}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login/user`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginAdmin = async (data) => {
  const res = await fetch(`${BASE_URL}/login/admin`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const submitComplaint = async (formData) => {
  const { name, email, phone, address, complaint_type, description } = formData;
  const res = await fetch(`${BASE_URL}/complaints`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, address, complaint_type, description }),
  });
  return res.json();
};

export const fetchComplaints = async () => {
  const res = await fetch(`${BASE_URL}/complaints`);
  return res.json();
};

// Fetch only complaints assigned to this officer
export const fetchMyComplaints = async (email) => {
  const res = await fetch(`${BASE_URL}/my-complaints?email=${encodeURIComponent(email)}`);
  return res.json();
};

export const assignEngineer = async (id, assigned_engineer) => {
  const res = await fetch(`${BASE_URL}/complaints/${id}/assign`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assigned_engineer }),
  });
  return res.json();
};

export const resolveComplaint = async (id, resolution_note) => {
  const res = await fetch(`${BASE_URL}/complaints/${id}/resolve`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resolution_note }),
  });
  return res.json();
};

export const deleteComplaint = async (id) => {
  const res = await fetch(`${BASE_URL}/complaints/${id}`, { method: "DELETE" });
  return res.json();
};

export const fetchEngineers = async () => {
  const res = await fetch(`${BASE_URL}/engineers`);
  return res.json();
};

export const addEngineer = async (data) => {
  const res = await fetch(`${BASE_URL}/engineers`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteEngineer = async (id) => {
  const res = await fetch(`${BASE_URL}/engineers/${id}`, { method: "DELETE" });
  return res.json();
};