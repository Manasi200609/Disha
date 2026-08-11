import {
  apiPost,
} from "./api";

// ============================================================
// GET ALL ROUTES
// ============================================================

export async function getRoutes(request) {
  return apiPost(
    "/api/routes",
    request
  );
}


// ============================================================
// GET SAFER ROUTES
// ============================================================
//
// For now, the backend already performs the route analysis.
// We don't need a separate /routes/safer endpoint.
//
// Later, if we want a dedicated safety-ranking endpoint,
// we can add it without changing RouteSelection.jsx.
// ============================================================

export async function getSaferRoutes(request) {
  return apiPost(
    "/api/routes",
    {
      ...request,

      prioritizeSafety: true,
    }
  );
}