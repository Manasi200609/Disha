import './EmergencyButton.css';

function EmergencyButton({
  onEmergency,
  disabled = false,
  label = 'Emergency',
  showLabel = true,
}) {
  const handleEmergency = () => {
    if (disabled) return;

    onEmergency?.();
  };

  return (
    <button
      type="button"
      className={`emergency-button ${
        disabled ? 'disabled' : ''
      }`}
      onClick={handleEmergency}
      disabled={disabled}
      aria-label="Emergency assistance"
    >
      <span className="emergency-button-icon">
        !
      </span>

      {showLabel && (
        <span className="emergency-button-content">
          <strong>{label}</strong>
          <small>Get help now</small>
        </span>
      )}
    </button>
  );
}

export default EmergencyButton;