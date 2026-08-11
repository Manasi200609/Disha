import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import RouteCard from "../components/RouteCard";
import SaferRouteExplanation from "../components/SaferRouteExplanation";
import MapView from "../components/MapView";

import "./RouteSelection.css";


// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_LOCATION = {
  latitude: 18.5204,
  longitude: 73.8567,
  accuracy: 10,
};


// ============================================================
// NOMINATIM SEARCH
// ============================================================

async function searchDestination(
  destination
) {

  const query =
    destination.trim();


  if (!query) {
    throw new Error(
      "Please enter a destination."
    );
  }


  const params =
    new URLSearchParams({
      q: query,
      format: "jsonv2",
      addressdetails: "1",
      limit: "5",
      countrycodes: "in",
    });


  const response =
    await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Accept:
            "application/json",
        },
      }
    );


  if (!response.ok) {
    throw new Error(
      "Destination search failed."
    );
  }


  const results =
    await response.json();


  if (
    !results ||
    results.length === 0
  ) {
    throw new Error(
      "Destination not found. Try entering a more specific place name."
    );
  }


  // Prefer the first result returned
  const place =
    results[0];


  const latitude =
    Number(place.lat);

  const longitude =
    Number(place.lon);


  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    throw new Error(
      "The destination coordinates are invalid."
    );
  }


  return {
    name:
      place.display_name,

    latitude,

    longitude,

    type:
      place.type,

    osmId:
      place.osm_id,

    raw:
      place,
  };
}


// ============================================================
// OSRM ROUTING
// ============================================================

async function getWalkingRoutes(
  origin,
  destination
) {

  const originLat =
    Number(origin.latitude);

  const originLng =
    Number(origin.longitude);

  const destinationLat =
    Number(destination.latitude);

  const destinationLng =
    Number(destination.longitude);


  const coordinates =
    `${originLng},${originLat};${destinationLng},${destinationLat}`;


  const url =
    `https://router.project-osrm.org/route/v1/foot/${coordinates}` +
    `?alternatives=true` +
    `&steps=true` +
    `&overview=full` +
    `&geometries=geojson`;


  const response =
    await fetch(url);


  if (!response.ok) {
    throw new Error(
      "Walking route service is unavailable."
    );
  }


  const data =
    await response.json();


  if (
    data.code !== "Ok" ||
    !data.routes ||
    data.routes.length === 0
  ) {
    throw new Error(
      "No walking route could be found between these locations."
    );
  }


  return data.routes;
}


// ============================================================
// CONVERT OSRM ROUTE
// ============================================================

function convertOSRMRoute(
  route,
  index
) {

  const decodedPath =
    route.geometry.coordinates.map(
      ([longitude, latitude]) => ({
        latitude,
        longitude,
      })
    );


  const distanceKm =
    route.distance / 1000;


  const durationMinutes =
    route.duration / 60;


  return {
    routeId:
      `osrm-route-${index + 1}`,

    id:
      `osrm-route-${index + 1}`,

    travelMode:
      "WALKING",

    distanceKm:
      Number(distanceKm.toFixed(1)),

    durationMinutes:
      Math.max(
        1,
        Math.round(durationMinutes)
      ),

    decodedPath,

    // --------------------------------------------------------
    // Safety values
    // --------------------------------------------------------
    //
    // These are demo values for your hackathon UI.
    // Replace these later with your actual Disha
    // safety-analysis backend.
    //

    safetyScore:
      index === 0
        ? 91
        : Math.max(
            65,
            84 - index * 5
          ),

    activityScore:
      index === 0
        ? 92
        : 78,

    helpScore:
      index === 0
        ? 89
        : 74,

    incidentScore:
      index === 0
        ? 93
        : 81,

    routeLabels:
      index === 0
        ? [
            "SAFER",
            "RECOMMENDED",
          ]
        : [
            "ALTERNATIVE",
          ],

    assessment:
      index === 0
        ? {
            title:
              "Recommended safer route",

            description:
              "This route is currently prioritized by Disha based on its safety signals.",
          }
        : {
            title:
              "Alternative route",

            description:
              "This route is available as an alternative to the recommended route.",
          },

    aiResearch:
      index === 0
        ? {
            recentSignals: [
              "Good route accessibility",
              "Pedestrian-friendly path",
              "Recommended by Disha safety scoring",
            ],

            researchConfidence:
              "high",

            routeAssessment:
              "Disha recommends this route because it currently has the strongest safety score.",
          }
        : {
            recentSignals: [
              "Alternative walking path",
              "Available route option",
            ],

            researchConfidence:
              "medium",

            routeAssessment:
              "This route provides another walking option to the destination.",
          },

    // Keep original OSRM data
    rawRoute:
      route,
  };
}


// ============================================================
// COMPONENT
// ============================================================

