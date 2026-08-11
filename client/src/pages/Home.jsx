import { useState } from "react";
import EmergencyAlert from "../components/EmergencyAlert";
import "./Home.css";

function Home({ darkMode, toggleDarkMode }) {

  // =====================================================
  // STATE
  // =====================================================

  const [showEmergencyAlert, setShowEmergencyAlert] =
    useState(false);


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
  // RENDER
  // =====================================================

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

            <h2>
              Disha
            </h2>

          </div>

        </div>


        <div className="home-header-actions">

          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀" : "☾"}
          </button>


          <button
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

            <span>
              headed today?
            </span>

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


          {/* CURRENT LOCATION */}

          <div className="journey-location">

            <div className="location-icon">
              <span />
            </div>


            <div className="location-content">

              <span>
                FROM
              </span>


              <strong>
                Your current location
              </strong>

            </div>

          </div>



          <div className="location-line">
            <span />
          </div>



          {/* DESTINATION */}

          <button
            className="destination-input"
            onClick={handlePlanJourney}
          >

            <div className="destination-icon">
              <span />
            </div>


            <div className="destination-content">

              <span>
                TO
              </span>


              <strong>
                Where do you want to go?
              </strong>

            </div>


            <span className="destination-arrow">
              →
            </span>

          </button>



          {/* PLAN SAFE ROUTE */}

          <button
            className="btn btn-primary plan-button"
            onClick={handlePlanJourney}
          >

            Plan a safe route

            <span>
              →
            </span>

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


            {/* TRUSTED CONTACTS */}

            <button
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



            {/* RECENT JOURNEYS */}

            <button
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

        <section className="emergency-section">

          <button
            className="emergency-button"
            onClick={() =>
              setShowEmergencyAlert(true)
            }
          >

            <span className="emergency-icon">
              !
            </span>


            <span className="emergency-content">

              <strong>
                I feel unsafe
              </strong>


              <small>
                Get immediate help
              </small>

            </span>


            <span className="emergency-arrow">
              →
            </span>

          </button>

        </section>


      </section>



      {/* =================================
          BOTTOM NAVIGATION
      ================================= */}

      <nav className="bottom-nav">


        {/* HOME */}

        <button
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



        {/* JOURNEY */}

        <button
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



        {/* PROFILE */}

        <button
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
          EMERGENCY ALERT MODAL
      ================================= */}

      {showEmergencyAlert && (

        <EmergencyAlert
          onClose={() =>
            setShowEmergencyAlert(false)
          }
        />

      )}

    </main>
  );
}


export default Home;