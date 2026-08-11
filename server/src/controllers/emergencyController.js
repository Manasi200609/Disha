// ============================================================
// EMERGENCY CONTROLLER
// ============================================================


// ============================================================
// TRIGGER EMERGENCY ALERT
// ============================================================

export const triggerEmergency = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      journeyId,
      message,
    } = req.body;

    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Current location is required.",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid location.",
      });
    }

    // --------------------------------------------------------
    // CREATE EMERGENCY
    // --------------------------------------------------------

    const emergency = {
      id: `emergency-${Date.now()}`,

      journeyId:
        journeyId || null,

      status: "ACTIVE",

      message:
        message ||
        "Emergency alert triggered from Disha.",

      location: {
        latitude: lat,
        longitude: lng,
      },

      triggeredAt:
        new Date().toISOString(),
    };

    // --------------------------------------------------------
    // DEMO MODE
    // --------------------------------------------------------
    // For now, we simply log the emergency.
    //
    // Later this can:
    // - Notify trusted contacts
    // - Send SMS
    // - Call emergency services
    // - Store the emergency in MongoDB
    // - Start live location sharing
    // --------------------------------------------------------

    console.log(
      "🚨 EMERGENCY ALERT TRIGGERED"
    );

    console.log(
      JSON.stringify(
        emergency,
        null,
        2
      )
    );

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "Emergency alert activated.",

      emergency,
    });
  } catch (error) {
    console.error(
      "❌ Trigger emergency error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to trigger emergency alert.",
    });
  }
};


// ============================================================
// GET EMERGENCY STATUS
// ============================================================

export const getEmergencyStatus = async (
  req,
  res
) => {
  try {
    const { emergencyId } = req.params;

    if (!emergencyId) {
      return res.status(400).json({
        success: false,
        message: "Emergency ID is required.",
      });
    }

    // Demo response
    return res.status(200).json({
      success: true,

      emergency: {
        id: emergencyId,

        status: "ACTIVE",

        message:
          "Emergency alert is active.",

        triggeredAt:
          new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "❌ Get emergency status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get emergency status.",
    });
  }
};


// ============================================================
// CANCEL EMERGENCY
// ============================================================

export const cancelEmergency = async (
  req,
  res
) => {
  try {
    const { emergencyId } = req.params;

    if (!emergencyId) {
      return res.status(400).json({
        success: false,
        message: "Emergency ID is required.",
      });
    }

    console.log(
      `✅ Emergency cancelled: ${emergencyId}`
    );

    return res.status(200).json({
      success: true,

      message:
        "Emergency alert cancelled.",

      emergency: {
        id: emergencyId,
        status: "CANCELLED",
        cancelledAt:
          new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "❌ Cancel emergency error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to cancel emergency alert.",
    });
  }
};