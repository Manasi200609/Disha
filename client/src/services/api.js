// ============================================================
// DISHA API SERVICE
// ============================================================

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// ============================================================
// COMMON REQUEST
// ============================================================

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

// ============================================================
// GET
// ============================================================

export async function apiGet(endpoint) {
  return request(endpoint, {
    method: "GET",
  });
}

// ============================================================
// POST
// ============================================================

export async function apiPost(endpoint, body = {}) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ============================================================
// PUT
// ============================================================

export async function apiPut(endpoint, body = {}) {
  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

// ============================================================
// PATCH
// ============================================================

export async function apiPatch(endpoint, body = {}) {
  return request(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

// ============================================================
// DELETE
// ============================================================

export async function apiDelete(endpoint) {
  return request(endpoint, {
    method: "DELETE",
  });
}

// ============================================================
// GENERIC FETCH
// ============================================================

export async function apiFetch(endpoint, options = {}) {
  return request(endpoint, options);
}