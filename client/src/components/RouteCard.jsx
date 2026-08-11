import './RouteCard.css';

function RouteCard({
  route,
  selected = false,
  onSelect,
}) {
  if (!route) {
    return null;
  }

  // =====================================================
  // NORMALIZE BACKEND / GOOGLE ROUTE DATA
  // =====================================================

  const distance =
    route.distance ||
    route.distanceText ||
    route.distanceMeters
      ? route.distanceText ||
        formatDistance(route.distanceMeters)
      : 'Distance unavailable';

  const duration =
    route.duration ||
    route.durationText ||
    route.durationSeconds
      ? route.durationText ||
        formatDuration(route.durationSeconds)
      : 'Time unavailable';

  const safetyScore =
    route.safetyScore ??
    route.safety?.score ??
    route.score ??
    null;

  const safetyLevel =
    route.safetyLevel ||
    route.safety?.level ||
    getSafetyLevel(safetyScore);

  const label =
    route.name ||
    route.title ||
    route.summary ||
    'Recommended route';

  const description =
    route.description ||
    route.safety?.reason ||
    null;

  const isRecommended =
    route.recommended === true ||
    route.isRecommended === true ||
    route.recommended === 'true';

  const warnings =
    route.warnings ||
    route.safety?.warnings ||
    [];

  const normalizedWarnings =
    Array.isArray(warnings)
      ? warnings
      : [warnings];


  return (
    <button
      type="button"
      className={`route-card ${
        selected
          ? 'route-card-selected'
          : ''
      }`}
      onClick={onSelect}
    >

      {/* =================================================
          TOP
      ================================================= */}

      <div className="route-card-top">

        <div className="route-card-icon">
          {isRecommended ? '✦' : '↗'}
        </div>

        <div className="route-card-title">

          <div className="route-card-heading">

            <h3>
              {label}
            </h3>

            {isRecommended && (
              <span className="route-recommended">
                RECOMMENDED
              </span>
            )}

          </div>

          {description && (
            <p>
              {description}
            </p>
          )}

        </div>

        <div
          className={`route-radio ${
            selected
              ? 'route-radio-selected'
              : ''
          }`}
        >
          {selected && <span />}
        </div>

      </div>


      {/* =================================================
          ROUTE DETAILS
      ================================================= */}

      <div className="route-card-details">

        <div className="route-detail">

          <span className="route-detail-icon">
            ↝
          </span>

          <div>
            <small>
              DISTANCE
            </small>

            <strong>
              {distance}
            </strong>
          </div>

        </div>


        <div className="route-detail">

          <span className="route-detail-icon">
            ◷
          </span>

          <div>
            <small>
              ETA
            </small>

            <strong>
              {duration}
            </strong>
          </div>

        </div>


        {safetyScore !== null && (

          <div className="route-detail">

            <span className="route-detail-icon">
              ♢
            </span>

            <div>
              <small>
                SAFETY
              </small>

              <strong>
                {safetyScore}/100
              </strong>
            </div>

          </div>

        )}

      </div>


      {/* =================================================
          SAFETY
      ================================================= */}

      {safetyLevel && (

        <div
          className={`route-safety ${
            getSafetyClass(safetyLevel)
          }`}
        >

          <span className="route-safety-dot" />

          <span>
            {formatSafetyLabel(
              safetyLevel
            )}
          </span>

        </div>

      )}


      {/* =================================================
          WARNINGS
      ================================================= */}

      {normalizedWarnings.length > 0 &&
        normalizedWarnings.some(Boolean) && (

          <div className="route-warnings">

            {normalizedWarnings
              .filter(Boolean)
              .slice(0, 2)
              .map((warning, index) => (

                <span
                  key={`${warning}-${index}`}
                >
                  {warning}
                </span>

              ))}

          </div>

        )}

    </button>
  );
}


// =========================================================
// DISTANCE FORMATTER
// =========================================================

function formatDistance(
  meters
) {

  if (
    typeof meters !== 'number'
  ) {
    return null;
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(
    meters / 1000
  ).toFixed(1)} km`;
}


// =========================================================
// DURATION FORMATTER
// =========================================================

function formatDuration(
  seconds
) {

  if (
    typeof seconds !== 'number'
  ) {
    return null;
  }

  const minutes =
    Math.round(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}


// =========================================================
// SAFETY LEVEL
// =========================================================

function getSafetyLevel(
  score
) {

  if (
    typeof score !== 'number'
  ) {
    return null;
  }

  if (score >= 80) {
    return 'safe';
  }

  if (score >= 60) {
    return 'moderate';
  }

  return 'caution';
}


// =========================================================
// SAFETY CLASS
// =========================================================

function getSafetyClass(
  level
) {

  const normalized =
    String(level)
      .toLowerCase();

  if (
    normalized.includes('safe') ||
    normalized.includes('high')
  ) {
    return 'route-safety-safe';
  }

  if (
    normalized.includes('moderate') ||
    normalized.includes('medium')
  ) {
    return 'route-safety-moderate';
  }

  return 'route-safety-caution';
}


// =========================================================
// SAFETY LABEL
// =========================================================

function formatSafetyLabel(
  level
) {

  const normalized =
    String(level)
      .toLowerCase();

  if (
    normalized.includes('safe') ||
    normalized.includes('high')
  ) {
    return 'High safety';
  }

  if (
    normalized.includes('moderate') ||
    normalized.includes('medium')
  ) {
    return 'Moderate safety';
  }

  return 'Use caution';
}


export default RouteCard;