import "./EmergencyAlert.css";

export default function EmergencyAlert({
  open,
  onClose,
  onConfirm,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="emergency-overlay"
      onClick={onClose}
    >

      <div
        className="emergency-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-title"
        onClick={(event) => event.stopPropagation()}
      >

        <div className="emergency-modal-icon">
          !
        </div>

        <span className="emergency-eyebrow">
          EMERGENCY SUPPORT
        </span>

        <h2 id="emergency-title">
          Are you sure?
        </h2>

        <p>
          Disha will alert your trusted
          contacts that you need help.
        </p>

        <div className="emergency-actions">

          <button
            type="button"
            className="emergency-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="emergency-confirm"
            onClick={onConfirm}
          >
            Alert my contacts
          </button>

        </div>

      </div>

    </div>
  );
}

