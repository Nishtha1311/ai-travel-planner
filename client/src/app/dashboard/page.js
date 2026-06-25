"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Compass,
  LogOut,
  MapPinned,
  Plus,
  Sparkles,
  Trash2,
  X,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tripToDelete, setTripToDelete] = useState(null);
const [isDeleting, setIsDeleting] = useState(false);

  const loadTrips = async () => {
    try {
      const response = await api.get("/trips");
      setTrips(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Could not load trips");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Could not log out");
    }
  };

 const openDeleteModal = (trip, event) => {
  event.preventDefault();
  event.stopPropagation();

  setTripToDelete(trip);
};

const closeDeleteModal = () => {
  if (isDeleting) return;
  setTripToDelete(null);
};

const deleteTrip = async () => {
  if (!tripToDelete) return;

  try {
    setIsDeleting(true);

    await api.delete(`/trips/${tripToDelete._id}`);

    setTrips((currentTrips) =>
      currentTrips.filter((trip) => trip._id !== tripToDelete._id)
    );

    toast.success("Trip deleted successfully");
    setTripToDelete(null);
  } catch (error) {
    console.error(
      "Delete trip error:",
      error?.response?.data || error.message
    );

    toast.error(error?.response?.data?.message || "Could not delete trip");
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <Link href="/dashboard" className="dashboard-brand">
          <MapPinned size={28} />
          <span>TravelAI</span>
        </Link>

        <nav className="dashboard-nav">
          <Link href="/dashboard" className="dashboard-nav-link active">
            <Compass size={20} />
            Dashboard
          </Link>

          <Link href="/trips/new" className="dashboard-nav-link">
            <Plus size={20} />
            Plan a trip
          </Link>
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={19} />
          Log out
        </button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-kicker">
              <Sparkles size={17} />
              Your travel workspace
            </p>

            <h1>Welcome to TravelAI</h1>
            <p>Plan, organize, and revisit every journey in one place.</p>
          </div>

          <Link href="/trips/new" className="primary-link-button">
            <Plus size={19} />
            Plan new trip
          </Link>
        </header>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <div className="stat-icon purple">
              <MapPinned size={22} />
            </div>
            <div>
              <span>Total trips</span>
              <strong>{trips.length}</strong>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="stat-icon blue">
              <CalendarDays size={22} />
            </div>
            <div>
              <span>Upcoming plans</span>
              <strong>{trips.filter((trip) => trip.status !== "completed").length}</strong>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="stat-icon orange">
              <Sparkles size={22} />
            </div>
            <div>
              <span>AI itineraries</span>
              <strong>{trips.filter((trip) => trip.status === "generated").length}</strong>
            </div>
          </article>
        </section>

        <section className="trips-section">
          <div className="section-heading">
            <div>
              <h2>Your trips</h2>
              <p>Everything you have planned so far.</p>
            </div>

            {trips.length > 0 && (
              <Link href="/trips/new" className="text-link">
                Add trip <ChevronRight size={17} />
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="dashboard-empty-state">
              <div className="loading-orb" />
              <h3>Loading your trips...</h3>
              <p>TravelAI is preparing your dashboard.</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="empty-icon">
                <Compass size={34} />
              </div>
              <h3>Your next adventure starts here</h3>
              <p>Create a trip and let AI build a personalized plan for you.</p>
              <Link href="/trips/new" className="primary-link-button">
                <Plus size={19} />
                Plan your first trip
              </Link>
            </div>
          ) : (
           <div className="trip-grid">
 {trips.map((trip) => (
  <Link
    href={`/trips/${trip._id}`}
    key={trip._id}
    className="dashboard-trip-card"
  >
    <div className="trip-card-accent" />

    <div className="trip-card-top">
      <span className={`trip-status ${trip.status}`}>
        {trip.status === "generated"
          ? "AI itinerary ready"
          : trip.status === "manual"
          ? "Manual plan"
          : "Planning"}
      </span>

      <div className="trip-card-actions">
        <ChevronRight size={20} className="trip-open-icon" />

        <button
          type="button"
          className="trip-delete-button"
          onClick={(event) => deleteTrip(trip._id, event)}
          aria-label={`Delete ${trip.destination} trip`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>

    <div className="trip-destination-row">
      <div className="trip-destination-icon">
        <MapPinned size={22} />
      </div>

      <div>
        <p className="trip-destination-label">DESTINATION</p>
        <h3>{trip.destination}</h3>
      </div>
    </div>

    <div className="trip-card-meta">
      <span>
        <CalendarDays size={16} />
        {trip.numberOfDays} days
      </span>

      <span>
        <Users size={16} />
        {trip.travelers} traveler{trip.travelers === 1 ? "" : "s"}
      </span>

      <span>
        <CircleDollarSign size={16} />
        {trip.budget}
      </span>
    </div>

    <div className="trip-card-footer">
      <span>
        <Compass size={16} />
        {trip.travelStyle} travel
      </span>

      <span className="trip-interests">
        {trip.interests?.slice(0, 2).join(" • ")}
{trip.interests?.length > 2
  ? ` +${trip.interests.length - 2}`
  : ""}
      </span>
    </div>
  </Link>
))}
</div>
          )}
        </section>
      </section>
      {tripToDelete && (
  <div className="delete-modal-overlay" onClick={closeDeleteModal}>
    <div
      className="delete-modal"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="delete-modal-close"
        onClick={closeDeleteModal}
        disabled={isDeleting}
        aria-label="Close delete confirmation"
      >
        <X size={20} />
      </button>

      <div className="delete-modal-icon">
        <Trash2 size={27} />
      </div>

      <h2>Delete this trip?</h2>

      <p>
        Are you sure you want to delete your trip to{" "}
        <strong>{tripToDelete.destination}</strong>?
      </p>

      <span>This action cannot be undone.</span>

      <div className="delete-modal-actions">
        <button
          type="button"
          className="cancel-delete-button"
          onClick={closeDeleteModal}
          disabled={isDeleting}
        >
          Keep trip
        </button>

        <button
          type="button"
          className="confirm-delete-button"
          onClick={deleteTrip}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Yes, delete trip"}
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}