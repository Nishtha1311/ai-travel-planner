import Trip from "../models/Trip.js";

export const createTripService = async (tripData, userId) => {
  const numberOfDays = Number(tripData.numberOfDays) || 1;
  const travelers = Number(tripData.travelers) || 1;
  const budget = tripData.budget || "Medium";
  const transportPreference = tripData.transportPreference || "Flight";

  // Per-person, per-day estimates in INR.
  const budgetRates = {
    Low: {
      hotelPerNight: 1800,
      foodPerDay: 700,
      activitiesPerDay: 500,
      flightPerPerson: 4500,
      trainPerPerson: 1200,
      busPerPerson: 700,
      carPerPerson: 1500,
    },
    Medium: {
      hotelPerNight: 4000,
      foodPerDay: 1400,
      activitiesPerDay: 1100,
      flightPerPerson: 7500,
      trainPerPerson: 2200,
      busPerPerson: 1200,
      carPerPerson: 2500,
    },
    High: {
      hotelPerNight: 8500,
      foodPerDay: 2800,
      activitiesPerDay: 2400,
      flightPerPerson: 14000,
      trainPerPerson: 4500,
      busPerPerson: 2200,
      carPerPerson: 5000,
    },
  };

  const selectedRates = budgetRates[budget] || budgetRates.Medium;

  const transportKey = `${transportPreference.toLowerCase()}PerPerson`;

  const transportPerPerson =
    selectedRates[transportKey] || selectedRates.flightPerPerson;

  // Hotel price is treated as one room for the trip.
  // For a simple student project estimate, one room is enough.
  const accommodation = selectedRates.hotelPerNight * numberOfDays;

  const transport = transportPerPerson * travelers;
  const food = selectedRates.foodPerDay * numberOfDays * travelers;
  const activities =
    selectedRates.activitiesPerDay * numberOfDays * travelers;

  const total = transport + accommodation + food + activities;

  const estimatedBudget = {
    currency: "INR",
    transport,
    accommodation,
    food,
    activities,
    total,
    perTraveler: Math.round(total / travelers),
    note: "This is an approximate planning estimate based on your selected budget and travel preferences.",
  };

  const trip = await Trip.create({
    ...tripData,
    user: userId,
    estimatedBudget,
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