import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

export const tripAPI = {
  createTrip: (tripData) => api.post("/trips", tripData),
  getMyTrips: () => api.get("/trips"),
  getTripById: (tripId) => api.get(`/trips/${tripId}`),
};

export const aiAPI = {
  generateItinerary: (tripId) => api.post(`/ai/generate/${tripId}`),
};

export default api;