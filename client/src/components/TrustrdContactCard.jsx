import './TrustedContactCard.css';

function TrustedContactCard({
  contact,
  onEdit,
  onRemove,
  onCall,
}) {
  if (!contact) {
    return null;
  }

  const {
    name = 'Trusted Contact',
    relation = 'Trusted contact',
    phone = '',
    initials,
    isPrimary = false,
    notificationsEnabled = true,
  } = contact;

  const displayInitials =
    initials ||
    name
      .split(' ')
      .map((word) => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <article className="trusted-contact-card">

      {/* =========================================
          HEADER
      ========================================== */}

      <div className="trusted-contact-header">

        <div className="trusted-contact-person">

          <div className="trusted-contact-avatar">
            {displayInitials}
          </div>

          <div className="trusted-contact-info">

            <div className="trusted-contact-name-row">

              <h3>{name}</h3>

              {isPrimary && (
                <span className="trusted-contact-primary">
                  PRIMARY
                </span>
              )}

            </div>

            <p>{relation}</p>

          </div>

        </div>


        <button
          className="trusted-contact-edit"
          type="button"
          onClick={() => onEdit?.(contact)}
          aria-label={`Edit ${name}`}
        >
          ✎
        </button>

      </div>


      {/* =========================================
          CONTACT DETAILS
      ========================================== */}

      {phone && (
        <div className="trusted-contact-detail">

          <span className="trusted-contact-detail-icon">
            ☎
          </span>

          <span>{phone}</span>

        </div>
      )}


      {/* =========================================
          JOURNEY UPDATE STATUS
      ========================================== */}

      <div className="trusted-contact-status">

        <span
          className={`trusted-contact-status-dot ${
            notificationsEnabled
              ? 'enabled'
              : 'disabled'
          }`}
        />

        <span>
          {notificationsEnabled
            ? 'Receives journey updates'
            : 'Journey updates paused'}
        </span>

      </div>


      {/* =========================================
          ACTIONS
      ========================================== */}

      <div className="trusted-contact-actions">

        {phone && (
          <button
            type="button"
            className="trusted-contact-call"
            onClick={() => onCall?.(contact)}
          >
            <span>☎</span>
            Call
          </button>
        )}

        <button
          type="button"
          className="trusted-contact-remove"
          onClick={() => onRemove?.(contact)}
        >
          Remove
        </button>

      </div>

    </article>
  );
}

export default TrustedContactCard;