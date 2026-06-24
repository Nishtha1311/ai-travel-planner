import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    numberOfDays: {
      type: Number,
      required: true,
    },

    budget: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    travelers: {
      type: Number,
      default: 1,
    },

    travelStyle: {
      type: String,
      enum: [
        "Adventure",
        "Luxury",
        "Family",
        "Solo",
        "Romantic",
        "Business",
      ],
      required: true,
    },

    interests: [
      {
        type: String,
      },
    ],

    transportPreference: {
      type: String,
      enum: ["Flight", "Train", "Bus", "Car"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "generated"],
      default: "pending",
    },

    generatedItinerary: {
      type: Object,
      default: {},
    },

    hotelRecommendations: {
      type: Array,
      default: [],
    },

    estimatedBudget: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Trip", tripSchema);