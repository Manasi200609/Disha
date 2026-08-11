import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

import "./MapView.css";

const containerStyle = {
  width: "100%",
  height: "480px",
};

const defaultCenter = {
  lat: 18.5204,
  lng: 73.8567,
};

function MapView({
  location,
  routes = [],
  selectedRoute,
  onSelectRoute,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return (
      <div className="map-error">
        <strong>Unable to load Google Maps</strong>
        <span>
          Please check your Google Maps API key.
        </span>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="map-loading">
        <div className="map-spinner" />
        <span>Loading map...</span>
      </div>
    );
  }

  const center = location
    ? {
        lat: location.latitude,
        lng: location.longitude,
      }
    : defaultCenter;

  return (
    <div className="map-container">

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          gestureHandling: "greedy",
        }}
      >

        {/* CURRENT LOCATION */}

        {location && (
          <Marker
            position={{
              lat: location.latitude,
              lng: location.longitude,
            }}
            title="Your current location"
          />
        )}

        {/* ROUTES */}

        {routes.map((route) => {
          if (
            !route.decodedPath ||
            route.decodedPath.length === 0
          ) {
            return null;
          }

          const isSelected =
            selectedRoute?.routeId ===
            route.routeId;

          return (
            <Polyline
              key={
                route.routeId ||
                route.id ||
                route._id
              }
              path={route.decodedPath}
              options={{
                strokeColor: isSelected
                  ? "#A85D47"
                  : "#9B8B83",

                strokeOpacity: isSelected
                  ? 1
                  : 0.55,

                strokeWeight: isSelected
                  ? 6
                  : 4,

                clickable: true,

                zIndex: isSelected
                  ? 10
                  : 1,
              }}
              onClick={() => {
                onSelectRoute?.(route);
              }}
            />
          );
        })}

      </GoogleMap>

      {/* LEGEND */}

      {routes.length > 0 && (
        <div className="map-legend">

          <div className="map-legend-item">
            <span className="legend-line selected" />
            Selected route
          </div>

          <div className="map-legend-item">
            <span className="legend-line alternative" />
            Alternative
          </div>

        </div>
      )}

    </div>
  );
}

export default MapView;