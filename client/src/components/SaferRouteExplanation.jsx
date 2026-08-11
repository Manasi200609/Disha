import "./SaferRouteExplanation.css";

export default function SaferRouteExplanation({
  route
}) {
  if (!route) {
    return null;
  }

  const score =
    typeof route.safetyScore === "number"
      ? route.safetyScore
      : null;

  const activityScore =
    typeof route.activityScore === "number"
      ? route.activityScore
      : null;

  const helpScore =
    typeof route.helpScore === "number"
      ? route.helpScore
      : null;

  const incidentScore =
    typeof route.incidentScore === "number"
      ? route.incidentScore
      : null;


  const getSummary = () => {

    if (score === null) {
      return "Disha considers available safety signals for this route.";
    }

    if (score >= 80) {
      return "This route has stronger available safety indicators.";
    }

    if (score >= 65) {
      return "This route has a moderate safety profile.";
    }

    return "Disha found comparatively weaker safety indicators for this route.";
  };


  return (
    <div className="safer-explanation">

      <div className="safer-header">

        <div>
          <span className="safer-eyebrow">
            DISHA SAFETY CHECK
          </span>

          <h3>
            Why this route?
          </h3>
        </div>


        {score !== null && (
          <div className="safety-score">
            <strong>{score}</strong>
            <span>/100</span>
          </div>
        )}

      </div>


      <p className="safer-summary">
        {route.assessment || getSummary()}
      </p>


      <div className="safety-factors">

        {activityScore !== null && (
          <div className="safety-factor">
            <div className="factor-icon">
              A
            </div>

            <div>
              <strong>
                Public activity
              </strong>

              <span>
                {activityScore}/100
              </span>
            </div>
          </div>
        )}


        {helpScore !== null && (
          <div className="safety-factor">
            <div className="factor-icon">
              +
            </div>

            <div>
              <strong>
                Help availability
              </strong>

              <span>
                {helpScore}/100
              </span>
            </div>
          </div>
        )}


        {incidentScore !== null && (
          <div className="safety-factor">
            <div className="factor-icon">
              !
            </div>

            <div>
              <strong>
                Safety signals
              </strong>

              <span>
                {incidentScore}/100
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}