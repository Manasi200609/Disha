import './SafetyBadge.css';

function SafetyBadge({
  score,
  level,
  size = 'medium',
  showScore = true,
}) {
  const numericScore = Number(score) || 0;

  const getSafetyLevel = () => {
    if (level) {
      return level;
    }

    if (numericScore >= 80) {
      return 'Safe';
    }

    if (numericScore >= 60) {
      return 'Moderate';
    }

    return 'High Risk';
  };

  const safetyLevel = getSafetyLevel();

  const getSafetyClass = () => {
    const normalized = safetyLevel.toLowerCase();

    if (
      normalized.includes('safe') ||
      normalized.includes('high')
    ) {
      return 'safe';
    }

    if (
      normalized.includes('moderate') ||
      normalized.includes('medium')
    ) {
      return 'moderate';
    }

    return 'risk';
  };

  const safetyClass = getSafetyClass();

  return (
    <div
      className={`safety-badge ${safetyClass} ${size}`}
      aria-label={`Safety level: ${safetyLevel}${
        showScore ? `, score ${numericScore} out of 100` : ''
      }`}
    >

      <span className="safety-badge-dot" />

      <div className="safety-badge-content">

        <span className="safety-badge-level">
          {safetyLevel}
        </span>

        {showScore && (
          <span className="safety-badge-score">
            {numericScore}/100
          </span>
        )}

      </div>

    </div>
  );
}

export default SafetyBadge;