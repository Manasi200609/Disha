export default function decodePolyline(encoded) {

  if (
    !encoded ||
    typeof encoded !== "string"
  ) {
    return [];
  }


  const points = [];

  let index = 0;

  let lat = 0;
  let lng = 0;


  while (index < encoded.length) {

    let result = 0;
    let shift = 0;
    let byte;


    do {

      byte =
        encoded.charCodeAt(index++) - 63;

      result |=
        (byte & 0x1f) << shift;

      shift += 5;

    } while (byte >= 0x20);


    const latitudeChange =
      result & 1
        ? ~(result >> 1)
        : result >> 1;


    lat += latitudeChange;


    result = 0;
    shift = 0;


    do {

      byte =
        encoded.charCodeAt(index++) - 63;

      result |=
        (byte & 0x1f) << shift;

      shift += 5;

    } while (byte >= 0x20);


    const longitudeChange =
      result & 1
        ? ~(result >> 1)
        : result >> 1;


    lng += longitudeChange;


    points.push({
      lat: lat / 1e5,
      lng: lng / 1e5,
    });
  }


  return points;
}