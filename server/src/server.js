import express from "express";
import cors from "cors";
import "dotenv/config";

import routeRoutes from "./routes/routeRoutes.js";
import trustedContactRoutes from "./routes/trustedContactRoutes.js";
import journeyRoutes from "./routes/journeyRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";

import connectDB from "./config/db.js";

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Disha server is running.",
  });
});

// ============================================================
// ROUTES
// ============================================================

app.use(
  "/api/routes",
  routeRoutes
);

app.use(
  "/api/trusted-contacts",
  trustedContactRoutes
);

app.use(
  "/journeys",
  journeyRoutes
);

app.use(
  "/emergency",
  emergencyRoutes
);

// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((error, req, res, next) => {
  console.error("❌ Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ============================================================
// START SERVER
// ============================================================

const startServer = async () => {
  try {
    // Connect MongoDB first
    await connectDB();

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log("");
        console.log("==========================================");
        console.log("🔥 DISHA SERVER RUNNING");
        console.log("==========================================");
        console.log(
          `🌐 Local: http://localhost:${PORT}`
        );
        console.log(
          `📱 Phone API: http://10.137.204.201:${PORT}`
        );
        console.log("");
        console.log(
          "🗺️ Route API: POST /api/routes"
        );
        console.log(
          "👥 Trusted Contacts API: /api/trusted-contacts"
        );
        console.log(
          "🧭 Journey API: /journeys"
        );
        console.log(
          "🚨 Emergency API: /emergency"
        );
        console.log("==========================================");
        console.log("");
      }
    );
  } catch (error) {
    console.error(
      "❌ Failed to start Disha server:",
      error
    );

    process.exit(1);
  }
};

startServer();