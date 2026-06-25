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
  Save,
  Sparkles,
  Trash2,
  Plus,
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

  const [manualMode, setManualMode] = useState(false);
const [savingManualPlan, setSavingManualPlan] = useState(false);

const [manualItinerary, setManualItinerary] = useState([
  {
    day: 1,
    title: "",
    activities: [""],
  },
]);

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
  setManualMode(true);

  setTimeout(() => {
    itinerarySectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);
};

const updateManualDay = (dayIndex, field, value) => {
  setManualItinerary((currentPlan) =>
    currentPlan.map((day, index) =>
      index === dayIndex ? { ...day, [field]: value } : day
    )
  );
};

const updateActivity = (dayIndex, activityIndex, value) => {
  setManualItinerary((currentPlan) =>
    currentPlan.map((day, index) => {
      if (index !== dayIndex) return day;

      const updatedActivities = [...day.activities];
      updatedActivities[activityIndex] = value;

      return { ...day, activities: updatedActivities };
    })
  );
};

const addActivity = (dayIndex) => {
  setManualItinerary((currentPlan) =>
    currentPlan.map((day, index) =>
      index === dayIndex
        ? { ...day, activities: [...day.activities, ""] }
        : day
    )
  );
};

const removeActivity = (dayIndex, activityIndex) => {
  setManualItinerary((currentPlan) =>
    currentPlan.map((day, index) => {
      if (index !== dayIndex) return day;

      const updatedActivities = day.activities.filter(
        (_, index) => index !== activityIndex
      );

      return {
        ...day,
        activities: updatedActivities.length ? updatedActivities : [""],
      };
    })
  );
};

const addManualDay = () => {
  setManualItinerary((currentPlan) => [
    ...currentPlan,
    {
      day: currentPlan.length + 1,
      title: "",
      activities: [""],
    },
  ]);
};

const removeManualDay = (dayIndex) => {
  setManualItinerary((currentPlan) => {
    if (currentPlan.length === 1) {
      toast.error("Your itinerary needs at least one day");
      return currentPlan;
    }

    return currentPlan
      .filter((_, index) => index !== dayIndex)
      .map((day, index) => ({
        ...day,
        day: index + 1,
      }));
  });
};

const saveManualItinerary = async () => {
  const cleanedItinerary = manualItinerary
    .map((day, index) => ({
      day: index + 1,
      title: day.title.trim() || `Day ${index + 1}`,
      activities: day.activities
        .map((activity) => activity.trim())
        .filter(Boolean),
    }))
    .filter((day) => day.title || day.activities.length > 0);

  const hasAtLeastOneActivity = cleanedItinerary.some(
    (day) => day.activities.length > 0
  );

  if (!hasAtLeastOneActivity) {
    toast.error("Add at least one activity before saving");
    return;
  }

  try {
    setSavingManualPlan(true);

    const response = await api.put(`/trips/${tripId}/manual-itinerary`, {
      itinerary: cleanedItinerary,
    });

    setTrip(response.data.data);
    setManualMode(false);
    setAiUnavailable(false);

    toast.success("Manual itinerary saved successfully!");
  } catch (error) {
    console.error(
      "Manual itinerary error:",
      error?.response?.data || error.message
    );

    toast.error(
      error?.response?.data?.message || "Could not save manual itinerary"
    );
  } finally {
    setSavingManualPlan(false);
  }
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

  const itinerary =
  trip.generatedItinerary?.dailyItinerary ||
  trip.itinerary ||
  trip.aiItinerary ||
  [];
  const hotels = trip.hotelRecommendations || [];

  const estimatedBudget = trip.estimatedBudget || {};
const hasBudgetEstimate = Object.keys(estimatedBudget).length > 0;

const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "Not available";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: estimatedBudget.currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

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

        <section className="trip-content-card budget-breakdown-card">
  <div className="section-heading">
    <div>
      <span className="section-label">TRIP COST ESTIMATE</span>
      <h2>Budget breakdown</h2>
    </div>

    <CircleDollarSign size={25} />
  </div>

  {hasBudgetEstimate ? (
    <>
      <div className="budget-total-banner">
        <div>
          <span>Estimated total for this trip</span>
          <strong>{formatCurrency(estimatedBudget.total)}</strong>
        </div>

        <div className="budget-per-person">
          <span>Per traveler</span>
          <strong>{formatCurrency(estimatedBudget.perTraveler)}</strong>
        </div>
      </div>

      <div className="budget-breakdown-grid">
        <article className="budget-item">
          <span>Transport</span>
          <strong>{formatCurrency(estimatedBudget.transport)}</strong>
        </article>

        <article className="budget-item">
          <span>Accommodation</span>
          <strong>{formatCurrency(estimatedBudget.accommodation)}</strong>
        </article>

        <article className="budget-item">
          <span>Food</span>
          <strong>{formatCurrency(estimatedBudget.food)}</strong>
        </article>

        <article className="budget-item">
          <span>Activities</span>
          <strong>{formatCurrency(estimatedBudget.activities)}</strong>
        </article>
      </div>

      <p className="budget-estimate-note">{estimatedBudget.note}</p>
    </>
  ) : (
    <p className="empty-section-text">
      Your budget estimate will appear when you create a new trip.
    </p>
  )}
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

         {manualMode ? (
  <div className="manual-itinerary-builder">
    <div className="manual-builder-top">
      <div>
        <span className="section-label">MANUAL PLANNING</span>
        <h3>Create your own day-wise itinerary</h3>
        <p>Add activities for each day and save your travel plan.</p>
      </div>

      <button
        type="button"
        className="manual-cancel-button"
        onClick={() => setManualMode(false)}
        disabled={savingManualPlan}
      >
        Cancel
      </button>
    </div>

    <div className="manual-days-list">
      {manualItinerary.map((day, dayIndex) => (
        <div className="manual-day-card" key={dayIndex}>
          <div className="manual-day-header">
            <div className="day-number">Day {dayIndex + 1}</div>

            <button
              type="button"
              className="icon-delete-button"
              onClick={() => removeManualDay(dayIndex)}
              title="Remove day"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <label>Day title</label>
          <input
            type="text"
            value={day.title}
            onChange={(event) =>
              updateManualDay(dayIndex, "title", event.target.value)
            }
            placeholder={`Example: Explore ${trip.destination}`}
          />

          <label>Activities</label>

          {day.activities.map((activity, activityIndex) => (
            <div className="manual-activity-row" key={activityIndex}>
              <input
                type="text"
                value={activity}
                onChange={(event) =>
                  updateActivity(dayIndex, activityIndex, event.target.value)
                }
                placeholder="Example: Visit City Palace in the morning"
              />

              <button
                type="button"
                className="icon-delete-button"
                onClick={() => removeActivity(dayIndex, activityIndex)}
                title="Remove activity"
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="add-activity-button"
            onClick={() => addActivity(dayIndex)}
          >
            <Plus size={17} />
            Add activity
          </button>
        </div>
      ))}
    </div>

    <div className="manual-builder-actions">
      <button
        type="button"
        className="add-day-button"
        onClick={addManualDay}
      >
        <Plus size={18} />
        Add another day
      </button>

      <button
        type="button"
        className="save-manual-button"
        onClick={saveManualItinerary}
        disabled={savingManualPlan}
      >
        {savingManualPlan ? (
          <>
            <LoaderCircle className="spin" size={18} />
            Saving...
          </>
        ) : (
          <>
            <Save size={18} />
            Save manual itinerary
          </>
        )}
      </button>
    </div>
  </div>
) : itinerary.length === 0 ? (
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