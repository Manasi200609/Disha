import Journey from "../models/Journey.js";

// ============================================================
// CREATE JOURNEY
// POST /journeys
// ============================================================

export const createJourney = async (req, res) => {
  try {
    const {
      journeyId,
      userId,
      source,
      destination,
      destinationCoords,
      startLocation,
      route,
      safetyScore,
      eta,
    } = req.body;

    const id =
      journeyId ||
      `journey-${Date.now()}`;

    // Prevent duplicate journey IDs
    const existingJourney = await Journey.findOne({
      journeyId: id,
    });

    if (existingJourney) {
      return res.status(200).json({
        success: true,
        message: "Journey already exists.",
        journey: existingJourney,
      });
    }

    const journey = await Journey.create({
      journeyId: id,

      userId: userId || null,

      source: source || null,

      destination: destination || "Unknown destination",

      destinationCoords: destinationCoords || null,

      startLocation: startLocation || null,

      route: route || [],

      safetyScore:
        safetyScore !== undefined
          ? safetyScore
          : 87,

      eta: eta || null,

      status: "active",

      startedAt: new Date(),

      lastLocation: startLocation || null,

      endedAt: null,
    });

    console.log(
      "✅ Journey created:",
      journey.journeyId
    );

    return res.status(201).json({
      success: true,
      message: "Journey created successfully.",
      journey,
    });

  } catch (error) {
    console.error(
      "❌ Create journey error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create journey.",
      error: error.message,
    });
  }
};

// ============================================================
// GET JOURNEY
// GET /journeys/:journeyId
// ============================================================

export const getJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;

    console.log(
      "🔎 Getting journey:",
      journeyId
    );

    const journey = await Journey.findOne({
      journeyId,
    });

    if (!journey) {
      console.log(
        "⚠️ Journey not found:",
        journeyId
      );

      return res.status(404).json({
        success: false,
        message: "Journey not found.",
        journeyId,
      });
    }

    return res.status(200).json({
      success: true,
      journey,
    });

  } catch (error) {
    console.error(
      "❌ Get journey error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch journey.",
      error: error.message,
    });
  }
};

// ============================================================
// UPDATE LOCATION
// PUT /journeys/:journeyId/location
// ============================================================

export const updateJourneyLocation = async (
  req,
  res
) => {
  try {
    const { journeyId } = req.params;

    const {
      latitude,
      longitude,
      lat,
      lng,
    } = req.body;

    const finalLatitude =
      latitude ?? lat;

    const finalLongitude =
      longitude ?? lng;

    if (
      finalLatitude === undefined ||
      finalLongitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Latitude and longitude are required.",
      });
    }

    const location = {
      latitude: Number(finalLatitude),
      longitude: Number(finalLongitude),
      updatedAt: new Date(),
    };

    const journey =
      await Journey.findOneAndUpdate(
        { journeyId },

        {
          $set: {
            lastLocation: location,
          },

          $push: {
            locationHistory: location,
          },
        },

        {
          new: true,
        }
      );

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found.",
      });
    }

    console.log(
      `📍 Location updated: ${journeyId}`
    );

    return res.status(200).json({
      success: true,
      message: "Location updated.",
      journey,
    });

  } catch (error) {
    console.error(
      "❌ Location update error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update journey location.",
      error: error.message,
    });
  }
};

// ============================================================
// END JOURNEY
// PUT /journeys/:journeyId/end
// ============================================================

export const endJourney = async (
  req,
  res
) => {
  try {
    const { journeyId } = req.params;

    const journey =
      await Journey.findOneAndUpdate(
        { journeyId },

        {
          $set: {
            status: "completed",
            endedAt: new Date(),
          },
        },

        {
          new: true,
        }
      );

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found.",
      });
    }

    console.log(
      `🛑 Journey ended: ${journeyId}`
    );

    return res.status(200).json({
      success: true,
      message: "Journey ended successfully.",
      journey,
    });

  } catch (error) {
    console.error(
      "❌ End journey error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to end journey.",
      error: error.message,
    });
  }
};

export const checkInJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;

    const journey = await Journey.findOneAndUpdate(
      {
        journeyId,
        status: "active",
      },
      {
        $set: {
          checkedIn: true,
          lastCheckInAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Active journey not found.",
      });
    }

    console.log(`✅ Journey check-in: ${journeyId}`);

    return res.status(200).json({
      success: true,
      message: "Check-in successful.",
      journey,
    });
  } catch (error) {
    console.error("❌ Check-in error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to check in.",
      error: error.message,
    });
  }
};

// ============================================================
// EMERGENCY ESCALATION
// POST /journeys/:journeyId/emergency
// ============================================================

export const escalateEmergency = async (req, res) => {
  try {
    const { journeyId } = req.params;

    const {
      latitude,
      longitude,
      lat,
      lng,
    } = req.body || {};

    const finalLatitude = latitude ?? lat;
    const finalLongitude = longitude ?? lng;

    const emergencyLocation =
      finalLatitude !== undefined &&
      finalLongitude !== undefined
        ? {
            latitude: Number(finalLatitude),
            longitude: Number(finalLongitude),
            updatedAt: new Date(),
          }
        : null;

    const updateData = {
      emergencyActive: true,
      emergencyTriggeredAt: new Date(),
      emergencyStatus: "alerting_contacts",
    };

    if (emergencyLocation) {
      updateData.emergencyLocation = emergencyLocation;
      updateData.lastLocation = emergencyLocation;
    }

    const journey = await Journey.findOneAndUpdate(
      {
        journeyId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
      }
    );

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found.",
      });
    }

    console.log(
      `🚨 EMERGENCY ESCALATION: ${journeyId}`
    );

    console.log(
      "📢 Alerting trusted contacts..."
    );

    return res.status(200).json({
      success: true,
      message: "Alerting your contacts.",
      emergency: true,
      journey,
    });
  } catch (error) {
    console.error(
      "❌ Emergency escalation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to trigger emergency escalation.",
      error: error.message,
    });
  }
};