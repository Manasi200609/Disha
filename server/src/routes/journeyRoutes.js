import express from "express";

import {
  createJourney,
  getJourney,
  updateJourneyLocation,
  checkInJourney,
  endJourney,
} from "../controllers/journeyController.js";

const router = express.Router();

// ============================================================
// JOURNEY ROUTES
// ============================================================

// Create a new journey
router.post("/", createJourney);

// Get a specific journey
router.get("/:journeyId", getJourney);

// Update live location
router.patch("/:journeyId/location", updateJourneyLocation);

// Check in
router.post("/:journeyId/check-in", checkInJourney);

// End journey
router.put("/:journeyId/end", endJourney);

export default router;