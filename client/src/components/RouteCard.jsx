import React from "react";

import "./RouteCard.css";

function RouteCard({
  route,
  selected = false,
  onSelect,
}) {
  if (!route) {
    return null;
  }

  const distance =
    route.distance ??
    route.distanceKm ??
    route.distanceText ??
    "Distance unavailable";

  const eta =
    route.eta ??
    route.duration ??
    route.durationText ??
    "Time unavailable";

  const safetyScore =
    route.safetyScore ??
    route.safety ??
    0;

  const safetyLabel =
    safetyScore >= 80
      ? "High safety"
      : safetyScore >= 60
      ? "Moderate safety"
      : "Lower safety";

  return (
    <button
      type="button"
      className={`route-card ${
        selected ? "route-card-selected" : ""
      }`}
      onClick={() => onSelect?.(route)}
    >
      {/* HEADER */}
      <div className="route-card-header">
        <div>
          <span className="route-card-eyebrow">
            {route.recommended
              ? "RECOMMENDED ROUTE"
              : "ALTERNATIVE ROUTE"}
          </span>

          <h3>
            {route.name ||
              route.title ||
              `Route ${route.index ?? ""}`}
          </h3>
        </div>

        <span
          className={`route-radio ${
            selected ? "active" : ""
          }`}
        >
          {selected && "✓"}
        </span>
      </div>

      {/* DETAILS */}
      <div className="route-card-details">
        <div className="route-detail">
          <span className="route-detail-icon">
            ↗
          </span>

          <div>
            <small>DISTANCE</small>
            <strong>{distance}</strong>
          </div>
        </div>

        <div className="route-detail">
          <span className="route-detail-icon">
            ◷
          </span>

          <div>
            <small>ETA</small>
            <strong>{eta}</strong>
          </div>
        </div>

        <div className="route-detail">
          <span className="route-detail-icon">
            ♢
          </span>

          <div>
            <small>SAFETY</small>
            <strong>
              {safetyScore}/100
            </strong>
          </div>
        </div>
      </div>

      {/* SAFETY LABEL */}
      <div className="route-safety-label">
        {safetyLabel}
      </div>
    </button>
  );
}

export default RouteCard;