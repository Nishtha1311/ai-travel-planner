import {
  generateTripItinerary as generateTripItineraryService,
  regenerateTripDay as regenerateTripDayService,
  testGeminiConnection as testGeminiService,
} from "../services/gemini.service.js";

import Trip from "../models/Trip.js";


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

    trip.generatedItinerary = {
  dailyItinerary: aiPlan.itinerary || aiPlan.dailyItinerary || [],
  source: "ai",
};

trip.hotelRecommendations = aiPlan.hotelRecommendations || [];
trip.estimatedBudget =
  aiPlan.estimatedBudget || aiPlan.budgetEstimate || trip.estimatedBudget || {};
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

// POST /api/ai/regenerate-day/:tripId/:dayNumber
export const regenerateTripDay = async (req, res) => {
  try {
    const dayNumber = Number(req.params.dayNumber);
    const { instruction = "" } = req.body;

    if (!Number.isInteger(dayNumber) || dayNumber < 1) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid day number",
      });
    }

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

    const currentItinerary =
      trip.generatedItinerary?.dailyItinerary || trip.itinerary || [];

    if (!currentItinerary.length) {
      return res.status(400).json({
        success: false,
        message: "Create an itinerary before regenerating a day",
      });
    }

    const regeneratedDay = await regenerateTripDayService(
      trip,
      dayNumber,
      instruction,
      currentItinerary
    );

    const updatedItinerary = currentItinerary.map((day, index) => {
      const currentDayNumber = Number(day.day) || index + 1;

      return currentDayNumber === dayNumber ? regeneratedDay : day;
    });

    trip.generatedItinerary = {
  dailyItinerary: updatedItinerary,
  source: "ai",
};

trip.status = "generated";

await trip.save();

    await trip.save();

    return res.status(200).json({
      success: true,
      message: `Day ${dayNumber} regenerated successfully`,
      data: trip,
    });
  } catch (error) {
    console.error("Regenerate day error:", error);

    const isGeminiBusy =
      error?.status === 429 ||
      error?.status === 503 ||
      error?.message?.toLowerCase().includes("quota") ||
      error?.message?.toLowerCase().includes("busy") ||
      error?.message?.toLowerCase().includes("high demand");

    return res.status(isGeminiBusy ? 503 : 500).json({
      success: false,
      message: isGeminiBusy
        ? "Gemini is unavailable right now. You can edit this day manually."
        : error.message || "Could not regenerate this day",
    });
  }
};