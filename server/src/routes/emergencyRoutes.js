import express from "express";

const router = express.Router();


// ============================================================
// POST /emergency/trigger
// ============================================================
// Trigger an emergency alert from the Disha frontend.
// ============================================================

router.post("/trigger", async (req, res) => {
  try {
    const {
      userId,
      journeyId,
      latitude,
      longitude,
      message,
    } = req.body || {};

    const emergencyId = `emergency-${Date.now()}`;

    console.log("🚨 EMERGENCY ALERT TRIGGERED");

    console.log({
      emergencyId,
      userId: userId || "anonymous",
      journeyId: journeyId || null,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      message:
        message ||
        "User has indicated that they feel unsafe.",
    });

    return res.status(200).json({
      success: true,

      message:
        "Emergency alert triggered successfully.",

      emergency: {
        id: emergencyId,

        status: "ACTIVE",

        userId:
          userId || "anonymous",

        journeyId:
          journeyId || null,

        location: {
          latitude:
            Number.isFinite(Number(latitude))
              ? Number(latitude)
              : null,

          longitude:
            Number.isFinite(Number(longitude))
              ? Number(longitude)
              : null,
        },

        message:
          message ||
          "User has indicated that they feel unsafe.",

        triggeredAt:
          new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "❌ Emergency trigger error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to trigger emergency alert.",
    });
  }
});


// ============================================================
// POST /emergency/cancel
// ============================================================
// Cancel an active emergency alert.
// ============================================================

router.post("/cancel", async (req, res) => {
  try {
    const {
      emergencyId,
    } = req.body || {};

    if (!emergencyId) {
      return res.status(400).json({
        success: false,
        message:
          "Emergency ID is required.",
      });
    }

    console.log(
      `✅ Emergency alert cancelled: ${emergencyId}`
    );

    return res.status(200).json({
      success: true,

      message:
        "Emergency alert cancelled successfully.",

      emergency: {
        id: emergencyId,
        status: "CANCELLED",
        cancelledAt:
          new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "❌ Emergency cancellation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to cancel emergency alert.",
    });
  }
});


// ============================================================
// GET /emergency/status/:emergencyId
// ============================================================
// Check the status of an emergency alert.
// ============================================================

router.get(
  "/status/:emergencyId",
  (req, res) => {
    const {
      emergencyId,
    } = req.params;

    if (!emergencyId) {
      return res.status(400).json({
        success: false,
        message:
          "Emergency ID is required.",
      });
    }

    return res.status(200).json({
      success: true,

      emergency: {
        id: emergencyId,
        status: "ACTIVE",
      },
    });
  }
);


// ============================================================
// POST /emergency/location
// ============================================================
// Update the user's location while an emergency is active.
// ============================================================

router.post("/location", (req, res) => {
  try {
    const {
      emergencyId,
      latitude,
      longitude,
    } = req.body || {};

    if (!emergencyId) {
      return res.status(400).json({
        success: false,
        message:
          "Emergency ID is required.",
      });
    }

    if (
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid latitude and longitude are required.",
      });
    }

    const location = {
      latitude: Number(latitude),
      longitude: Number(longitude),
      updatedAt:
        new Date().toISOString(),
    };

    console.log(
      "📍 Emergency location updated:",
      {
        emergencyId,
        ...location,
      }
    );

    return res.status(200).json({
      success: true,

      message:
        "Emergency location updated.",

      emergencyId,

      location,
    });
  } catch (error) {
    console.error(
      "❌ Emergency location update error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update emergency location.",
    });
  }
});


export default router;