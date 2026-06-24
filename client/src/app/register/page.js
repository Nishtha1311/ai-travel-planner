"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LoaderCircle, UserRound, Mail, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../lib/api";
import AuthLayout from "../../components/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error) {
  console.error("Registration error:", error);

  const message =
    error.response?.data?.message ||
    error.message ||
    "Registration failed";

  toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning your next unforgettable journey."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLink="/login"
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <div className="input-wrapper">
            <UserRound size={19} />
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
        </label>

        <label>
          Email address
          <div className="input-wrapper">
            <Mail size={19} />
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
        </label>

        <label>
          Password
          <div className="input-wrapper">
            <Lock size={19} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          className="auth-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="spin" size={19} />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </AuthLayout>
  );
}