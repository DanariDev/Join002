const API_BASE = "/api/index.php";
const TOKEN_KEY = "join_token";
const USER_KEY = "join_user";

export function setAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "request_failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  login: (email, password) => request("POST", "/auth/login", { email, password }),
  register: (name, email, password) => request("POST", "/auth/register", { name, email, password }),
  guest: () => request("POST", "/auth/guest"),
  me: () => request("GET", "/auth/me"),
  logout: () => request("POST", "/auth/logout"),

  getContacts: () => request("GET", "/contacts"),
  createContact: (payload) => request("POST", "/contacts", payload),
  updateContact: (id, payload) => request("PUT", `/contacts/${id}`, payload),
  deleteContact: (id) => request("DELETE", `/contacts/${id}`),

  getTasks: () => request("GET", "/tasks"),
  createTask: (payload) => request("POST", "/tasks", payload),
  updateTask: (id, payload) => request("PUT", `/tasks/${id}`, payload),
  deleteTask: (id) => request("DELETE", `/tasks/${id}`)
};
