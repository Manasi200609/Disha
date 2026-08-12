import { useState } from "react";
import "./EmergencyButton.css";

function EmergencyButton({
  journey = null,
  location = null,
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [alerting, setAlerting] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleEmergency = async () => {
    if (alerting) return;

    setShowAlert(true);
    setAlerting(true);
    setAlertSent(false);

    /*
     * Give the user a short escalation animation.
     * Later this can call your real emergency backend.
     */
    setTimeout(() => {
      setAlerting(false);
      setAlertSent(true);
    }, 1800);
  };

  const closeAlert = () => {
    setShowAlert(false);
    setAlertSent(false);
  };

  return (
    <>
      {/* =====================================================
          EMERGENCY BUTTON
      ===================================================== */}

      <button
        type="button"
        className="emergency-button"
        onClick={handleEmergency}
      >
        <span className="home-sos-icon">
          !
        </span>

        <span className="emergency-content">
          <strong>Emergency</strong>
          <small>Get help now</small>
        </span>

        <span className="emergency-arrow">
          →
        </span>
      </button>


      {/* =====================================================
          ESCALATION OVERLAY
      ===================================================== */}

      {showAlert && (
        <div
          className="emergency-overlay"
          onClick={closeAlert}
        >
          <div
            className="emergency-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {!alertSent ? (
              <>
                <div className="emergency-pulse">
                  !
                </div>

                <span className="emergency-modal-eyebrow">
                  EMERGENCY ESCALATION
                </span>

                <h2>
                  Alerting your contacts
                </h2>

                <p>
                  Disha is sending your emergency
                  alert and current location to your
                  trusted contacts.
                </p>

                <div className="emergency-progress">
                  <span />
                </div>

                <small className="emergency-status">
                  Contacting your safety network...
                </small>
              </>
            ) : (
              <>
                <div className="emergency-success">
                  ✓
                </div>

                <span className="emergency-modal-eyebrow">
                  ALERT SENT
                </span>

                <h2>
                  Your contacts have been alerted.
                </h2>

                <p>
                  Your emergency alert and latest
                  available location have been shared
                  with your trusted contacts.
                </p>

                <button
                  type="button"
                  className="emergency-close-button"
                  onClick={closeAlert}
                >
                  Done
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default EmergencyButton;