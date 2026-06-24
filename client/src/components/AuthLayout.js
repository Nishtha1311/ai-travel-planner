"use client";

import Link from "next/link";
import { MapPinned, Sparkles, ShieldCheck, CalendarDays } from "lucide-react";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLink,
}) {
  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <Link href="/" className="auth-brand">
          <MapPinned size={30} />
          <span>TravelAI</span>
        </Link>

        <div className="auth-showcase-content">
          <div className="hero-badge">
            <Sparkles size={18} />
            AI-powered travel planning
          </div>

          <h1>
            Plan less.
            <br />
            <span>Experience more.</span>
          </h1>

          <p>
            Build personalized trips with day-wise plans, smart budget estimates,
            and hotel suggestions created around your travel style.
          </p>

          <div className="auth-feature-list">
            <div>
              <CalendarDays size={20} />
              <span>Personalized daily itineraries</span>
            </div>
            <div>
              <Sparkles size={20} />
              <span>AI budget and hotel recommendations</span>
            </div>
            <div>
              <ShieldCheck size={20} />
              <span>Private and secure trip planning</span>
            </div>
          </div>
        </div>
      </section>

      <section className="auth-form-section">
        <div className="auth-form-card">
          <Link href="/" className="mobile-auth-brand">
            <MapPinned size={26} />
            <span>TravelAI</span>
          </Link>

          <h2>{title}</h2>
          <p className="auth-subtitle">{subtitle}</p>

          {children}

          <p className="auth-footer">
            {footerText}{" "}
            <Link href={footerLink}>{footerLinkText}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}