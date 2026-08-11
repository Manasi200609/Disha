// =========================================================
// DISHA — JOURNEY SERVICES
// Handles journey-related communication with the backend
// =========================================================

import {
  apiGet,
  apiPost,
  apiPatch,
} from './api';


// =========================================================
// GET ACTIVE JOURNEY
// =========================================================

export async function getActiveJourney() {
  return apiGet('/journeys/active');
}


// =========================================================
// GET JOURNEY BY ID
// =========================================================

export async function getJourney(journeyId) {
  if (!journeyId) {
    throw new Error('Journey ID is required.');
  }

  return apiGet(`/journeys/${journeyId}`);
}


// =========================================================
// START JOURNEY
// =========================================================

export async function startJourney({
  origin,
  destination,
  routeId = null,
  travelMode = 'WALKING',
} = {}) {

  if (!origin) {
    throw new Error(
      'Starting location is required.'
    );
  }

  if (!destination) {
    throw new Error(
      'Destination is required.'
    );
  }

  return apiPost('/journeys/start', {
    origin,
    destination,
    routeId,
    travelMode,
  });
}


// =========================================================
// UPDATE JOURNEY LOCATION
// =========================================================

export async function updateJourneyLocation(
  journeyId,
  location
) {

  if (!journeyId) {
    throw new Error(
      'Journey ID is required.'
    );
  }

  if (
    !location ||
    typeof location.latitude !== 'number' ||
    typeof location.longitude !== 'number'
  ) {
    throw new Error(
      'Valid location is required.'
    );
  }

  return apiPatch(
    `/journeys/${journeyId}/location`,
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
// CHECK IN
// =========================================================

export async function checkInJourney(
  journeyId,
  message = null
) {

  if (!journeyId) {
    throw new Error(
      'Journey ID is required.'
    );
  }

  return apiPost(
    `/journeys/${journeyId}/check-in`,
    {
      message,
    }
  );
}


// =========================================================
// END JOURNEY
// =========================================================

export async function endJourney(
  journeyId
) {

  if (!journeyId) {
    throw new Error(
      'Journey ID is required.'
    );
  }

  return apiPost(
    `/journeys/${journeyId}/end`
  );
}