import "./SaferRouteExplanation.css";

export default function SaferRouteExplanation({ route }) {
  const assessment = route?.assessment;

  const title =
    typeof assessment === "object"
      ? assessment?.title
      : assessment || "Safer route";

  const description =
    typeof assessment === "object"
      ? assessment?.description
      : route?.description ||
        "Disha selected this route based on available safety signals.";

  const signals =
    route?.aiResearch?.recentSignals || [];

  return (
    <div className="safer-route-explanation">

      <div className="safer-route-explanation-header">

        <div className="safer-route-check">
          ✓
        </div>

        <div>
          <span className="safer-route-label">
            DISHA SAFETY ANALYSIS
          </span>

          <h3>
            {title}
          </h3>
        </div>

      </div>

      <p className="safer-route-description">
        {description}
      </p>

      {signals.length > 0 && (
        <div className="safer-route-signals">

          <span>
            Why this route?
          </span>

          <ul>
            {signals.map((signal, index) => (
              <li key={index}>
                <span>✓</span>
                {signal}
              </li>
            ))}
          </ul>

        </div>
      )}

      <div className="safer-route-score">

        <div>
          <span>Safety score</span>

          <strong>
            {route?.safetyScore ?? "--"}
            <small>/100</small>
          </strong>
        </div>

        <div className="score-bar">
          <div
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  Number(route?.safetyScore) || 0
                )
              )}%`,
            }}
          />
        </div>

      </div>

    </div>
  );
}