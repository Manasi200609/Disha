import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";

import { useEffect, useMemo } from "react";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./MapView.css";

// ============================================================
// FIX LEAFLET DEFAULT MARKER ICON
// ============================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ============================================================
// DEFAULT LOCATION — PUNE
// ============================================================

const defaultCenter = [18.5204, 73.8567];

// ============================================================
// SAFETY ZONE CONFIG
// ============================================================

const SAFETY_ZONE_TYPES = [
  {
    type: "green",
    label: "Safe Zone",
    color: "#4f8a5b",
    fillColor: "#74b77d",
  },
  {
    type: "yellow",
    label: "Caution Zone",
    color: "#c18b27",
    fillColor: "#e4c15a",
  },
  {
    type: "red",
    label: "High Risk Zone",
    color: "#c54b4b",
    fillColor: "#df7070",
  },
];

// ============================================================
// RANDOM NUMBER
// ============================================================

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// ============================================================
// CREATE SAFETY ZONES
// ============================================================

function generateSafetyZones(center, routePath = []) {
  const zones = [];

  // ----------------------------------------------------------
  // Use route points when available
  // ----------------------------------------------------------

  const availablePoints =
    routePath.length > 2
      ? routePath
      : [center];

  // ----------------------------------------------------------
  // Create 7 zones
  // ----------------------------------------------------------

  const zoneCount = 7;

  for (let i = 0; i < zoneCount; i++) {
    const basePoint =
      availablePoints[
        Math.floor(
          Math.random() * availablePoints.length
        )
      ];

    const baseLat = Number(basePoint[0]);
    const baseLng = Number(basePoint[1]);

    // Random offset around route
    const latitudeOffset =
      randomBetween(-0.012, 0.012);

    const longitudeOffset =
      randomBetween(-0.012, 0.012);

    const latitude =
      baseLat + latitudeOffset;

    const longitude =
      baseLng + longitudeOffset;

    // --------------------------------------------------------
    // Random safety type
    // --------------------------------------------------------

    const zoneType =
      SAFETY_ZONE_TYPES[
        Math.floor(
          Math.random() *
            SAFETY_ZONE_TYPES.length
        )
      ];

    // --------------------------------------------------------
    // Random radius
    // --------------------------------------------------------

    const radius =
      randomBetween(180, 420);

    zones.push({
      id: `safety-zone-${Date.now()}-${i}`,

      position: [
        latitude,
        longitude,
      ],

      radius,

      ...zoneType,
    });
  }

  return zones;
}

// ============================================================
// MAP CENTER / FIT BOUNDS
// ============================================================

function MapUpdater({
  center,
  selectedRoute,
}) {
  const map = useMap();

  useEffect(() => {
    if (
      selectedRoute?.decodedPath &&
      selectedRoute.decodedPath.length > 1
    ) {
      const bounds =
        L.latLngBounds(
          selectedRoute.decodedPath.map(
            (point) => [
              Number(point.latitude),
              Number(point.longitude),
            ]
          )
        );

      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
      });
    } else if (center) {
      map.setView(center, 14);
    }
  }, [map, center, selectedRoute]);

  return null;
}

// ============================================================
// MAP VIEW
// ============================================================

