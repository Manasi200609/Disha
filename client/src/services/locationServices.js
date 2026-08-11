// =========================================================
// DISHA — LOCATION SERVICES
// Handles real device/browser GPS location
// =========================================================

import { apiGet, apiPost } from './api';


// =========================================================
// GET CURRENT DEVICE LOCATION
// =========================================================

export function getCurrentDeviceLocation() {
  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {
      reject(
        new Error(
          'Geolocation is not supported by this device.'
        )
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } =
          position.coords;

        resolve({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp,
        });
      },

      (error) => {
        let message =
          'Unable to get your current location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              'Location permission was denied.';
            break;

          case error.POSITION_UNAVAILABLE:
            message =
              'Your location is currently unavailable.';
            break;

          case error.TIMEOUT:
            message =
              'Location request timed out.';
            break;

          default:
            break;
        }

        reject(new Error(message));
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  });
}


// =========================================================
// WATCH DEVICE LOCATION
// Used during an active journey
// =========================================================

export function watchDeviceLocation(
  onLocationUpdate,
  onError
) {
  if (!navigator.geolocation) {
    onError?.(
      new Error(
        'Geolocation is not supported by this device.'
      )
    );

    return null;
  }

  const watchId =
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } =
          position.coords;

        onLocationUpdate?.({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp,
        });
      },

      (error) => {
        onError?.(error);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000,
      }
    );

  return watchId;
}


// =========================================================
// STOP WATCHING LOCATION
// =========================================================

export function stopWatchingLocation(
  watchId
) {
  if (
    watchId !== null &&
    watchId !== undefined &&
    navigator.geolocation
  ) {
    navigator.geolocation.clearWatch(
      watchId
    );
  }
}


// =========================================================
// SEND CURRENT LOCATION TO BACKEND
// =========================================================

export async function updateUserLocation(
  location
) {
  if (
    !location ||
    typeof location.latitude !== 'number' ||
    typeof location.longitude !== 'number'
  ) {
    throw new Error(
      'Invalid location data.'
    );
  }

  return apiPost(
    '/location/update',
    {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy ?? null,
      timestamp:
        location.timestamp ??
        Date.now(),
    }
  );
}


// =========================================================
// GET SAVED USER LOCATION
// =========================================================

export async function getUserLocation() {
  return apiGet('/location');
}