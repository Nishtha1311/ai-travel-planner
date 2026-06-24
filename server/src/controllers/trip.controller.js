import {
  createTripService,
  getTripsService,
  getTripByIdService,
  updateTripService,
  deleteTripService,
} from "../services/trip.service.js";

import { generateTripItinerary } from "../services/gemini.service.js";

export const createTrip = async (req, res) => {
  try {
    const trip = await createTripService(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await getTripsService(req.user._id);

    return res.status(200).json({
      success: true,
      data: trips,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await getTripByIdService(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const trip = await updateTripService(
      req.params.id,
      req.user._id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: trip,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await deleteTripService(req.params.id, req.user._id);

    return res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const generateItinerary = async (req, res) => {
  try {
    const trip = await getTripByIdService(req.params.id, req.user._id);

    const aiResult = await generateTripItinerary(trip);

    const updatedTrip = await updateTripService(req.params.id, req.user._id, {
      generatedItinerary: {
        tripTitle: aiResult.tripTitle,
        overview: aiResult.overview,
        dailyItinerary: aiResult.dailyItinerary,
      },
      hotelRecommendations: aiResult.hotelRecommendations,
      estimatedBudget: aiResult.estimatedBudget,
      status: "generated",
    });

    return res.status(200).json({
      success: true,
      message: "AI itinerary generated successfully",
      data: updatedTrip,
    });
  } catch (error) {
    console.error("Itinerary generation error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate itinerary",
    });
  }
};