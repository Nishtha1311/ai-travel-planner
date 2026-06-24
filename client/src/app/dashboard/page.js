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
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../lib/api";

export default function DashboardPage() {
  const router = useRouter();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
                  <div className="trip-card-top">
                    <span className={`trip-status ${trip.status}`}>
                      {trip.status === "generated" ? "AI itinerary ready" : "Planning"}
                    </span>
                    <ChevronRight size={20} />
                  </div>

                  <h3>{trip.destination}</h3>

                  <div className="trip-card-meta">
                    <span>
                      <CalendarDays size={16} />
                      {trip.numberOfDays} days
                    </span>
                    <span>
                      <Users size={16} />
                      {trip.travelers} travelers
                    </span>
                    <span>
                      <CircleDollarSign size={16} />
                      {trip.budget}
                    </span>
                  </div>

                  <p>{trip.travelStyle} travel • {trip.interests?.join(", ")}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}