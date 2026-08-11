import { useNavigate, useLocation } from 'react-router-dom';

import './Navbar.css';

function Navbar({ darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="disha-navbar">

      {/* Brand */}

      <button
        className="navbar-brand"
        onClick={() => navigate('/home')}
      >
        <div className="navbar-logo">
          D
        </div>

        <span>DISHA</span>
      </button>


      {/* Navigation */}

      <div className="navbar-links">

        <button
          className={`navbar-link ${
            isActive('/home') ? 'active' : ''
          }`}
          onClick={() => navigate('/home')}
        >
          <span className="navbar-icon">⌂</span>
          <span>Home</span>
        </button>


        <button
          className={`navbar-link ${
            isActive('/routes') ? 'active' : ''
          }`}
          onClick={() => navigate('/routes')}
        >
          <span className="navbar-icon">⌁</span>
          <span>Routes</span>
        </button>


        <button
          className={`navbar-link ${
            isActive('/profile') ? 'active' : ''
          }`}
          onClick={() => navigate('/profile')}
        >
          <span className="navbar-icon">◯</span>
          <span>Profile</span>
        </button>

      </div>


      {/* Theme */}

      <button
        className="navbar-theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
      >
        <span className="theme-icon">
          {darkMode ? '☀' : '☾'}
        </span>

        <span className="theme-label">
          {darkMode ? 'Light' : 'Dark'}
        </span>
      </button>

    </nav>
  );
}

export default Navbar;