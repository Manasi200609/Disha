import { useCallback, useState } from "react";

// ============================================================
// DISHA — LOCATION HOOK
// DEMO MODE
// ============================================================

// Temporary Pune location for laptop/demo testing.
// We will replace this with real GPS later.

const DEMO_LOCATION = {
  latitude: 18.4575,
  longitude: 73.8078,
  accuracy: 10,
};

export default function useLocation() {
  const [location, setLocation] =
    useState(DEMO_LOCATION);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    // --------------------------------------------------------
    // DEMO MODE
    // --------------------------------------------------------

    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    setLocation(DEMO_LOCATION);

    setLoading(false);

    return DEMO_LOCATION;
  }, []);

  return {
    location,
    loading,
    error,
    getLocation,
  };
}