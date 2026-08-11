// ============================================================
// DISHA - JOURNEY SERVICE
// ============================================================
//
// Handles journey creation, retrieval, updates and completion.
//
// This version is intentionally independent of:
// - Google Places
// - Google Geocoding
// - Google Directions
// - paid APIs
//
// Journey data is kept in memory for now.
// Later, this can be replaced with MongoDB/Firebase without
// changing the route/controller structure too much.
// ============================================================


const journeys = new Map();


// ============================================================
// HELPERS
// ============================================================

const generateJourneyId = () => {
  return `journey-${Date.now()}`;
};


const normalizeCoordinate = (value) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
};


const normalizeLocation = (location) => {
  if (!location) {
    return null;
  }

  const latitude = normalizeCoordinate(
    location.latitude ?? location.lat
  );

  const longitude = normalizeCoordinate(
    location.longitude ?? location.lng
  );

  if (
    latitude === null ||
    longitude === null
  ) {
    return null;
  }

  return {
    latitude,
    longitude,
    accuracy:
      normalizeCoordinate(location.accuracy),
  };
};


// ============================================================
// CREATE JOURNEY
// ============================================================

export const createJourney = async (data = {}) => {

  const {
    destination,
    destinationName,
    destinationAddress,
    destinationLocation,
    origin,
    route,
    routeId,
    travelMode = "WALKING",
    safetyScore,
    userId = "demo-user",
  } = data;


  const finalDestination =
    destination ||
    destinationName ||
    destinationAddress ||
    "Unknown destination";


  const normalizedOrigin =
    normalizeLocation(origin);


  const normalizedDestination =
    normalizeLocation(destinationLocation);


  const journeyId =
    generateJourneyId();


  const now =
    new Date().toISOString();


  const journey = {

    id: journeyId,

    journeyId,

    userId,

    destination:
      finalDestination,

    destinationName:
      destinationName ||
      finalDestination,

    destinationAddress:
      destinationAddress ||
      finalDestination,

    destinationLocation:
      normalizedDestination,

    origin:
      normalizedOrigin,

    route:
      route || null,

    routeId:
      routeId ||
      route?.routeId ||
      null,

    travelMode,

    safetyScore:
      safetyScore ??
      route?.safetyScore ??
      null,

    status: "ACTIVE",

    startedAt: now,

    createdAt: now,

    updatedAt: now,

    completedAt: null,

    emergencyTriggered: false,

    lastLocation: normalizedOrigin,

    locationHistory:
      normalizedOrigin
        ? [
            {
              ...normalizedOrigin,
              timestamp: now,
            },
          ]
        : [],

  };


  journeys.set(
    journeyId,
    journey
  );


  return journey;
};


// ============================================================
// GET JOURNEY
// ============================================================

export const getJourneyById = async (
  journeyId
) => {

  if (!journeyId) {
    return null;
  }


  return journeys.get(
    journeyId
  ) || null;
};


// ============================================================
// GET ALL JOURNEYS
// ============================================================

export const getJourneys = async (
  userId = null
) => {

  const allJourneys =
    Array.from(
      journeys.values()
    );


  if (!userId) {
    return allJourneys;
  }


  return allJourneys.filter(
    (journey) =>
      journey.userId === userId
  );
};


// ============================================================
// UPDATE JOURNEY LOCATION
// ============================================================

export const updateJourneyLocation = async (
  journeyId,
  location
) => {

  const journey =
    journeys.get(journeyId);


  if (!journey) {
    return null;
  }


  const normalizedLocation =
    normalizeLocation(location);


  if (!normalizedLocation) {
    throw new Error(
      "Invalid location."
    );
  }


  const locationUpdate = {

    ...normalizedLocation,

    timestamp:
      new Date().toISOString(),

  };


  journey.lastLocation =
    normalizedLocation;


  journey.locationHistory.push(
    locationUpdate
  );


  journey.updatedAt =
    locationUpdate.timestamp;


  journeys.set(
    journeyId,
    journey
  );


  return journey;
};


// ============================================================
// COMPLETE JOURNEY
// ============================================================

export const completeJourney = async (
  journeyId
) => {

  const journey =
    journeys.get(journeyId);


  if (!journey) {
    return null;
  }


  const now =
    new Date().toISOString();


  journey.status =
    "COMPLETED";


  journey.completedAt =
    now;


  journey.updatedAt =
    now;


  journeys.set(
    journeyId,
    journey
  );


  return journey;
};


// ============================================================
// CANCEL JOURNEY
// ============================================================

export const cancelJourney = async (
  journeyId
) => {

  const journey =
    journeys.get(journeyId);


  if (!journey) {
    return null;
  }


  const now =
    new Date().toISOString();


  journey.status =
    "CANCELLED";


  journey.updatedAt =
    now;


  journeys.set(
    journeyId,
    journey
  );


  return journey;
};


// ============================================================
// TRIGGER EMERGENCY
// ============================================================

export const triggerJourneyEmergency = async (
  journeyId,
  emergencyData = {}
) => {

  const journey =
    journeys.get(journeyId);


  if (!journey) {
    return null;
  }


  const now =
    new Date().toISOString();


  journey.emergencyTriggered =
    true;


  journey.emergency = {

    triggered: true,

    triggeredAt: now,

    reason:
      emergencyData.reason ||
      "User reported feeling unsafe.",

    location:
      normalizeLocation(
        emergencyData.location
      ) ||
      journey.lastLocation ||
      null,

  };


  journey.updatedAt =
    now;


  journeys.set(
    journeyId,
    journey
  );


  return journey;
};


// ============================================================
// CLEAR / RESET EMERGENCY
// ============================================================

export const clearJourneyEmergency = async (
  journeyId
) => {

  const journey =
    journeys.get(journeyId);


  if (!journey) {
    return null;
  }


  journey.emergencyTriggered =
    false;


  journey.emergency =
    null;


  journey.updatedAt =
    new Date().toISOString();


  journeys.set(
    journeyId,
    journey
  );


  return journey;
};


// ============================================================
// DELETE JOURNEY
// ============================================================

export const deleteJourney = async (
  journeyId
) => {

  if (!journeyId) {
    return false;
  }


  return journeys.delete(
    journeyId
  );
};


// ============================================================
// ACTIVE JOURNEYS
// ============================================================

export const getActiveJourneys = async (
  userId = null
) => {

  const allJourneys =
    await getJourneys(userId);


  return allJourneys.filter(
    (journey) =>
      journey.status === "ACTIVE"
  );
};


// ============================================================
// JOURNEY SUMMARY
// ============================================================

export const getJourneySummary = async (
  journeyId
) => {

  const journey =
    await getJourneyById(
      journeyId
    );


  if (!journey) {
    return null;
  }


  return {

    id:
      journey.id,

    destination:
      journey.destination,

    status:
      journey.status,

    travelMode:
      journey.travelMode,

    safetyScore:
      journey.safetyScore,

    emergencyTriggered:
      journey.emergencyTriggered,

    startedAt:
      journey.startedAt,

    completedAt:
      journey.completedAt,

    lastLocation:
      journey.lastLocation,

  };
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default {

  createJourney,

  getJourneyById,

  getJourneys,

  updateJourneyLocation,

  completeJourney,

  cancelJourney,

  triggerJourneyEmergency,

  clearJourneyEmergency,

  deleteJourney,

  getActiveJourneys,

  getJourneySummary,

};