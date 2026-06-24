"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Compass,
  LoaderCircle,
  MapPinned,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../lib/api";

const interestOptions = [
  "Beaches",
  "Food",
  "Nature",
  "Adventure",
  "Culture",
  "Shopping",
  "Nightlife",
  "History",
];

export default function NewTripPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    numberOfDays: "",
    budget: "Medium",
    travelers: 1,
    travelStyle: "Balanced",
    interests: [],
    transportPreference: "Flight",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((previous) => ({
      ...previous,
      interests: previous.interests.includes(interest)
        ? previous.interests.filter((item) => item !== interest)
        : [...previous.interests, interest],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.destination.trim() ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.numberOfDays
    ) {
      toast.error("Please complete the required trip details");
      return;
    }

    if (formData.interests.length === 0) {
      toast.error("Select at least one interest");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("End date must be after the start date");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await api.post("/trips", {
        ...formData,
        destination: formData.destination.trim(),
        numberOfDays: Number(formData.numberOfDays),
        travelers: Number(formData.travelers),
      });

      const trip = response.data.data;

      toast.success("Trip created! Generating your AI itinerary...");

      try {
        await api.post(`/ai/generate-trip/${trip._id}`);
        toast.success("Your AI itinerary is ready!");
      } catch (aiError) {
        toast.error(
          aiError.response?.data?.message ||
            "Trip saved, but AI itinerary could not be generated"
        );
      }

      router.push(`/trips/${trip._id}`);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please sign in again");
        router.push("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Could not create trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="new-trip-page">
      <header className="new-trip-header">
        <Link href="/dashboard" className="back-link">
          <ArrowLeft size={19} />
          Back to dashboard
        </Link>

        <Link href="/dashboard" className="dashboard-brand">
          <MapPinned size={27} />
          <span>TravelAI</span>
        </Link>
      </header>

      <section className="new-trip-wrapper">
        <div className="new-trip-intro">
          <div className="hero-badge">
            <Sparkles size={17} />
            Personalized AI itinerary
          </div>

          <h1>Where would you like to go?</h1>
          <p>
            Share your travel preferences and TravelAI will build a practical,
            day-by-day itinerary around your trip.
          </p>

          <div className="new-trip-side-card">
            <Compass size={26} />
            <div>
              <strong>What you will get</strong>
              <span>Daily plan, hotel ideas, budget estimate, and activity suggestions.</span>
            </div>
          </div>
        </div>

        <form className="trip-form-card" onSubmit={handleSubmit}>
          <div className="trip-form-heading">
            <h2>Trip details</h2>
            <p>Fields marked with * are required.</p>
          </div>

          <div className="trip-form-grid">
            <label className="full-width">
              Destination *
              <div className="input-wrapper">
                <MapPinned size={19} />
                <input
                  type="text"
                  name="destination"
                  placeholder="Example: Goa, India"
                  value={formData.destination}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              Start date *
              <div className="input-wrapper">
                <CalendarDays size={19} />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              End date *
              <div className="input-wrapper">
                <CalendarDays size={19} />
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              Number of days *
              <div className="input-wrapper">
                <CalendarDays size={19} />
                <input
                  type="number"
                  min="1"
                  name="numberOfDays"
                  placeholder="Example: 5"
                  value={formData.numberOfDays}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              Travelers
              <div className="input-wrapper">
                <Users size={19} />
                <input
                  type="number"
                  min="1"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              Budget
              <div className="input-wrapper">
                <CircleDollarSign size={19} />
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </label>

            <label>
              Travel style
              <div className="input-wrapper">
                <Compass size={19} />
                <select
                  name="travelStyle"
                  value={formData.travelStyle}
                  onChange={handleChange}
                >
                  <option value="Balanced">Balanced</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Relaxed">Relaxed</option>
                  <option value="Family">Family</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Solo">Solo</option>
                </select>
              </div>
            </label>

            <label className="full-width">
              Transport preference
              <div className="transport-options">
                {["Flight", "Train", "Bus", "Car", "No preference"].map(
                  (transport) => (
                    <button
                      type="button"
                      key={transport}
                      className={
                        formData.transportPreference === transport
                          ? "transport-option selected"
                          : "transport-option"
                      }
                      onClick={() =>
                        setFormData((previous) => ({
                          ...previous,
                          transportPreference: transport,
                        }))
                      }
                    >
                      {transport}
                    </button>
                  )
                )}
              </div>
            </label>

            <div className="full-width interest-field">
              <span>What are you interested in? *</span>
              <div className="interest-options">
                {interestOptions.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    className={
                      formData.interests.includes(interest)
                        ? "interest-option selected"
                        : "interest-option"
                    }
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="generate-trip-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="spin" size={20} />
                Creating your trip...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Create AI trip plan
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}