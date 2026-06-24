import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import tripRoutes from "./routes/trip.routes.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner API is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.use(errorHandler);

export default app;