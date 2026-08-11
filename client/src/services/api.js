const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


// ============================================================
// COMMON REQUEST
// ============================================================

async function request(
  endpoint,
  options = {}
) {

  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    }
  );


  const contentType =
    response.headers.get(
      "content-type"
    );


  const data =
    contentType?.includes("application/json")
      ? await response.json()
      : await response.text();


  if (!response.ok) {

    const message =
      typeof data === "object"
        ? data.message
        : data;

    throw new Error(
      message ||
      `Request failed: ${response.status}`
    );

  }


  return data;
}


// ============================================================
// GET
// ============================================================

export function apiGet(
  endpoint
) {

  return request(
    endpoint,
    {
      method: "GET"
    }
  );

}


// ============================================================
// POST
// ============================================================

export function apiPost(
  endpoint,
  body
) {

  return request(
    endpoint,
    {
      method: "POST",

      body:
        JSON.stringify(body)
    }
  );

}


// ============================================================
// PATCH
// ============================================================

export function apiPatch(
  endpoint,
  body
) {

  return request(
    endpoint,
    {
      method: "PATCH",

      body:
        JSON.stringify(body)
    }
  );

}


// ============================================================
// PUT
// ============================================================

export function apiPut(
  endpoint,
  body
) {

  return request(
    endpoint,
    {
      method: "PUT",

      body:
        JSON.stringify(body)
    }
  );

}


// ============================================================
// DELETE
// ============================================================

export function apiDelete(
  endpoint
) {

  return request(
    endpoint,
    {
      method: "DELETE"
    }
  );

}


// ============================================================
// ROUTE SEARCH
// ============================================================

export function findRoutes(
  currentLocation,
  destination
) {

  return apiPost(
    "/api/routes",
    {
      currentLocation,
      destination
    }
  );

}