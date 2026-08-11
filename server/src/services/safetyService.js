// ============================================================
// DISHA - SAFETY SERVICE
// ============================================================
//
// This service calculates safety-related signals for a route.
// It is intentionally independent of Google Maps billing/APIs.
//
// The service can later be connected to:
// - crime/incident datasets
// - lighting data
// - pedestrian activity
// - police stations
// - hospitals
// - public places
// - emergency help points
//
// For now, it provides a reliable demo implementation.
// ============================================================


/**
 * Clamp a number between a minimum and maximum value.
 */
const clamp = (value, min = 0, max = 100) => {
  return Math.max(min, Math.min(max, value));
};


/**
 * Convert a value to a safe number.
 */
const safeNumber = (value, fallback = 0) => {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};


/**
 * Calculate a safety score from individual safety signals.
 *
 * Higher values mean safer conditions.
 */
export const calculateSafetyScore = ({
  activityScore = 70,
  helpScore = 70,
  incidentScore = 70,
  lightingScore = 70,
}) => {

  const activity = clamp(
    safeNumber(activityScore, 70)
  );

  const help = clamp(
    safeNumber(helpScore, 70)
  );

  const incidents = clamp(
    safeNumber(incidentScore, 70)
  );

  const lighting = clamp(
    safeNumber(lightingScore, 70)
  );


  /*
   * Weighting:
   *
   * Pedestrian activity  -> 25%
   * Help availability    -> 25%
   * Incident history     -> 30%
   * Lighting             -> 20%
   */

  const score =
    activity * 0.25 +
    help * 0.25 +
    incidents * 0.30 +
    lighting * 0.20;


  return Math.round(
    clamp(score)
  );
};


/**
 * Generate a human-readable safety label.
 */
export const getSafetyLevel = (score) => {

  const value = clamp(
    safeNumber(score)
  );


  if (value >= 85) {
    return "HIGH";
  }

  if (value >= 70) {
    return "MODERATE";
  }

  if (value >= 50) {
    return "LOW";
  }

  return "VERY_LOW";
};


/**
 * Generate safety signals for a route.
 *
 * This is currently demo logic.
 *
 * Later, these values can come from real datasets/API
 * integrations without changing the controller.
 */
export const analyzeRouteSafety = (route = {}) => {

  const distanceKm = Math.max(
    0,
    safeNumber(route.distanceKm, 0)
  );


  /*
   * Demo baseline values.
   */
  let activityScore = 78;
  let helpScore = 76;
  let incidentScore = 82;
  let lightingScore = 80;


  /*
   * Slightly reduce scores for unusually long routes.
   *
   * This is only a demo heuristic.
   */
  if (distanceKm > 5) {
    activityScore -= 8;
    helpScore -= 6;
    lightingScore -= 5;
  }


  if (distanceKm > 8) {
    activityScore -= 8;
    helpScore -= 8;
    lightingScore -= 7;
  }


  /*
   * Prevent values from leaving 0-100.
   */
  activityScore = clamp(activityScore);
  helpScore = clamp(helpScore);
  incidentScore = clamp(incidentScore);
  lightingScore = clamp(lightingScore);


  const safetyScore =
    calculateSafetyScore({
      activityScore,
      helpScore,
      incidentScore,
      lightingScore,
    });


  const safetyLevel =
    getSafetyLevel(safetyScore);


  return {

    safetyScore,

    safetyLevel,

    signals: {

      activityScore,

      helpScore,

      incidentScore,

      lightingScore,

    },

  };
};


/**
 * Compare two routes based on safety.
 *
 * Returns the safer route first.
 */
export const rankRoutesBySafety = (
  routes = []
) => {

  if (!Array.isArray(routes)) {
    return [];
  }


  return [...routes].sort(
    (a, b) => {

      const scoreA =
        safeNumber(a.safetyScore, 0);

      const scoreB =
        safeNumber(b.safetyScore, 0);

      return scoreB - scoreA;
    }
  );
};


/**
 * Add safety information to a route.
 */
export const enrichRouteWithSafety = (
  route = {}
) => {

  const safety =
    analyzeRouteSafety(route);


  return {

    ...route,

    safetyScore:
      safety.safetyScore,

    safetyLevel:
      safety.safetyLevel,

    activityScore:
      safety.signals.activityScore,

    helpScore:
      safety.signals.helpScore,

    incidentScore:
      safety.signals.incidentScore,

    lightingScore:
      safety.signals.lightingScore,

  };
};


/**
 * Analyze multiple routes.
 */
export const analyzeRoutesSafety = (
  routes = []
) => {

  if (!Array.isArray(routes)) {
    return [];
  }


  const enrichedRoutes =
    routes.map(
      enrichRouteWithSafety
    );


  return rankRoutesBySafety(
    enrichedRoutes
  );
};


/**
 * Generate a simple explanation for why
 * a route is considered safer.
 */
export const generateSafetyExplanation = (
  route = {}
) => {

  const score =
    safeNumber(
      route.safetyScore,
      0
    );


  const activity =
    safeNumber(
      route.activityScore,
      0
    );


  const help =
    safeNumber(
      route.helpScore,
      0
    );


  const incidents =
    safeNumber(
      route.incidentScore,
      0
    );


  const lighting =
    safeNumber(
      route.lightingScore,
      0
    );


  const reasons = [];


  if (activity >= 75) {
    reasons.push(
      "good pedestrian activity"
    );
  }


  if (help >= 75) {
    reasons.push(
      "nearby help infrastructure"
    );
  }


  if (incidents >= 75) {
    reasons.push(
      "lower incident risk"
    );
  }


  if (lighting >= 75) {
    reasons.push(
      "better lighting conditions"
    );
  }


  let description;


  if (reasons.length > 0) {

    description =
      `This route has ${reasons.join(", ")}.`;

  } else {

    description =
      "This route has limited positive safety signals.";

  }


  return {

    title:
      score >= 85
        ? "Recommended safer route"
        : score >= 70
        ? "Moderately safer route"
        : "Use caution on this route",

    description,

  };
};


/**
 * Default export
 *
 * Useful if another service wants to import
 * the complete safety service as one object.
 */
export default {

  calculateSafetyScore,

  getSafetyLevel,

  analyzeRouteSafety,

  rankRoutesBySafety,

  enrichRouteWithSafety,

  analyzeRoutesSafety,

  generateSafetyExplanation,

};