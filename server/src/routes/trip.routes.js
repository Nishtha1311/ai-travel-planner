import express from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  generateItinerary,
} from "../controllers/trip.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createTrip);
router.get("/", getTrips);

router.post("/:id/generate-itinerary", generateItinerary);

router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;