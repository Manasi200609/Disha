import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import RouteCard from "../components/RouteCard";
import SaferRouteExplanation from "../components/SaferRouteExplanation";
import MapView from "../components/MapView";
import decodePolyline from "../utils/decodePolyline";
import useLocation from "../hooks/useLocation";

import {
  getRoutes,
  getSaferRoutes,
} from "../services/routeServices";

import {
  startJourney,
} from "../services/journeyServices";

import "./RouteSelection.css";

function RouteSelection({
  darkMode,
  toggleDarkMode,
}) {
  const navigate = useNavigate();

  // =====================================================
  // LOCATION
  // =====================================================

  const {
    location,
    loading: locationLoading,
    error: locationError,
    getLocation,
  } = useLocation();

  // =====================================================
  // STATE
  // =====================================================

  const [destination, setDestination] = useState("");

  const [routes, setRoutes] = useState([]);

  const [selectedRoute, setSelectedRoute] = useState(null);

  const [loadingRoutes, setLoadingRoutes] = useState(false);

  const [routeError, setRouteError] = useState(null);

  const [saferOnly, setSaferOnly] = useState(true);

  // =====================================================
  // GET USER LOCATION
  // =====================================================

  useEffect(() => {
    if (!location) {
      getLocation().catch(() => {});
    }
  }, [location, getLocation]);

  // =====================================================
  // SEARCH ROUTES
  // =====================================================

  const handleSearchRoutes = async (event) => {
    event?.preventDefault();

    setRouteError(null);
    setSelectedRoute(null);

    if (!destination.trim()) {
      setRouteError("Please enter a destination.");
      return;
    }

    if (!location) {
      setRouteError(
        "We need your current location first."
      );

      try {
        await getLocation();
      } catch {
        return;
      }

      return;
    }

    setLoadingRoutes(true);

    try {
      const request = {
        origin: {
          latitude: location.latitude,
          longitude: location.longitude,
        },

        destination: destination.trim(),

        travelMode: "WALKING",
      };

      const response = saferOnly
        ? await getSaferRoutes(request)
        : await getRoutes(request);

      const receivedRoutes =
        response?.routes ||
        response?.data?.routes ||
        response?.data ||
        [];

      // =================================================
      // DECODE GOOGLE POLYLINES
      // =================================================

      const processedRoutes = Array.isArray(receivedRoutes)
        ? receivedRoutes.map((route) => ({
            ...route,

            decodedPath: decodePolyline(
              route.encodedPolyline
            ),
          }))
        : [];

      setRoutes(processedRoutes);
    } catch (error) {
      console.error(
        "Route search failed:",
        error
      );

      setRouteError(
        error.message ||
          "Unable to find routes right now."
      );
    } finally {
      setLoadingRoutes(false);
    }
  };

  // =====================================================
  // SELECT ROUTE
  // =====================================================

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setRouteError(null);
  };

  // =====================================================
  // START SAFE JOURNEY
  // =====================================================

  const handleStartJourney = async () => {
    if (!selectedRoute) {
      setRouteError(
        "Please select a route first."
      );

      return;
    }

    if (!location) {
      setRouteError(
        "Your current location is unavailable."
      );

      return;
    }

    setRouteError(null);
    setLoadingRoutes(true);

    try {
      // -------------------------------------------------
      // SEND COMPLETE SELECTED ROUTE
      // -------------------------------------------------

      const response = await startJourney({
        route: {
          ...selectedRoute,

          origin: {
            latitude: location.latitude,
            longitude: location.longitude,
          },

          travelMode:
            selectedRoute.travelMode ||
            "WALKING",
        },

        destination:
          selectedRoute.destination ||
          destination.trim(),
      });

      console.log(
        "✅ Safe journey started:",
        response
      );

      // -------------------------------------------------
      // GET CREATED JOURNEY
      // -------------------------------------------------

      const createdJourney =
        response?.journey ||
        response?.data?.journey ||
        response?.data ||
        response;

      // -------------------------------------------------
      // GET JOURNEY ID
      // -------------------------------------------------

      const newJourneyId =
        createdJourney?.id ||
        createdJourney?._id ||
        response?.journeyId ||
        response?.data?.journeyId;

      // -------------------------------------------------
      // MAKE SURE ID EXISTS
      // -------------------------------------------------

      if (!newJourneyId) {
        throw new Error(
          "Journey was created, but no journey ID was returned."
        );
      }

      // -------------------------------------------------
      // MOVE TO ACTIVE JOURNEY
      // -------------------------------------------------

      navigate(
        `/journey/${newJourneyId}`
      );
    } catch (error) {
      console.error(
        "❌ Failed to start journey:",
        error
      );

      setRouteError(
        error.message ||
          "Unable to start your journey."
      );
    } finally {
      setLoadingRoutes(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="route-selection-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <section className="route-selection-content">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="route-selection-header">

          <button
            type="button"
            className="route-back-button"
            onClick={() => navigate(-1)}
          >
            ←
          </button>

          <div>

            <span className="route-eyebrow">
              PLAN YOUR JOURNEY
            </span>

            <h1>
              Where are you
              <em> going?</em>
            </h1>

          </div>

        </div>

        {/* =================================================
            LOCATION STATUS
        ================================================= */}

        <div
          className={`location-status ${
            location
              ? "location-status-ready"
              : "location-status-loading"
          }`}
        >

          <span className="location-status-dot" />

          <div>

            <strong>
              {location
                ? "Current location detected"
                : locationLoading
                  ? "Finding your location..."
                  : "Location unavailable"}
            </strong>

            {location && (
              <small>
                GPS accuracy:{" "}
                {Math.round(
                  location.accuracy || 0
                )}
                m
              </small>
            )}

          </div>

        </div>

        {/* =================================================
            DESTINATION SEARCH
        ================================================= */}

        <form
          className="destination-form"
          onSubmit={handleSearchRoutes}
        >

          <label htmlFor="destination">
            Destination
          </label>

          <div className="destination-input-wrapper">

            <span className="destination-icon">
              ◎
            </span>

            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(event) =>
                setDestination(
                  event.target.value
                )
              }
              placeholder="Where do you want to go?"
              autoComplete="off"
            />

            {destination && (
              <button
                type="button"
                className="clear-destination"
                onClick={() =>
                  setDestination("")
                }
                aria-label="Clear destination"
              >
                ×
              </button>
            )}

          </div>

          {/* =================================================
              SAFER ROUTES TOGGLE
          ================================================= */}

          <div className="safer-routes-toggle">

            <div>

              <strong>
                Prioritize safer routes
              </strong>

              <small>
                Disha considers safety signals
                when comparing routes.
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
              aria-pressed={saferOnly}
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
              loadingRoutes ||
              locationLoading
            }
          >

            {loadingRoutes ? (
              <>
                <span className="route-spinner" />

                Finding routes...
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

        {/* =================================================
            ERRORS
        ================================================= */}

        {(locationError || routeError) && (
          <div className="route-error">

            <span>
              !
            </span>

            <p>
              {routeError ||
                locationError}
            </p>

          </div>
        )}

        {/* =================================================
            ROUTE RESULTS
        ================================================= */}

        {routes.length > 0 && (
          <section className="routes-results">

            {/* =================================================
                GOOGLE MAP
            ================================================= */}

            <MapView
              location={location}
              routes={routes}
              selectedRoute={selectedRoute}
              onSelectRoute={
                handleSelectRoute
              }
            />

            {/* =================================================
                RESULTS HEADER
            ================================================= */}

            <div className="routes-results-header">

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
                option
                {routes.length === 1
                  ? ""
                  : "s"}
              </small>

            </div>

            {/* =================================================
                ROUTE LIST
            ================================================= */}

            <div className="routes-list">

              {routes.map((route) => {

                const routeKey =
                  route.routeId ||
                  route.id ||
                  route._id;

                const isSelected =
                  selectedRoute?.routeId ===
                    route.routeId ||
                  selectedRoute?.id ===
                    route.id ||
                  selectedRoute?._id ===
                    route._id;

                return (
                  <div
                    key={routeKey}
                  >

                    <RouteCard
                      route={route}
                      selected={isSelected}
                      onSelect={
                        handleSelectRoute
                      }
                    />

                    {/* =================================================
                        SAFER ROUTE EXPLANATION
                    ================================================= */}

                    {isSelected && (
                      <SaferRouteExplanation
                        route={route}
                      />
                    )}

                  </div>
                );
              })}

            </div>

            {/* =================================================
                START SAFE JOURNEY
            ================================================= */}

            <button
              type="button"
              className="start-route-button"
              disabled={
                !selectedRoute ||
                loadingRoutes
              }
              onClick={
                handleStartJourney
              }
            >

              <span>
                {loadingRoutes
                  ? "Starting journey..."
                  : "Start Safe Journey"}
              </span>

              <span>
                →
              </span>

            </button>

          </section>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!loadingRoutes &&
          routes.length === 0 &&
          !routeError && (
            <div className="route-empty-state">

              <div className="route-empty-icon">
                ⌖
              </div>

              <h3>
                Your route will appear here
              </h3>

              <p>
                Enter a destination and
                Disha will find available
                route options for you.
              </p>

            </div>
          )}

      </section>

    </main>
  );
}

export default RouteSelection;