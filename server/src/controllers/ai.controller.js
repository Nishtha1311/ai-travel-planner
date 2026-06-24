import Trip from "../models/Trip.js";
import {
  generateTripItinerary as generateTripItineraryService,
  testGeminiConnection as testGeminiService,
} from "../services/gemini.service.js";


// GET /api/ai/test
export const testGeminiConnection = async (req, res) => {
  try {
    const message = await testGeminiService();

    return res.status(200).json({
      success: true,
      message: "Gemini API is connected",
      data: {
        reply: message,
      },
    });
  } catch (error) {
    console.error("Gemini test error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to connect to Gemini API",
    });
  }
};

// POST /api/ai/generate-trip/:tripId
export const generateTripItinerary = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.tripId,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const aiPlan = await generateTripItineraryService(trip);

    trip.itinerary = aiPlan.itinerary || [];
    trip.hotelRecommendations = aiPlan.hotelRecommendations || [];
    trip.budgetEstimate = aiPlan.budgetEstimate || {};
    trip.status = "generated";

    await trip.save();

    return res.status(200).json({
      success: true,
      message: "AI itinerary generated successfully",
      data: trip,
    });
  }  catch (error) {
  console.error("Generate itinerary error:", error);

  const isGeminiBusy =
    error?.status === 503 ||
    error?.message?.includes("temporarily busy") ||
    error?.message?.includes("high demand");

  return res.status(isGeminiBusy ? 503 : 500).json({
    success: false,
    message: isGeminiBusy
      ? "Gemini is busy right now. Please try again in a few seconds."
      : error.message || "Could not generate AI itinerary",
  });
}
};