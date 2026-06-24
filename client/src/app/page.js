import Link from "next/link";
import { MapPinned, Sparkles, CalendarDays, Hotel } from "lucide-react";

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={18} />
            AI-powered travel planning
          </div>

          <h1>
            Your next adventure,
            <span> planned by AI.</span>
          </h1>

          <p>
            Tell us where you want to go, your budget, and your travel style.
            TravelAI creates a personalized day-by-day itinerary in seconds.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="primary-button">
              Start Planning
            </Link>
            <Link href="/login" className="secondary-button">
              Sign In
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="trip-card-header">
            <MapPinned size={24} />
            <span>Upcoming trip</span>
          </div>

          <h3>Goa Adventure</h3>
          <p>5 days • 2 travelers • Medium budget</p>

          <div className="mini-itinerary">
            <div>
              <CalendarDays size={18} />
              <span>Day 1: Beach & sunset</span>
            </div>
            <div>
              <Hotel size={18} />
              <span>3 hotel recommendations</span>
            </div>
            <div>
              <Sparkles size={18} />
              <span>AI budget estimate</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}