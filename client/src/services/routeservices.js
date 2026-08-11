// ============================================================
// DISHA — DEMO ROUTE SERVICE
// ============================================================
// Temporary demo version.
//
// No Google Maps.
// No GPS.
// No backend.
//
// Whatever destination the user enters,
// Disha returns static routes so the complete
// journey flow can be demonstrated.
// ============================================================

const createDemoRoutes = (destination) => {
  const cleanDestination =
    destination?.trim() || "Your destination";

  return [
    {
      routeId: "demo-route-1",
      id: "demo-route-1",

      name: "Safer route",

      destination: cleanDestination,

      travelMode: "WALKING",

      distanceKm: 3.2,
      durationMinutes: 18,

      safetyScore: 91,

      safetyLevel: "High",

      routeType: "Recommended",

      encodedPolyline: "",

      routeLabels: ["RECOMMENDED"],

      safetyReasons: [
        "More active streets",
        "Better access to help",
        "Shorter walking time",
      ],

      activityScore: 88,
      helpScore: 92,
      incidentScore: 93,

      origin: {
        latitude: 18.5204,
        longitude: 73.8567,
      },
    },

    {
      routeId: "demo-route-2",
      id: "demo-route-2",

      name: "Alternative route",

      destination: cleanDestination,

      travelMode: "WALKING",

      distanceKm: 2.7,
      durationMinutes: 15,

      safetyScore: 76,

      safetyLevel: "Moderate",

      routeType: "Fastest",

      encodedPolyline: "",

      routeLabels: ["FASTEST"],

      safetyReasons: [
        "Shorter distance",
        "Fewer active areas",
        "Limited nearby assistance",
      ],

      activityScore: 71,
      helpScore: 68,
      incidentScore: 89,

      origin: {
        latitude: 18.5204,
        longitude: 73.8567,
      },
    },
  ];
};


// ============================================================
// GET ROUTES
// ============================================================

export const getRoutes = async ({
  destination,
}) => {
  console.log(
    "🗺️ DISHA DEMO: generating static routes for:",
    destination
  );

  return {
    success: true,

    routes: createDemoRoutes(
      destination
    ),
  };
};


// ============================================================
// GET SAFER ROUTES
// ============================================================

export const getSaferRoutes = async ({
  destination,
}) => {
  console.log(
    "🛡️ DISHA DEMO: generating safer routes for:",
    destination
  );

  const routes =
    createDemoRoutes(destination);

  return {
    success: true,

    routes: routes.sort(
      (a, b) =>
        b.safetyScore -
        a.safetyScore
    ),
  };
};