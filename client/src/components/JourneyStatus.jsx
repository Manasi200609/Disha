import { useEffect, useState } from "react";
import "./JourneyStatus.css";

function JourneyStatus({
  journey,
  destination = "Your destination",
  eta,
  safetyScore,
  isMonitoring = true,
}) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // ------------------------------------------------------------
  // Calculate elapsed journey time
  // ------------------------------------------------------------

  useEffect(() => {
    if (!journey?.startedAt) {
      setElapsedMinutes(0);
      return;
    }

    const updateElapsed = () => {
      const started = new Date(journey.startedAt).getTime();
      const now = Date.now();

      const minutes = Math.max(
        0,
        Math.floor((now - started) / 60000)
      );

      setElapsedMinutes(minutes);
    };

    updateElapsed();

    const interval = setInterval(
      updateElapsed,
      1000
    );

    return () => clearInterval(interval);
  }, [journey?.startedAt]);

  // ------------------------------------------------------------
  // Dynamic values
  // ------------------------------------------------------------

  const currentSafety =
    safetyScore ??
    journey?.safetyScore ??
    87;

  const currentEta =
    eta ??
    journey?.eta ??
    "--";

  const active =
    journey?.status === "active";

  const monitoring =
    active && isMonitoring;

  const heading =
    journey?.destination ||
    destination ||
    "Your destination";

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div className="journey-status">

      {/* ======================================================
          DESTINATION + ETA
      ====================================================== */}

      <div className="journey-top-grid">

        <div className="destination-card">

          <span className="card-label">
            DESTINATION
          </span>

          <strong>
            {heading}
          </strong>

        </div>


        <div className="eta-card">

          <span className="card-label">
            ETA
          </span>

          <strong>
            {currentEta === "--"
              ? "--"
              : `${currentEta} min`}
          </strong>

        </div>

      </div>


      {/* ======================================================
          MAIN JOURNEY CARD
      ====================================================== */}

      <div className="journey-main-card">

        {/* Header */}

        <div className="journey-card-header">

          <div className="journey-active-info">

            <span
              className={`status-dot ${
                active
                  ? "active"
                  : "inactive"
              }`}
            />

            <div>

              <strong>
                {active
                  ? "Journey active"
                  : "Journey ended"}
              </strong>

              <small>
                {active
                  ? "Disha is watching over you"
                  : "Journey monitoring stopped"}
              </small>

            </div>

          </div>


          <div className="safety-score">

            <span>
              SAFETY
            </span>

            <strong>
              {currentSafety}
            </strong>

          </div>

        </div>


        {/* Heading */}

        <div className="heading-card">

          <div className="heading-icon">
            →
          </div>

          <div>

            <span>
              HEADING TO
            </span>

            <strong>
              {heading}
            </strong>

          </div>

        </div>


        {/* ==================================================
            LIVE STATS
        ================================================== */}

        <div className="journey-stats">

          <div className="journey-stat">

            <span className="stat-icon">
              ◷
            </span>

            <div>

              <small>
                Elapsed
              </small>

              <strong>
                {String(
                  elapsedMinutes
                ).padStart(2, "0")} min
              </strong>

            </div>

          </div>


          <div className="journey-stat">

            <span className="stat-icon">
              ↓
            </span>

            <div>

              <small>
                ETA
              </small>

              <strong>
                {currentEta === "--"
                  ? "--"
                  : `${currentEta} min`}
              </strong>

            </div>

          </div>


          <div className="journey-stat">

            <span className="stat-icon">
              ♡
            </span>

            <div>

              <small>
                Monitoring
              </small>

              <strong
                className={
                  monitoring
                    ? "monitoring-on"
                    : "monitoring-off"
                }
              >
                {monitoring
                  ? "ON"
                  : "OFF"}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default JourneyStatus;