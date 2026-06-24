import express from "express";
import {
  testGeminiConnection,
  generateTripItinerary,
} from "../controllers/ai.controller.js";
import  protect  from "../middleware/auth.middleware.js";

const router = express.Router();

// Test Gemini API connection
router.get("/test", testGeminiConnection);

// Generate AI itinerary for one trip
router.post("/generate-trip/:tripId", protect, generateTripItinerary);

export default router;