function MapView({
  location,
  destinationLocation,
  routes = [],
  selectedRoute,
  onSelectRoute,
}) {
  // ==========================================================
  // CURRENT LOCATION
  // ==========================================================

  const currentLocation = location
    ? [
        Number(location.latitude),
        Number(location.longitude),
      ]
    : defaultCenter;

  // ==========================================================
  // DESTINATION
  // ==========================================================

  const destination = destinationLocation
    ? [
        Number(destinationLocation.latitude),
        Number(destinationLocation.longitude),
      ]
    : null;

  // ==========================================================
  // MAP CENTER
  // ==========================================================

  const mapCenter =
    destination || currentLocation;

  // ==========================================================
  // SELECTED ROUTE PATH
  // ==========================================================

  const selectedRoutePath =
    selectedRoute?.decodedPath?.length
      ? selectedRoute.decodedPath.map(
          (point) => [
            Number(point.latitude),
            Number(point.longitude),
          ]
        )
      : [];

  // ==========================================================
  // SAFETY ZONES
  //
  // Regenerate when destination / selected route changes.
  // ==========================================================

  const safetyZones = useMemo(() => {
    return generateSafetyZones(
      mapCenter,
      selectedRoutePath
    );
  }, [
    destinationLocation?.latitude,
    destinationLocation?.longitude,
    selectedRoute?.routeId,
    selectedRoute?.id,
  ]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="map-container">

      <MapContainer
        center={mapCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "480px",
        }}
      >

        {/* ==================================================
            OPENSTREETMAP
        ================================================== */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ==================================================
            UPDATE MAP POSITION
        ================================================== */}

        <MapUpdater
          center={mapCenter}
          selectedRoute={selectedRoute}
        />

        {/* ==================================================
            SAFETY ZONES
        ================================================== */}

        <div />

        {safetyZones.map((zone) => (
          <Circle
            key={zone.id}
            center={zone.position}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.fillColor,

              fillOpacity: 0.22,
              opacity: 0.65,

              weight: 2,
            }}
          >
            <Popup>
              <div className="safety-zone-popup">

                <div
                  className="safety-zone-popup-dot"
                  style={{
                    backgroundColor:
                      zone.color,
                  }}
                />

                <div>
                  <strong>
                    {zone.label}
                  </strong>

                  <p>
                    {zone.type === "green" &&
                      "Lower-risk area."}

                    {zone.type === "yellow" &&
                      "Exercise additional caution here."}

                    {zone.type === "red" &&
                      "Higher-risk demo zone. Consider a safer route."}
                  </p>

                  <small>
                    Demo safety visualization
                  </small>
                </div>

              </div>
            </Popup>
          </Circle>
        ))}

        {/* ==================================================
            CURRENT LOCATION MARKER
        ================================================== */}

        {location && (
          <Marker
            position={currentLocation}
          >
            <Popup>
              <strong>
                Your current location
              </strong>

              <br />

              Starting point for your journey.
            </Popup>
          </Marker>
        )}

        {/* ==================================================
            DESTINATION MARKER
        ================================================== */}

        {destination && (
          <Marker
            position={destination}
          >
            <Popup>
              <strong>
                Destination
              </strong>

              <br />

              {destinationLocation.name ||
                "Selected destination"}
            </Popup>
          </Marker>
        )}

        {/* ==================================================
            ROUTES
        ================================================== */}

        {routes.map((route, index) => {
          if (
            !route.decodedPath ||
            route.decodedPath.length < 2
          ) {
            return null;
          }

          const routeId =
            route.routeId ||
            route.id ||
            `route-${index}`;

          const isSelected =
            selectedRoute &&
            (
              selectedRoute.routeId ===
                route.routeId ||
              selectedRoute.id === route.id
            );

          const path =
            route.decodedPath.map(
              (point) => [
                Number(point.latitude),
                Number(point.longitude),
              ]
            );

          return (
            <Polyline
              key={routeId}
              positions={path}
              pathOptions={{
                color: isSelected
                  ? "#A85D47"
                  : "#8F817A",

                weight: isSelected
                  ? 7
                  : 4,

                opacity: isSelected
                  ? 1
                  : 0.5,
              }}
              eventHandlers={{
                click: () => {
                  onSelectRoute?.(route);
                },
              }}
            />
          );
        })}

      </MapContainer>

      {/* ======================================================
          LEGEND
      ====================================================== */}

      <div className="map-legend">

        {/* Route legend */}

        {routes.length > 0 && (
          <>
            <div className="map-legend-title">
              DISHA Safety Map
            </div>

            <div className="map-legend-item">
              <span className="legend-line selected" />
              Selected safer route
            </div>

            <div className="map-legend-item">
              <span className="legend-line alternative" />
              Alternative route
            </div>

            <div className="map-legend-divider" />
          </>
        )}

        {/* Safety zones */}

        <div className="map-legend-item">
          <span className="legend-zone green" />
          Safe zone
        </div>

        <div className="map-legend-item">
          <span className="legend-zone yellow" />
          Caution zone
        </div>

        <div className="map-legend-item">
          <span className="legend-zone red" />
          High-risk zone
        </div>

      </div>

      {/* ======================================================
          DEMO LABEL
      ====================================================== */}

      <div className="map-demo-label">
        Safety zones are demo visualizations
      </div>

    </div>
  );
}

export default MapView;