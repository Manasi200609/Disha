import React from 'react';

function Landing({ darkMode, toggleDarkMode }) {
  return (
    <main className="landing-page">
      <div className="landing-container">

        {/* Top Bar */}
        <header className="landing-header">
          <div className="brand">
            <div className="brand-mark">
              D
            </div>

            <span className="brand-name">
              Disha
            </span>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀' : '☾'}
          </button>
        </header>

        {/* Hero */}
        <section className="landing-hero">

          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            YOUR JOURNEY. YOUR SAFETY.
          </div>

          <h1>
            Move freely.
            <br />
            <span>Know you're not alone.</span>
          </h1>

          <p className="hero-description">
            Disha helps you choose safer routes, stay connected
            during your journey, and reach your destination
            with confidence.
          </p>

          {/* Main CTA */}
          <button
            className="btn btn-primary landing-cta"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            Get started
            <span className="cta-arrow">→</span>
          </button>

          <p className="hero-note">
            Built for everyday journeys.
          </p>

        </section>

        {/* Visual Safety Statement */}
        <section className="landing-message">

          <div className="message-line" />

          <div>
            <p className="message-label">
              DISHA
            </p>

            <p className="message-text">
              Because getting home safely
              should never be something
              you have to think twice about.
            </p>
          </div>

        </section>

        {/* Bottom reassurance */}
        <footer className="landing-footer">
          <span>Private</span>
          <span className="footer-dot">•</span>
          <span>Personal</span>
          <span className="footer-dot">•</span>
          <span>Always with you</span>
        </footer>

      </div>
    </main>
  );
}

export default Landing;