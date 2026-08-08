import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import journeyRoutes from "./routes/journeyRoutes.js";
import trustedContactRoutes from "./routes/trustedContactRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// Connect MongoDB
connectDB();


// Middleware
app.use(express.json());


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Disha backend is running"
  });
});


// API routes
app.use("/api/users", userRoutes);

app.use("/api/journeys", journeyRoutes);

app.use(
  "/api/trusted-contacts",
  trustedContactRoutes
);


// Error handler
app.use(errorMiddleware);


// Start server
app.listen(PORT, () => {
  console.log(
    `Disha server running on http://localhost:${PORT}`
  );
});