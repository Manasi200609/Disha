import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Login.css';

function Login({
  darkMode,
  toggleDarkMode,
}) {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Authentication will be connected to the backend later.
    console.log(
      isSignUp ? 'Sign up:' : 'Login:',
      formData
    );

    navigate('/home');
  };

  return (
    <main className="login-page">

      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <section className="login-content">

        {/* =========================================
            BACK
        ========================================== */}

        <button
          type="button"
          className="login-back-button"
          onClick={() => navigate(-1)}
        >
          <span>←</span>
          Back
        </button>


        {/* =========================================
            INTRO
        ========================================== */}

        <div className="login-intro">

          <span className="login-eyebrow">
            {isSignUp
              ? 'WELCOME TO DISHA'
              : 'WELCOME BACK'}
          </span>

          <h1>
            {isSignUp ? (
              <>
                Let&apos;s make your
                <br />
                <em>journeys safer.</em>
              </>
            ) : (
              <>
                Good to see
                <br />
                <em>you again.</em>
              </>
            )}
          </h1>

          <p>
            {isSignUp
              ? 'Create your Disha account and build your personal safety network.'
              : 'Sign in to continue your journey with Disha.'}
          </p>

        </div>


        {/* =========================================
            FORM
        ========================================== */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {isSignUp && (
            <div className="login-field">

              <label htmlFor="name">
                Your name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="What should we call you?"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />

            </div>
          )}


          <div className="login-field">

            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

          </div>


          <div className="login-field">

            <label htmlFor="password">
              Password
            </label>

            <div className="login-password-wrapper">

              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={
                  isSignUp
                    ? 'new-password'
                    : 'current-password'
                }
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? '◉' : '○'}
              </button>

            </div>

          </div>


          {!isSignUp && (
            <button
              type="button"
              className="login-forgot"
              onClick={() => {
                console.log('Forgot password');
              }}
            >
              Forgot password?
            </button>
          )}


          {/* =======================================
              SUBMIT
          ======================================== */}

          <button
            type="submit"
            className="login-submit"
          >
            <span>
              {isSignUp
                ? 'Create my account'
                : 'Continue to Disha'}
            </span>

            <span className="login-submit-arrow">
              →
            </span>
          </button>

        </form>


        {/* =========================================
            DIVIDER
        ========================================== */}

        <div className="login-divider">
          <span />
          <small>or</small>
          <span />
        </div>


        {/* =========================================
            DEMO / GUEST
        ========================================== */}

        <button
          type="button"
          className="login-guest"
          onClick={() => navigate('/home')}
        >
          Continue as guest
        </button>


        {/* =========================================
            SWITCH LOGIN / SIGNUP
        ========================================== */}

        <div className="login-switch">

          <span>
            {isSignUp
              ? 'Already have an account?'
              : "Don't have an account?"}
          </span>

          <button
            type="button"
            onClick={() =>
              setIsSignUp((previous) => !previous)
            }
          >
            {isSignUp
              ? 'Sign in'
              : 'Create one'}
          </button>

        </div>


        {/* =========================================
            PRIVACY
        ========================================== */}

        <p className="login-privacy">
          Your safety data stays yours.
          Disha only uses what is needed
          to keep your journey protected.
        </p>

      </section>

    </main>
  );
}

export default Login;