// =========================================================
// DISHA — USE JOURNEY HOOK
// Handles active journey state and journey API operations
// =========================================================

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getActiveJourney,
  getJourney,
  startJourney,
  updateJourneyLocation,
  checkInJourney,
  endJourney,
} from '../services/journeyServices';


function useJourney(journeyId = null) {

  // =======================================================
  // STATE
  // =======================================================

  const [journey, setJourney] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [isActive, setIsActive] = useState(false);

  const mountedRef = useRef(true);


  // =======================================================
  // CLEANUP
  // =======================================================

  useEffect(() => {

    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };

  }, []);


  // =======================================================
  // LOAD JOURNEY
  // =======================================================

  const loadJourney = useCallback(
    async (id = journeyId) => {

      if (!id) {
        setError('Journey ID is required.');
        return null;
      }

      setLoading(true);
      setError(null);

      try {

        const response =
          await getJourney(id);

        const journeyData =
          response?.journey ||
          response?.data ||
          response;

        if (mountedRef.current) {

          setJourney(journeyData);

          setIsActive(
            journeyData?.status === 'active'
          );
        }

        return journeyData;

      } catch (err) {

        if (mountedRef.current) {
          setError(
            err.message ||
            'Unable to load journey.'
          );
        }

        return null;

      } finally {

        if (mountedRef.current) {
          setLoading(false);
        }

      }

    },
    [journeyId]
  );


  // =======================================================
  // LOAD CURRENT ACTIVE JOURNEY
  // =======================================================

  const loadActiveJourney = useCallback(
    async () => {

      setLoading(true);
      setError(null);

      try {

        const response =
          await getActiveJourney();

        const journeyData =
          response?.journey ||
          response?.data ||
          response;

        if (mountedRef.current) {

          setJourney(
            journeyData || null
          );

          setIsActive(
            journeyData?.status === 'active'
          );
        }

        return journeyData;

      } catch (err) {

        if (mountedRef.current) {
          setError(
            err.message ||
            'Unable to load active journey.'
          );
        }

        return null;

      } finally {

        if (mountedRef.current) {
          setLoading(false);
        }

      }

    },
    []
  );


  // =======================================================
  // START JOURNEY
  // =======================================================

  const beginJourney = useCallback(
    async (journeyData) => {

      setLoading(true);
      setError(null);

      try {

        const response =
          await startJourney(journeyData);

        const newJourney =
          response?.journey ||
          response?.data ||
          response;

        if (mountedRef.current) {

          setJourney(newJourney);

          setIsActive(true);
        }

        return newJourney;

      } catch (err) {

        if (mountedRef.current) {
          setError(
            err.message ||
            'Unable to start journey.'
          );
        }

        throw err;

      } finally {

        if (mountedRef.current) {
          setLoading(false);
        }

      }

    },
    []
  );


  // =======================================================
  // UPDATE JOURNEY LOCATION
  // =======================================================

  const updateLocation = useCallback(
    async (location) => {

      if (!journey?._id && !journey?.id) {
        return null;
      }

      const id =
        journey._id ||
        journey.id;

      try {

        const response =
          await updateJourneyLocation(
            id,
            location
          );

        const updatedJourney =
          response?.journey ||
          response?.data;

        if (
          mountedRef.current &&
          updatedJourney
        ) {
          setJourney(updatedJourney);
        }

        return response;

      } catch (err) {

        console.error(
          'Journey location update failed:',
          err
        );

        return null;
      }

    },
    [journey]
  );


  // =======================================================
  // CHECK IN
  // =======================================================

  const checkIn = useCallback(
    async (message = null) => {

      if (!journey?._id && !journey?.id) {
        throw new Error(
          'No active journey found.'
        );
      }

      const id =
        journey._id ||
        journey.id;

      try {

        const response =
          await checkInJourney(
            id,
            message
          );

        const updatedJourney =
          response?.journey ||
          response?.data;

        if (
          mountedRef.current &&
          updatedJourney
        ) {
          setJourney(updatedJourney);
        }

        return response;

      } catch (err) {

        if (mountedRef.current) {
          setError(
            err.message ||
            'Unable to complete check-in.'
          );
        }

        throw err;
      }

    },
    [journey]
  );


  // =======================================================
  // END JOURNEY
  // =======================================================

  const finishJourney = useCallback(
    async () => {

      if (!journey?._id && !journey?.id) {
        throw new Error(
          'No active journey found.'
        );
      }

      const id =
        journey._id ||
        journey.id;

      setLoading(true);
      setError(null);

      try {

        const response =
          await endJourney(id);

        const finishedJourney =
          response?.journey ||
          response?.data ||
          response;

        if (mountedRef.current) {

          setJourney(
            finishedJourney
          );

          setIsActive(false);
        }

        return finishedJourney;

      } catch (err) {

        if (mountedRef.current) {
          setError(
            err.message ||
            'Unable to end journey.'
          );
        }

        throw err;

      } finally {

        if (mountedRef.current) {
          setLoading(false);
        }

      }

    },
    [journey]
  );


  // =======================================================
  // AUTOMATIC LOAD
  // =======================================================

  useEffect(() => {

    if (journeyId) {
      loadJourney(journeyId);
    }

  }, [
    journeyId,
    loadJourney,
  ]);


  // =======================================================
  // RETURN
  // =======================================================

  return {

    // Data
    journey,

    // State
    loading,
    error,
    isActive,

    // Actions
    loadJourney,
    loadActiveJourney,
    beginJourney,
    updateLocation,
    checkIn,
    finishJourney,

  };
}


export default useJourney;