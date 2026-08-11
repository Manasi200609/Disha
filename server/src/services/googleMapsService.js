import "dotenv/config";

const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY;


// ============================================================
// GEOCODE DESTINATION
// ============================================================

const geocodeDestination = async (destination) => {

  if (!destination || !destination.trim()) {
    throw new Error("Destination is required.");
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is missing from .env"
    );
  }

  console.log(
    "📍 Geocoding:",
    destination
  );

  const params = new URLSearchParams({
    address: destination.trim(),
    key: GOOGLE_MAPS_API_KEY
  });

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${params}`
  );

  if (!response.ok) {
    throw new Error(
      `Google Geocoding HTTP ${response.status}`
    );
  }

  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(
      `Google Geocoding failed: ${data.status}`
    );
  }

  const result = data.results?.[0];

  if (!result) {
    throw new Error(
      "Destination could not be found."
    );
  }

  const location =
    result.geometry.location;

  return {
    latitude: location.lat,
    longitude: location.lng,
    label:
      result.formatted_address ||
      destination
  };
};


// ============================================================
// GET CANDIDATE ROUTES
// ============================================================

const getCandidateRoutes = async ({
  start,
  destination
}) => {

  if (!start) {
    throw new Error(
      "Starting location is required."
    );
  }

  if (!destination) {
    throw new Error(
      "Destination coordinates are required."
    );
  }

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is missing from .env"
    );
  }

  console.log(
    "🗺️ Requesting Google routes..."
  );

  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        "X-Goog-Api-Key":
          GOOGLE_MAPS_API_KEY,

        "X-Goog-FieldMask": [
          "routes.distanceMeters",
          "routes.duration",
          "routes.polyline.encodedPolyline",
          "routes.routeLabels"
        ].join(",")
      },

      body: JSON.stringify({

        origin: {
          location: {
            latLng: {
              latitude:
                start.latitude,

              longitude:
                start.longitude
            }
          }
        },

        destination: {
          location: {
            latLng: {
              latitude:
                destination.latitude,

              longitude:
                destination.longitude
            }
          }
        },

        travelMode: "WALK",

        computeAlternativeRoutes: true,

        languageCode: "en-US",

        units: "METRIC"

      })
    }
  );


  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      `Google Routes HTTP ${response.status}: ${errorText}`
    );
  }


  const data =
    await response.json();


  const routes =
    data.routes || [];


  console.log(
    `✅ ${routes.length} route(s) received`
  );


  return routes
    .slice(0, 3)
    .map((route, index) => {

      const durationString =
        route.duration || "0s";

      const durationSeconds =
        parseInt(
          durationString.replace("s", ""),
          10
        ) || 0;


      return {

        routeId:
          `route-${index + 1}`,

        distanceKm:
          Number(
            (
              (route.distanceMeters || 0) /
              1000
            ).toFixed(2)
          ),

        durationMinutes:
          Math.max(
            1,
            Math.round(
              durationSeconds / 60
            )
          ),

        encodedPolyline:
          route.polyline
            ?.encodedPolyline || "",

        routeLabels:
          route.routeLabels || []

      };

    });

};


export {
  geocodeDestination,
  getCandidateRoutes
};