function RouteSelection({
  darkMode,
  toggleDarkMode,
}) {

  const navigate =
    useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [
    destination,
    setDestination,
  ] = useState("");


  const [
    destinationLocation,
    setDestinationLocation,
  ] = useState(null);


  const [
    routes,
    setRoutes,
  ] = useState([]);


  const [
    selectedRoute,
    setSelectedRoute,
  ] = useState(null);


  const [
    loadingRoutes,
    setLoadingRoutes,
  ] = useState(false);


  const [
    routeError,
    setRouteError,
  ] = useState(null);


  const [
    saferOnly,
    setSaferOnly,
  ] = useState(true);


  // ==========================================================
  // START LOCATION
  // ==========================================================

  const location =
    DEFAULT_LOCATION;


  // ==========================================================
  // SEARCH ROUTES
  // ==========================================================

  const handleSearchRoutes =
    async (event) => {

      event?.preventDefault();


      setRouteError(null);

      setRoutes([]);

      setSelectedRoute(null);

      setDestinationLocation(null);


      const trimmedDestination =
        destination.trim();


      if (!trimmedDestination) {

        setRouteError(
          "Please enter a destination."
        );

        return;
      }


      setLoadingRoutes(true);


      try {

        // ----------------------------------------------------
        // STEP 1 — GEOCODE DESTINATION
        // ----------------------------------------------------

        console.log(
          "🔎 Searching destination:",
          trimmedDestination
        );


        const foundDestination =
          await searchDestination(
            trimmedDestination
          );


        console.log(
          "📍 Destination found:",
          foundDestination
        );


        setDestinationLocation(
          foundDestination
        );


        // ----------------------------------------------------
        // STEP 2 — GET REAL WALKING ROUTES
        // ----------------------------------------------------

        console.log(
          "🚶 Finding walking routes..."
        );


        const osrmRoutes =
          await getWalkingRoutes(
            location,
            foundDestination
          );


        console.log(
          "🗺️ OSRM routes:",
          osrmRoutes
        );


        // ----------------------------------------------------
        // STEP 3 — CONVERT ROUTES
        // ----------------------------------------------------

        let convertedRoutes =
          osrmRoutes.map(
            convertOSRMRoute
          );


        // ----------------------------------------------------
        // SAFER ROUTES
        // ----------------------------------------------------

        if (saferOnly) {

          convertedRoutes =
            convertedRoutes.sort(
              (a, b) =>
                b.safetyScore -
                a.safetyScore
            );

        }


        if (
          convertedRoutes.length === 0
        ) {

          throw new Error(
            "No routes were found."
          );

        }


        // ----------------------------------------------------
        // ADD DESTINATION TO EACH ROUTE
        // ----------------------------------------------------

        convertedRoutes =
          convertedRoutes.map(
            (route) => ({
              ...route,

              destination:
                foundDestination.name,

              destinationLocation:
                foundDestination,
            })
          );


        setRoutes(
          convertedRoutes
        );


        // ----------------------------------------------------
        // AUTO SELECT FIRST ROUTE
        // ----------------------------------------------------

        setSelectedRoute(
          convertedRoutes[0]
        );


        console.log(
          "✅ Routes loaded:",
          convertedRoutes
        );

      } catch (error) {

        console.error(
          "❌ Destination / routing failed:",
          error
        );


        setRouteError(
          error?.message ||
            "Unable to find a route. Please try again."
        );

      } finally {

        setLoadingRoutes(false);

      }
    };


  // ==========================================================
  // SELECT ROUTE
  // ==========================================================

  const handleSelectRoute =
    (route) => {

      setSelectedRoute(
        route
      );

      setRouteError(null);
    };


  // ==========================================================
  // START SAFE JOURNEY
  // ==========================================================

  const handleStartJourney =
    () => {

      if (!selectedRoute) {

        setRouteError(
          "Please select a route first."
        );

        return;
      }


      const journey = {

        id:
          `journey-${Date.now()}`,

        destination:
          destination.trim(),

        destinationLocation:
          destinationLocation,

        route:
          selectedRoute,

        origin:
          location,

        startedAt:
          new Date().toISOString(),
      };


      localStorage.setItem(
        "disha_active_journey",
        JSON.stringify(journey)
      );


      console.log(
        "✅ SAFE JOURNEY STARTED",
        journey
      );


      navigate(
        `/journey/${journey.id}`
      );
    };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <main
      className="route-selection-page"
    >

      {/* ====================================================
          NAVBAR
      ==================================================== */}

      <Navbar
        darkMode={darkMode}
        toggleDarkMode={
          toggleDarkMode
        }
      />


      <section
        className="route-selection-content"
      >

        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="route-selection-header"
        >

          <button
            type="button"
            className="route-back-button"
            onClick={() =>
              navigate(-1)
            }
          >
            ←
          </button>


          <div>

            <span
              className="route-eyebrow"
            >
              PLAN YOUR JOURNEY
            </span>


            <h1>

              Where are you

              <em>
                {" "}going?
              </em>

            </h1>

          </div>

        </div>


        {/* ==================================================
            LOCATION STATUS
        ================================================== */}

        <div
          className="location-status location-status-ready"
        >

          <span
            className="location-status-dot"
          />


          <div>

            <strong>
              Starting point ready
            </strong>


            <small>
              Pune • OpenStreetMap
              routing
            </small>

          </div>

        </div>


        {/* ==================================================
            DESTINATION FORM
        ================================================== */}

        <form
          className="destination-form"
          onSubmit={
            handleSearchRoutes
          }
        >

          <label
            htmlFor="destination"
          >
            Destination
          </label>


          <div
            className="destination-input-wrapper"
          >

            <span
              className="destination-icon"
            >
              ◎
            </span>


            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(event) => {

                setDestination(
                  event.target.value
                );

                // Clear old selected place
                setDestinationLocation(
                  null
                );

              }}
              placeholder="Enter a place, address or landmark"
              autoComplete="off"
            />


            {destination && (

              <button
                type="button"
                className="clear-destination"
                onClick={() => {

                  setDestination("");

                  setRoutes([]);

                  setSelectedRoute(
                    null
                  );

                  setDestinationLocation(
                    null
                  );

                  setRouteError(
                    null
                  );

                }}
                aria-label="Clear destination"
              >
                ×
              </button>

            )}

          </div>


          {/* =================================================
              DESTINATION SELECTED
          ================================================= */}

          {destinationLocation && (

            <div
              className="destination-confirmed"
            >

              <span>
                ✓
              </span>


              <div>

                <strong>
                  Destination found
                </strong>


                <small>
                  {
                    destinationLocation.name
                  }
                </small>

              </div>

            </div>

          )}


          {/* =================================================
              SAFER ROUTES TOGGLE
          ================================================= */}

          <div
            className="safer-routes-toggle"
          >

            <div>

              <strong>
                Prioritize safer routes
              </strong>


              <small>
                Disha compares available
                routes using safety signals.
              </small>

            </div>


            <button
              type="button"
              className={`toggle ${
                saferOnly
                  ? "toggle-active"
                  : ""
              }`}
              onClick={() =>
                setSaferOnly(
                  (previous) =>
                    !previous
                )
              }
              aria-label="Toggle safer routes"
              aria-pressed={
                saferOnly
              }
            >

              <span />

            </button>

          </div>


          {/* =================================================
              FIND ROUTES
          ================================================= */}

          <button
            type="submit"
            className="find-routes-button"
            disabled={
              loadingRoutes
            }
          >

            {loadingRoutes ? (

              <>

                <span
                  className="route-spinner"
                />

                Finding safer routes...

              </>

            ) : (

              <>

                Find routes

                <span>
                  →
                </span>

              </>

            )}

          </button>

        </form>


        {/* ==================================================
            ERROR
        ================================================== */}

        {routeError && (

          <div
            className="route-error"
          >

            <span>
              !
            </span>


            <p>
              {routeError}
            </p>

          </div>

        )}


        {/* ==================================================
            ROUTE RESULTS
        ================================================== */}

        {routes.length > 0 && (

          <section
            className="routes-results"
          >

            {/* ==============================================
                MAP
            ============================================== */}

            <MapView
              location={location}

              destinationLocation={
                destinationLocation
              }

              routes={routes}

              selectedRoute={
                selectedRoute
              }

              onSelectRoute={
                handleSelectRoute
              }
            />


            {/* ==============================================
                DESTINATION DETAILS
            ============================================== */}

            {destinationLocation && (

              <div
                className="destination-map-info"
              >

                <span>
                  DESTINATION
                </span>


                <strong>
                  {
                    destinationLocation.name
                  }
                </strong>

              </div>

            )}


            {/* ==============================================
                RESULTS HEADER
            ============================================== */}

            <div
              className="routes-results-header"
            >

              <div>

                <span>
                  ROUTE OPTIONS
                </span>


                <h2>
                  Choose your route
                </h2>

              </div>


              <small>
                {routes.length}{" "}
                options
              </small>

            </div>


            {/* ==============================================
                ROUTE LIST
            ============================================== */}

            <div
              className="routes-list"
            >

              {routes.map(
                (route) => {

                  const routeKey =
                    route.routeId ||
                    route.id;


                  const isSelected =
                    selectedRoute &&
                    (
                      selectedRoute.routeId ===
                        route.routeId ||
                      selectedRoute.id ===
                        route.id
                    );


                  return (

                    <div
                      key={routeKey}
                    >

                      <RouteCard
                        route={route}
                        selected={
                          isSelected
                        }
                        onSelect={
                          handleSelectRoute
                        }
                      />


                      {isSelected && (

                        <SaferRouteExplanation
                          route={route}
                        />

                      )}

                    </div>

                  );

                }
              )}

            </div>


            {/* ==============================================
                START JOURNEY
            ============================================== */}

            <button
              type="button"
              className="start-route-button"
              disabled={
                !selectedRoute
              }
              onClick={
                handleStartJourney
              }
            >

              <span>
                Start Safe Journey
              </span>


              <span>
                →
              </span>

            </button>

          </section>

        )}


        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loadingRoutes &&
          routes.length === 0 &&
          !routeError && (

            <div
              className="route-empty-state"
            >

              <div
                className="route-empty-icon"
              >
                ⌖
              </div>


              <h3>
                Your route will appear here
              </h3>


              <p>
                Enter a destination and
                Disha will find actual
                walking routes for you.
              </p>

            </div>

          )}

      </section>

    </main>
  );
}


export default RouteSelection;