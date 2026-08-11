import express from "express";
import cors from "cors";
import "dotenv/config";

import routeRoutes from "./routes/routeRoutes.js";
import trustedContactRoutes from "./routes/trustedContactRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

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

// ============================================================
// 404
// ============================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ============================================================
// ERROR HANDLER
// ============================================================

app.use((error, req, res, next) => {
  console.error(
    "❌ Server error:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `🔥 DISHA SERVER RUNNING ON http://0.0.0.0:${PORT}`
    );

    console.log(
      `📱 Phone API: http://10.137.204.201:${PORT}`
    );

    console.log(
      "🗺️ Route API: POST /api/routes"
    );

    console.log(
      "👥 Trusted Contacts API: /api/trusted-contacts"
    );
  }
);