import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Home from './pages/Home';
import RouteSelection from './pages/RouteSelection';
import ActiveJourney from './pages/ActiveJourney';
import Profile from './pages/Profile';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('disha-theme');

    if (savedTheme) {
      return savedTheme === 'dark';
    }

    return false;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );

    localStorage.setItem(
      'disha-theme',
      darkMode ? 'dark' : 'light'
    );
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((previous) => !previous);
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route
          path="/"
          element={
            <Landing
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        {/* Authentication */}
        <Route
          path="/login"
          element={
            <Login
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        {/* Main App */}
        <Route
          path="/home"
          element={
            <Home
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        {/* Route Planning */}
        <Route
          path="/routes"
          element={
            <RouteSelection
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        {/* Active Journey */}
        <Route
          path="/journey/:journeyId"
          element={
            <ActiveJourney
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <Profile
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;