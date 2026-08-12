import { useState } from "react";
import EmergencyAlert from "../components/EmergencyAlert";
import EmergencyButton from "../components/EmergencyButton";
import "./Home.css";

function Home({ darkMode, toggleDarkMode }) {
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handlePlanJourney = () => {
    window.location.href = "/routes";
  };

  const handleProfile = () => {
    window.location.href = "/profile";
  };

  // =====================================================
  // EMERGENCY
  // =====================================================

  const handleEmergency = () => {
    setShowEmergencyAlert(true);
  };

  const handleCloseEmergency = () => {
    setShowEmergencyAlert(false);
  };

  const handleConfirmEmergency = () => {
    console.log("Emergency confirmed");

    // Close confirmation modal
    setShowEmergencyAlert(false);

    // Later you can connect this to:
    // - trusted contacts
    // - backend API
    // - location sharing
    // - emergency notification
    // - SOS service
  };

  return (
    <main className="home-page">

      {/* =================================
          HEADER
      ================================= */}

      <header className="home-header">

        <div className="home-brand">

          <div className="home-brand-mark">
            D
          </div>

          <div>
            <span className="home-greeting">
              Welcome back
            </span>

            <h2>Disha</h2>
          </div>

        </div>

        <div className="home-header-actions">

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <button
            type="button"
            className="profile-button"
            onClick={handleProfile}
            aria-label="Open profile"
          >
            M
          </button>

        </div>

      </header>

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <section className="home-content">

        {/* =================================
            HERO
        ================================= */}

        <div className="home-hero">

          <span className="home-eyebrow">
            READY WHEN YOU ARE
          </span>

          <h1>
            Where are you
            <br />
            <span>headed today?</span>
          </h1>

          <p>
            Tell Disha where you're going.
            We'll help you find a route that
            feels safer and keep you connected
            along the way.
          </p>

        </div>

        {/* =================================
            PLAN JOURNEY
        ================================= */}

        <section className="journey-start">

          <div className="journey-location">

            <div className="location-icon">
              <span />
            </div>

            <div className="location-content">

              <span>FROM</span>

              <strong>
                Your current location
              </strong>

            </div>

          </div>

          <div className="location-line">
            <span />
          </div>

          <button
            type="button"
            className="destination-input"
            onClick={handlePlanJourney}
          >

            <div className="destination-icon">
              <span />
            </div>

            <div className="destination-content">

              <span>TO</span>

              <strong>
                Where do you want to go?
              </strong>

            </div>

            <span className="destination-arrow">
              →
            </span>

          </button>

          <button
            type="button"
            className="btn btn-primary plan-button"
            onClick={handlePlanJourney}
          >
            Plan a safe route

            <span>→</span>
          </button>

        </section>

        {/* =================================
            QUICK SAFETY
        ================================= */}

        <section className="quick-safety">

          <div className="section-heading">

            <div>

              <span>
                YOUR SAFETY NET
              </span>

              <h3>
                You're not alone.
              </h3>

            </div>

          </div>

          <div className="safety-list">

            <button
              type="button"
              className="safety-item"
              onClick={handleProfile}
            >

              <div className="safety-item-icon contact-icon">
                ♡
              </div>

              <div className="safety-item-text">

                <strong>
                  Trusted contacts
                </strong>

                <span>
                  People ready to hear from you
                </span>

              </div>

              <span className="safety-item-arrow">
                →
              </span>

            </button>

            <button
              type="button"
              className="safety-item"
              onClick={handlePlanJourney}
            >

              <div className="safety-item-icon journey-icon">
                ◷
              </div>

              <div className="safety-item-text">

                <strong>
                  Recent journeys
                </strong>

                <span>
                  View where you've been
                </span>

              </div>

              <span className="safety-item-arrow">
                →
              </span>

            </button>

          </div>

        </section>

        {/* =================================
            EMERGENCY
        ================================= */}
              <section className="home-emergency-section">
      <div className="home-emergency-copy">
        <span className="home-emergency-eyebrow">
          NEED HELP?
        </span>

        <h3>I feel unsafe.</h3>

        <p>
          Alert your trusted contacts and share your
          current situation.
        </p>
      </div>

      <EmergencyButton compact />
    </section>

      </section>

      {/* =================================
          BOTTOM NAVIGATION
      ================================= */}

      <nav className="bottom-nav">

        <button
          type="button"
          className="nav-item active"
          onClick={() => {
            window.location.href = "/home";
          }}
        >
          <span className="nav-icon">
            ◉
          </span>

          <span>
            Home
          </span>
        </button>

        <button
          type="button"
          className="nav-item"
          onClick={handlePlanJourney}
        >
          <span className="nav-icon">
            ⌖
          </span>

          <span>
            Journey
          </span>
        </button>

        <button
          type="button"
          className="nav-item"
          onClick={handleProfile}
        >
          <span className="nav-icon">
            ○
          </span>

          <span>
            Profile
          </span>
        </button>

      </nav>

      {/* =================================
          EMERGENCY ALERT
      ================================= */}

      <EmergencyAlert
        open={showEmergencyAlert}
        onClose={handleCloseEmergency}
        onConfirm={handleConfirmEmergency}
      />

    </main>
  );
}

export default Home;

