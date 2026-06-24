import {
  createTripService,
  getTripsService,
  getTripByIdService,
  updateTripService,
  deleteTripService,
} from "../services/trip.service.js";

export const createTrip = async (req, res) => {
  try {
    const trip = await createTripService(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await getTripsService(req.user._id);

    res.status(200).json({
      success: true,
      data: trips,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await getTripByIdService(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(404).json({
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

    res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: trip,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await deleteTripService(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};