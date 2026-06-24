import Trip from "../models/Trip.js";

export const createTripService = async (tripData, userId) => {
  const trip = await Trip.create({
    ...tripData,
    user: userId,
  });

  return trip;
};

export const getTripsService = async (userId) => {
  return await Trip.find({ user: userId }).sort({
    createdAt: -1,
  });
};

export const getTripByIdService = async (tripId, userId) => {
  const trip = await Trip.findOne({
    _id: tripId,
    user: userId,
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  return trip;
};

export const updateTripService = async (
  tripId,
  userId,
  updateData
) => {
  const trip = await Trip.findOneAndUpdate(
    {
      _id: tripId,
      user: userId,
    },
    updateData,
    {
      new: true,
    }
  );

  if (!trip) {
    throw new Error("Trip not found");
  }

  return trip;
};

export const deleteTripService = async (
  tripId,
  userId
) => {
  const trip = await Trip.findOneAndDelete({
    _id: tripId,
    user: userId,
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  return;
};