import { useEffect } from 'react';
import './CheckInModal.css';

function CheckInModal({
  isOpen = false,
  onSafe,
  onNeedHelp,
  onClose,
  countdown = 30,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="checkin-modal-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        className="checkin-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkin-title"
      >

        {/* =========================================
            TOP INDICATOR
        ========================================== */}

        <div className="checkin-modal-indicator">
          <span className="checkin-modal-pulse" />
        </div>


        {/* =========================================
            CONTENT
        ========================================== */}

        <div className="checkin-modal-content">

          <span className="checkin-modal-eyebrow">
            DISHA CHECK-IN
          </span>

          <h2 id="checkin-title">
            Are you okay?
          </h2>

          <p>
            We noticed something unusual during
            your journey and wanted to make sure
            you're safe.
          </p>

        </div>


        {/* =========================================
            COUNTDOWN
        ========================================== */}

        <div className="checkin-countdown">

          <span>
            Please respond within
          </span>

          <strong>
            {countdown}s
          </strong>

        </div>


        {/* =========================================
            SAFE ACTION
        ========================================== */}

        <button
          type="button"
          className="checkin-safe-button"
          onClick={() => onSafe?.()}
        >
          <span className="checkin-safe-icon">
            ✓
          </span>

          <span>
            I'm safe
          </span>
        </button>


        {/* =========================================
            HELP ACTION
        ========================================== */}

        <button
          type="button"
          className="checkin-help-button"
          onClick={() => onNeedHelp?.()}
        >
          I need help
        </button>


        {/* =========================================
            TRUSTED CONTACT NOTE
        ========================================== */}

        <div className="checkin-contact-note">

          <span>
            ♡
          </span>

          <p>
            If you don't respond, Disha can
            escalate the situation according
            to your safety settings.
          </p>

        </div>


        {/* =========================================
            CLOSE
        ========================================== */}

        <button
          type="button"
          className="checkin-close-button"
          onClick={() => onClose?.()}
          aria-label="Close check-in"
        >
          ×
        </button>

      </section>
    </div>
  );
}

export default CheckInModal;