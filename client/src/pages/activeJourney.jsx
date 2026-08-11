import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from '../components/Navbar';
import MapView from '../components/MapView';
import JourneyStatus from '../components/JourneyStatus';
import EmergencyButton from '../components/EmergencyButton';
import CheckInModal from '../components/CheckInModal';

import useLocation from '../hooks/useLocation';
import useJourney from '../hooks/useJourney';

import './ActiveJourney.css';


function ActiveJourney({
  darkMode,
  toggleDarkMode,
}) {

  const navigate = useNavigate();
  const { journeyId } = useParams();

  // =====================================================
  // JOURNEY
  // =====================================================

  const {
    journey,
    loading: journeyLoading,
    error: journeyError,
    loadActiveJourney,
    beginJourney,
    updateLocation,
    checkIn,
    finishJourney,
    isActive,
  } = useJourney(
    journeyId !== 'new'
      ? journeyId
      : null
  );


  // =====================================================
  // LOCATION
  // =====================================================

  const {
    location,
    error: locationError,
  } = useLocation({
    watch: true,
    sendToServer: false,
  });


  // =====================================================
  // UI STATE
  // =====================================================

  const [
    showCheckIn,
    setShowCheckIn,
  ] = useState(false);

  const [
    journeyStarted,
    setJourneyStarted,
  ] = useState(false);

  const [
    endingJourney,
    setEndingJourney,
  ] = useState(false);

  const [
    journeyErrorMessage,
    setJourneyErrorMessage,
  ] = useState(null);


  // =====================================================
  // LOAD ACTIVE JOURNEY
  // =====================================================

  useEffect(() => {

    if (journeyId === 'new') {
      return;
    }

    if (!journeyId) {
      loadActiveJourney();
    }

  }, [
    journeyId,
    loadActiveJourney,
  ]);


  // =====================================================
  // SYNC LOCATION WITH JOURNEY
  // =====================================================

  useEffect(() => {

    if (!location) {
      return;
    }

    if (!isActive) {
      return;
    }

    updateLocation(location);

  }, [
    location,
    isActive,
    updateLocation,
  ]);


  // =====================================================
  // START NEW JOURNEY
  // =====================================================

  const handleStartJourney = async () => {

    setJourneyErrorMessage(null);

    try {

      /*
       * The route-selection screen will eventually
       * pass the actual route here.
       *
       * For now this remains a backend connection point.
       */

      if (!location) {
        setJourneyErrorMessage(
          'Waiting for your current location...'
        );

        return;
      }

      await beginJourney({
        origin: location,
        destination:
          journey?.destination || null,
        routeId:
          journey?.routeId || null,
        travelMode: 'WALKING',
      });

      setJourneyStarted(true);

    } catch (error) {

      setJourneyErrorMessage(
        error.message ||
        'Unable to start the journey.'
      );

    }
  };


  // =====================================================
  // CHECK IN
  // =====================================================

  const handleCheckIn = async (
    message
  ) => {

    try {

      await checkIn(
        message || 'I am safe.'
      );

      setShowCheckIn(false);

    } catch (error) {

      setJourneyErrorMessage(
        error.message ||
        'Unable to complete check-in.'
      );

    }

  };


  // =====================================================
  // END JOURNEY
  // =====================================================

  const handleEndJourney = async () => {

    if (endingJourney) {
      return;
    }

    setEndingJourney(true);

    try {

      await finishJourney();

      navigate('/home');

    } catch (error) {

      setJourneyErrorMessage(
        error.message ||
        'Unable to end journey.'
      );

    } finally {

      setEndingJourney(false);

    }
  };


  // =====================================================
  // MAP DATA
  // =====================================================

  const route =
    journey?.route ||
    null;

  const destination =
    journey?.destinationCoordinates ||
    journey?.destinationLocation ||
    null;


  // =====================================================
  // JOURNEY STATUS
  // =====================================================

  const currentStatus =
    journey?.safetyStatus ||
    journey?.status ||
    (
      isActive
        ? 'active'
        : 'ready'
    );


  // =====================================================
  // LOADING
  // =====================================================

  if (
    journeyLoading &&
    !journey &&
    journeyId !== 'new'
  ) {

    return (
      <main className="active-journey-page">

        <Navbar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="journey-loading">

          <div className="journey-spinner" />

          <p>
            Loading your journey...
          </p>

        </div>

      </main>
    );
  }


  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="active-journey-page">

      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />


      <section className="active-journey-content">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="active-journey-header">

          <button
            type="button"
            className="journey-back-button"
            onClick={() => navigate('/home')}
          >
            ←
          </button>

          <div>

            <span className="journey-eyebrow">
              {isActive
                ? 'JOURNEY IN PROGRESS'
                : 'YOUR JOURNEY'}
            </span>

            <h1>
              Stay
              <em> safe.</em>
            </h1>

          </div>

        </div>


        {/* =================================================
            MAP
        ================================================= */}

        <section className="journey-map-container">

          <MapView
            location={location}
            route={route}
            destination={destination}
            height="100%"
          />

          {/* LOCATION INDICATOR */}

          <div className="journey-location-indicator">

            <span />

            {location
              ? 'Live location'
              : 'Locating you...'}
          </div>

        </section>


        {/* =================================================
            JOURNEY INFO
        ================================================= */}

        <section className="journey-info">

          <div className="journey-destination">

            <span>
              DESTINATION
            </span>

            <strong>
              {journey?.destinationName ||
                journey?.destination ||
                'Your destination'}
            </strong>

          </div>


          <div className="journey-time">

            <span>
              ETA
            </span>

            <strong>
              {journey?.eta ||
                journey?.estimatedArrival ||
                '--'}
            </strong>

          </div>

        </section>


        {/* =================================================
            STATUS
        ================================================= */}

        <JourneyStatus
          journey={journey}
          status={currentStatus}
          location={location}
        />


        {/* =================================================
            ERRORS
        ================================================= */}

        {(journeyError ||
          locationError ||
          journeyErrorMessage) && (

          <div className="journey-error">

            <span>!</span>

            <p>
              {journeyErrorMessage ||
                journeyError ||
                locationError}
            </p>

          </div>

        )}


        {/* =================================================
            ACTIONS
        ================================================= */}

        <section className="journey-actions">


          {/* START */}

          {!isActive &&
            !journeyStarted && (

            <button
              type="button"
              className="start-journey-button"
              onClick={
                handleStartJourney
              }
              disabled={
                journeyLoading ||
                !location
              }
            >

              {journeyLoading
                ? 'Starting...'
                : 'Start journey'}

              <span>
                →
              </span>

            </button>

          )}


          {/* ACTIVE JOURNEY */}

          {(isActive ||
            journeyStarted) && (

            <>

              <button
                type="button"
                className="check-in-button"
                onClick={() =>
                  setShowCheckIn(true)
                }
              >
                Check in — I'm safe
              </button>


              <button
                type="button"
                className="end-journey-button"
                onClick={
                  handleEndJourney
                }
                disabled={endingJourney}
              >
                {endingJourney
                  ? 'Ending journey...'
                  : 'End journey'}
              </button>

            </>

          )}

        </section>


        {/* =================================================
            EMERGENCY
        ================================================= */}

        <div className="journey-emergency">

          <EmergencyButton
            journey={journey}
            location={location}
          />

        </div>

      </section>


      {/* =================================================
          CHECK-IN MODAL
      ================================================= */}

      {showCheckIn && (

        <CheckInModal
          onClose={() =>
            setShowCheckIn(false)
          }
          onSubmit={
            handleCheckIn
          }
        />

      )}

    </main>
  );
}


export default ActiveJourney;