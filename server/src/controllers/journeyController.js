import Journey from "../models/Journey.js";
import TrustedContact from "../models/TrustedContact.js";
import User from "../models/User.js";

import { checkRouteDeviation } from "../services/safetyService.js";
import { sendSafetyAlert } from "../services/notificationService.js";


// START JOURNEY
const startJourney = async (req, res) => {
  try {
    const {
      userId,
      startLocation,
      destination
    } = req.body;

    if (!userId || !startLocation || !destination) {
      return res.status(400).json({
        success: false,
        message: "User, start location and destination are required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const journey = await Journey.create({
      userId,
      startLocation,
      destination,
      currentLocation: {
        latitude: startLocation.latitude,
        longitude: startLocation.longitude,
        updatedAt: new Date()
      },
      locationHistory: [
        {
          latitude: startLocation.latitude,
          longitude: startLocation.longitude
        }
      ],
      status: "active",
      safetyStatus: "normal"
    });

    res.status(201).json({
      success: true,
      message: "Journey started successfully",
      journey
    });

  } catch (error) {
    console.error("Start journey error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to start journey"
    });
  }
};


// GET JOURNEY
const getJourney = async (req, res) => {
  try {
    const { id } = req.params;

    const journey = await Journey.findById(id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found"
      });
    }

    res.json({
      success: true,
      journey
    });

  } catch (error) {
    console.error("Get journey error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to get journey"
    });
  }
};


// UPDATE LOCATION
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required"
      });
    }

    const journey = await Journey.findById(id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found"
      });
    }

    if (journey.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Journey is no longer active"
      });
    }

    // Save current location
    journey.currentLocation = {
      latitude,
      longitude,
      updatedAt: new Date()
    };

    // Keep location history
    journey.locationHistory.push({
      latitude,
      longitude,
      timestamp: new Date()
    });

    // Keep only latest 50 locations
    if (journey.locationHistory.length > 50) {
      journey.locationHistory =
        journey.locationHistory.slice(-50);
    }

    // Check route deviation
    const safetyResult = checkRouteDeviation({
      currentLocation: {
        latitude,
        longitude
      },
      expectedLocation: {
        latitude: journey.destination.latitude,
        longitude: journey.destination.longitude
      }
    });

    if (safetyResult.deviated) {
      journey.safetyStatus = "warning";
    } else {
      journey.safetyStatus = "normal";
    }

    await journey.save();

    // Send alert when deviation is detected
    if (safetyResult.deviated) {
      const contacts = await TrustedContact.find({
        userId: journey.userId
      });

      const user = await User.findById(journey.userId);

      for (const contact of contacts) {
        await sendSafetyAlert({
          contact,
          userName: user?.name || "Disha user",
          alertType: "ROUTE_DEVIATION",
          message:
            `${user?.name || "The user"} may have moved away ` +
            `from the planned journey route.`
        });
      }
    }

    res.json({
      success: true,
      message: "Location updated",
      safetyStatus: journey.safetyStatus,
      distanceFromDestinationKm: safetyResult.distanceKm
    });

  } catch (error) {
    console.error("Location update error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update location"
    });
  }
};


// COMPLETE JOURNEY
const completeJourney = async (req, res) => {
  try {
    const { id } = req.params;

    const journey = await Journey.findById(id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found"
      });
    }

    journey.status = "completed";
    journey.safetyStatus = "normal";
    journey.completedAt = new Date();

    await journey.save();

    res.json({
      success: true,
      message: "Journey completed successfully",
      journey
    });

  } catch (error) {
    console.error("Complete journey error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to complete journey"
    });
  }
};


// CANCEL JOURNEY
const cancelJourney = async (req, res) => {
  try {
    const { id } = req.params;

    const journey = await Journey.findById(id);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found"
      });
    }

    journey.status = "cancelled";
    journey.safetyStatus = "normal";
    journey.completedAt = new Date();

    await journey.save();

    res.json({
      success: true,
      message: "Journey cancelled",
      journey
    });

  } catch (error) {
    console.error("Cancel journey error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to cancel journey"
    });
  }
};


export {
  startJourney,
  getJourney,
  updateLocation,
  completeJourney,
  cancelJourney
};