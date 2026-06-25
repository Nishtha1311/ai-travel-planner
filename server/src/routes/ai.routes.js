import express from "express";
import {
  testGeminiConnection,
  generateTripItinerary,
  regenerateTripDay,
} from "../controllers/ai.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/test", testGeminiConnection);

router.post("/generate-trip/:tripId", protect, generateTripItinerary);

// Regenerate only one itinerary day
router.post(
  "/regenerate-day/:tripId/:dayNumber",
  protect,
  regenerateTripDay
);

export default router;