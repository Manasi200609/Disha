import './HelpPlaces.css';

function HelpPlaces({
  places = [],
  onPlaceSelect,
  onNavigate,
}) {
  const getPlaceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'police':
      case 'police station':
        return '✦';

      case 'hospital':
      case 'clinic':
        return '+';

      case 'pharmacy':
        return '⌁';

      case 'safe place':
      case 'shelter':
        return '♡';

      default:
        return '●';
    }
  };

  const getPlaceLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'police':
      case 'police station':
        return 'Police';

      case 'hospital':
        return 'Hospital';

      case 'clinic':
        return 'Clinic';

      case 'pharmacy':
        return 'Pharmacy';

      case 'safe place':
        return 'Safe place';

      case 'shelter':
        return 'Shelter';

      default:
        return 'Nearby help';
    }
  };

  return (
    <section className="help-places">

      {/* =========================================
          HEADER
      ========================================== */}

      <div className="help-places-header">

        <div>
          <span className="help-places-eyebrow">
            NEARBY SUPPORT
          </span>

          <h2>
            Places that can help
          </h2>

          <p>
            Support available around your route
          </p>
        </div>

        <div className="help-places-header-icon">
          +
        </div>

      </div>


      {/* =========================================
          EMPTY STATE
      ========================================== */}

      {places.length === 0 && (
        <div className="help-places-empty">

          <div className="help-places-empty-icon">
            ◌
          </div>

          <div>
            <strong>
              Finding nearby help
            </strong>

            <p>
              Disha will show useful places
              around your current location.
            </p>
          </div>

        </div>
      )}


      {/* =========================================
          PLACES
      ========================================== */}

      {places.length > 0 && (
        <div className="help-places-list">

          {places.map((place, index) => {

            const {
              id = index,
              name = 'Nearby place',
              type = 'Nearby help',
              distance = '',
              address = '',
              openNow,
            } = place;

            return (
              <article
                key={id}
                className="help-place-card"
                onClick={() => onPlaceSelect?.(place)}
              >

                {/* Icon */}

                <div className="help-place-icon">
                  {getPlaceIcon(type)}
                </div>


                {/* Information */}

                <div className="help-place-info">

                  <div className="help-place-name-row">

                    <h3>{name}</h3>

                    {distance && (
                      <span className="help-place-distance">
                        {distance}
                      </span>
                    )}

                  </div>

                  <span className="help-place-type">
                    {getPlaceLabel(type)}
                  </span>

                  {address && (
                    <p>{address}</p>
                  )}

                  {typeof openNow === 'boolean' && (
                    <span
                      className={`help-place-open ${
                        openNow
                          ? 'open'
                          : 'closed'
                      }`}
                    >
                      {openNow
                        ? 'Open now'
                        : 'Closed'}
                    </span>
                  )}

                </div>


                {/* Navigate */}

                <button
                  type="button"
                  className="help-place-navigate"
                  onClick={(event) => {
                    event.stopPropagation();
                    onNavigate?.(place);
                  }}
                  aria-label={`Navigate to ${name}`}
                >
                  →
                </button>

              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default HelpPlaces;