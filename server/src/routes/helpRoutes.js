import express from "express";

const router = express.Router();


// ============================================================
// GET /help
// ============================================================
// Returns nearby/basic help resources.
// This version does NOT require Google Places or any paid API.
// ============================================================

router.get("/", async (req, res) => {
  try {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);

    const hasLocation =
      Number.isFinite(latitude) &&
      Number.isFinite(longitude);

    return res.status(200).json({
      success: true,

      message: "Help resources loaded successfully.",

      location: hasLocation
        ? {
            latitude,
            longitude,
          }
        : null,

      resources: [
        {
          id: "police",
          name: "Police",
          type: "EMERGENCY",
          phone: "112",
          description:
            "Emergency police assistance.",
        },

        {
          id: "women-helpline",
          name: "Women Helpline",
          type: "HELPLINE",
          phone: "181",
          description:
            "Women-focused support and assistance.",
        },

        {
          id: "emergency",
          name: "Emergency Services",
          type: "EMERGENCY",
          phone: "112",
          description:
            "National emergency response service.",
        },
      ],
    });
  } catch (error) {
    console.error(
      "❌ Help resources error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load help resources.",
    });
  }
});


// ============================================================
// GET /help/emergency
// ============================================================
// Returns emergency contacts for the EmergencyAlert component.
// ============================================================

router.get("/emergency", (req, res) => {
  return res.status(200).json({
    success: true,

    contacts: [
      {
        id: "112",
        name: "Emergency Services",
        number: "112",
        type: "EMERGENCY",
      },

      {
        id: "181",
        name: "Women Helpline",
        number: "181",
        type: "WOMEN_HELPLINE",
      },

      {
        id: "1091",
        name: "Women Police Helpline",
        number: "1091",
        type: "WOMEN_POLICE",
      },
    ],
  });
});


// ============================================================
// GET /help/nearby
// ============================================================
// Demo nearby safety/help points.
// No external API required.
// ============================================================

router.get("/nearby", (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  const hasLocation =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  return res.status(200).json({
    success: true,

    location: hasLocation
      ? {
          latitude,
          longitude,
        }
      : null,

    places: [
      {
        id: "help-1",
        name: "Police Station",
        type: "POLICE",
        latitude: hasLocation
          ? latitude + 0.002
          : 18.5224,
        longitude: hasLocation
          ? longitude + 0.002
          : 73.8587,
        available: true,
      },

      {
        id: "help-2",
        name: "Hospital",
        type: "HOSPITAL",
        latitude: hasLocation
          ? latitude - 0.002
          : 18.5184,
        longitude: hasLocation
          ? longitude + 0.003
          : 73.8597,
        available: true,
      },

      {
        id: "help-3",
        name: "Public Help Point",
        type: "HELP_POINT",
        latitude: hasLocation
          ? latitude + 0.003
          : 18.5234,
        longitude: hasLocation
          ? longitude - 0.002
          : 73.8547,
        available: true,
      },
    ],
  });
});


// ============================================================
// POST /help/contact
// ============================================================
// Used when the frontend wants to contact/request help.
// ============================================================

router.post("/contact", (req, res) => {
  const {
    name,
    phone,
    message,
    location,
  } = req.body || {};

  console.log(
    "🆘 HELP REQUEST RECEIVED"
  );

  console.log({
    name,
    phone,
    message,
    location,
  });

  return res.status(200).json({
    success: true,

    message:
      "Help request received successfully.",

    requestId:
      `help-${Date.now()}`,

    receivedAt:
      new Date().toISOString(),
  });
});


export default router;