"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Compass,
  Hotel,
  LoaderCircle,
  MapPinned,
  PencilLine,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../lib/api";

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id;
  const itinerarySectionRef = useRef(null);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiUnavailable, setAiUnavailable] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState("");

  const fetchTrip = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/trips/${tripId}`);
      setTrip(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please sign in again");
        router.push("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Could not load trip");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  const generateItinerary = async () => {
    try {
      setGenerating(true);
      setAiUnavailable(false);
      setAiErrorMessage("");

      await api.post(`/ai/generate-trip/${tripId}`);

      toast.success("Your AI itinerary is ready!");
      await fetchTrip();
    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        "Could not generate the AI itinerary. Please try again.";

      console.error("AI itinerary error:", error?.response?.data || error.message);

      const isAiUnavailable =
        status === 429 ||
        status === 503 ||
        message.toLowerCase().includes("quota") ||
        message.toLowerCase().includes("busy") ||
        message.toLowerCase().includes("high demand");

      if (isAiUnavailable) {
        setAiUnavailable(true);
        setAiErrorMessage(
          "AI planning is temporarily unavailable because the Gemini service is busy or its free quota has been reached."
        );
        toast.error("AI is temporarily unavailable. You can still plan manually.");
      } else {
        toast.error(message);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleManualPlanning = () => {
    itinerarySectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    toast.success("Manual itinerary editing will be available here.");
  };

  if (loading) {
    return (
      <main className="trip-details-loading">
        <LoaderCircle className="spin" size={34} />
        <p>Loading your trip...</p>
      </main>
    );
  }

  if (!trip) {
    return null;
  }

  const itinerary = trip.itinerary || trip.aiItinerary || [];
  const hotels = trip.hotelRecommendations || [];

  return (
    <main className="trip-details-page">
      <header className="trip-details-header">
        <Link href="/dashboard" className="back-link">
          <ArrowLeft size={19} />
          Back to dashboard
        </Link>

        <Link href="/dashboard" className="dashboard-brand">
          <MapPinned size={27} />
          <span>TravelAI</span>
        </Link>
      </header>

      <section className="trip-details-wrapper">
        <div className="trip-details-hero">
          <div>
            <div className="hero-badge">
              <Sparkles size={17} />
              Personalized AI itinerary
            </div>

            <h1>{trip.destination}</h1>

            <p>
              Your {trip.numberOfDays}-day {trip.travelStyle?.toLowerCase()}{" "}
              journey is ready to explore.
            </p>
          </div>

          <button
            className="generate-trip-button details-generate-button"
            onClick={generateItinerary}
            disabled={generating}
          >
            {generating ? (
              <>
                <LoaderCircle className="spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                {itinerary.length > 0
                  ? "Regenerate itinerary"
                  : "Generate AI itinerary"}
              </>
            )}
          </button>
        </div>

        <section className="trip-summary-grid">
          <div className="summary-card">
            <CalendarDays size={22} />
            <div>
              <span>Travel dates</span>
              <strong>
                {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
              </strong>
            </div>
          </div>

          <div className="summary-card">
            <Users size={22} />
            <div>
              <span>Travelers</span>
              <strong>{trip.travelers} traveler(s)</strong>
            </div>
          </div>

          <div className="summary-card">
            <CircleDollarSign size={22} />
            <div>
              <span>Budget</span>
              <strong>{trip.budget}</strong>
            </div>
          </div>

          <div className="summary-card">
            <Compass size={22} />
            <div>
              <span>Travel style</span>
              <strong>{trip.travelStyle}</strong>
            </div>
          </div>
        </section>

        {aiUnavailable && (
          <section className="ai-unavailable-card">
            <div className="ai-unavailable-icon">
              <AlertCircle size={26} />
            </div>

            <div className="ai-unavailable-content">
              <span className="section-label">AI TEMPORARILY UNAVAILABLE</span>
              <h2>Your trip is saved — continue planning your way</h2>
              <p>
                {aiErrorMessage ||
                  "The AI provider is temporarily unavailable. Your trip details are safe, and you can still build your itinerary manually."}
              </p>

              <div className="ai-unavailable-actions">
                <button
                  className="retry-ai-button"
                  onClick={generateItinerary}
                  disabled={generating}
                >
                  <RefreshCw size={18} />
                  Try AI again
                </button>

                <button
                  className="manual-plan-button"
                  onClick={handleManualPlanning}
                >
                  <PencilLine size={18} />
                  Build manually
                </button>
              </div>
            </div>
          </section>
        )}

        <section className="trip-content-card" ref={itinerarySectionRef}>
          <div className="section-heading">
            <div>
              <span className="section-label">YOUR AI PLAN</span>
              <h2>Day-by-day itinerary</h2>
            </div>
          </div>

          {itinerary.length === 0 ? (
            <div className="empty-itinerary">
              <Sparkles size={34} />
              <h3>Your itinerary is waiting</h3>
              <p>
                Click “Generate AI itinerary” and TravelAI will create your
                personalized day-wise plan. If AI is unavailable, you can build
                your trip manually.
              </p>
            </div>
          ) : (
            <div className="itinerary-list">
              {itinerary.map((day, index) => (
                <article className="itinerary-day-card" key={index}>
                  <div className="day-number">Day {day.day || index + 1}</div>

                  <div>
                    <h3>{day.title || day.theme || `Day ${index + 1}`}</h3>

                    {day.activities?.length > 0 ? (
                      <ul>
                        {day.activities.map((activity, activityIndex) => (
                          <li key={activityIndex}>
                            {typeof activity === "string"
                              ? activity
                              : activity.name || activity.description}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        {day.description ||
                          day.plan ||
                          "Your personalized activities will appear here."}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="trip-content-card">
          <div className="section-heading">
            <div>
              <span className="section-label">STAY RECOMMENDATIONS</span>
              <h2>Hotel recommendations</h2>
            </div>
            <Hotel size={25} />
          </div>

          {hotels.length === 0 ? (
            <p className="empty-section-text">
              Hotel recommendations will appear after the AI itinerary is
              generated.
            </p>
          ) : (
            <div className="hotel-grid">
              {hotels.map((hotel, index) => (
                <article className="hotel-card" key={index}>
                  <Hotel size={23} />
                  <h3>{hotel.name}</h3>
                  <p>{hotel.area || hotel.location}</p>
                  <strong>
                    {hotel.priceRange || hotel.price || "Price varies"}
                  </strong>
                  <span>{hotel.reason}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}