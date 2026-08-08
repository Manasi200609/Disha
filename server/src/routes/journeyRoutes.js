import express from "express";

import {
  startJourney,
  getJourney,
  updateLocation,
  completeJourney,
  cancelJourney
} from "../controllers/journeyController.js";

const router = express.Router();


// Start a journey
router.post("/", startJourney);


// Get journey details
router.get("/:id", getJourney);


// Update live location
router.post("/:id/location", updateLocation);


// Complete journey
router.patch("/:id/complete", completeJourney);


// Cancel journey
router.patch("/:id/cancel", cancelJourney);


export default router;