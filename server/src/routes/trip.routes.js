import express from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/trip.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// All trip routes are protected
router.use(protect);

// Create Trip
router.post("/", createTrip);

// Get All Trips
router.get("/", getTrips);

// Get Single Trip
router.get("/:id", getTripById);

// Update Trip
router.put("/:id", updateTrip);

// Delete Trip
router.delete("/:id", deleteTrip);

export default router;