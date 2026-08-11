import './JourneyStatus.css';

function JourneyStatus({
  status = 'active',
  destination = 'Your destination',
  eta = '12 min',
  elapsedTime = '08 min',
  safetyScore = 87,
  onCheckIn,
}) {
  const statusConfig = {
    active: {
      label: 'Journey active',
      subtext: 'Disha is watching over you',
      className: 'active',
    },

    checkin: {
      label: 'Check-in required',
      subtext: 'Let your trusted contact know you are okay',
      className: 'checkin',
    },

    completed: {
      label: 'Journey completed',
      subtext: 'You reached your destination safely',
      className: 'completed',
    },

    paused: {
      label: 'Journey paused',
      subtext: 'Journey monitoring is temporarily paused',
      className: 'paused',
    },
  };

  const currentStatus =
    statusConfig[status] || statusConfig.active;

  return (
    <section className="journey-status">

      {/* =========================================
          STATUS HEADER
      ========================================== */}

      <div className="journey-status-header">

        <div className="journey-status-indicator">

          <span
            className={`journey-status-pulse ${currentStatus.className}`}
          />

          <div>
            <span className="journey-status-label">
              {currentStatus.label}
            </span>

            <p>{currentStatus.subtext}</p>
          </div>

        </div>


        {/* Safety score */}

        <div className="journey-mini-score">

          <span>SAFETY</span>

          <strong>{safetyScore}</strong>

        </div>

      </div>


      {/* =========================================
          DESTINATION
      ========================================== */}

      <div className="journey-destination">

        <div className="journey-destination-icon">
          ●
        </div>

        <div>

          <span>HEADING TO</span>

          <strong>{destination}</strong>

        </div>

      </div>


      {/* =========================================
          JOURNEY STATS
      ========================================== */}

      <div className="journey-stats">

        <div className="journey-stat">

          <span className="journey-stat-icon">
            ◷
          </span>

          <div>
            <small>Elapsed</small>
            <strong>{elapsedTime}</strong>
          </div>

        </div>


        <div className="journey-stat-divider" />


        <div className="journey-stat">

          <span className="journey-stat-icon">
            ↓
          </span>

          <div>
            <small>ETA</small>
            <strong>{eta}</strong>
          </div>

        </div>


        <div className="journey-stat-divider" />


        <div className="journey-stat">

          <span className="journey-stat-icon">
            ♡
          </span>

          <div>
            <small>Monitoring</small>
            <strong>ON</strong>
          </div>

        </div>

      </div>


      {/* =========================================
          CHECK-IN
      ========================================== */}

      {status === 'checkin' && (
        <button
          className="journey-checkin-button"
          onClick={onCheckIn}
        >
          <span>
            I'm safe
          </span>

          <span>
            ✓
          </span>
        </button>
      )}


      {/* =========================================
          ACTIVE JOURNEY MESSAGE
      ========================================== */}

      {status === 'active' && (
        <div className="journey-monitoring-message">

          <span className="monitoring-icon">
            ✦
          </span>

          <p>
            Disha is monitoring your journey.
            If something changes, we'll check in
            with you.
          </p>

        </div>
      )}


      {/* =========================================
          COMPLETED MESSAGE
      ========================================== */}

      {status === 'completed' && (
        <div className="journey-completed-message">

          <span>
            ✓
          </span>

          <p>
            You made it. Journey safely completed.
          </p>

        </div>
      )}

    </section>
  );
}

export default JourneyStatus;