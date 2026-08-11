// ============================================================
// HELP CONTROLLER
// ============================================================

// Get nearby help / safety resources
export const getNearbyHelp = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      radius = 5000,
    } = req.query;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    const searchRadius = Number(radius);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude.",
      });
    }

    // --------------------------------------------------------
    // DEMO HELP POINTS
    // --------------------------------------------------------
    // Replace these with real database/API results later.

    const helpPoints = [
      {
        id: "help-1",
        name: "Police Station",
        type: "POLICE",
        latitude: 18.5204,
        longitude: 73.8567,
        available: true,
      },

      {
        id: "help-2",
        name: "Hospital",
        type: "HOSPITAL",
        latitude: 18.5235,
        longitude: 73.8590,
        available: true,
      },

      {
        id: "help-3",
        name: "Emergency Help Point",
        type: "EMERGENCY_HELP",
        latitude: 18.5185,
        longitude: 73.8540,
        available: true,
      },
    ];

    return res.status(200).json({
      success: true,
      message: "Nearby help locations loaded.",
      location: {
        latitude: lat,
        longitude: lng,
      },
      radius: searchRadius,
      helpPoints,
    });
  } catch (error) {
    console.error(
      "❌ Get nearby help error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load nearby help locations.",
    });
  }
};


// ============================================================
// GET EMERGENCY CONTACTS
// ============================================================

export const getEmergencyContacts = async (
  req,
  res
) => {
  try {
    const contacts = [
      {
        id: "emergency-police",
        name: "Police",
        number: "112",
        type: "POLICE",
      },

      {
        id: "emergency-women",
        name: "Women Helpline",
        number: "181",
        type: "WOMEN_HELPLINE",
      },

      {
        id: "emergency-medical",
        name: "Ambulance",
        number: "108",
        type: "MEDICAL",
      },
    ];

    return res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error(
      "❌ Emergency contacts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load emergency contacts.",
    });
  }
};


// ============================================================
// HEALTH / SAFETY CHECK
// ============================================================

export const safetyCheck = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
    } = req.body;

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Location is required.",
      });
    }

    return res.status(200).json({
      success: true,
      safe: true,
      safetyScore: 85,
      message:
        "Location safety information retrieved.",
      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });
  } catch (error) {
    console.error(
      "❌ Safety check error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Safety check failed.",
    });
  }
};