const checkRouteDeviation = ({
  currentLocation,
  expectedLocation,
  thresholdKm = 0.5
}) => {
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const earthRadius = 6371;

  const dLat = toRadians(
    currentLocation.latitude -
    expectedLocation.latitude
  );

  const dLon = toRadians(
    currentLocation.longitude -
    expectedLocation.longitude
  );

  const lat1 = toRadians(expectedLocation.latitude);
  const lat2 = toRadians(currentLocation.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  const distanceKm = earthRadius * c;

  return {
    deviated: distanceKm > thresholdKm,
    distanceKm: Number(distanceKm.toFixed(2)),
    thresholdKm
  };
};

export {
  checkRouteDeviation
};