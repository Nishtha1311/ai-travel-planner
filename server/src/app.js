import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner API is running 🚀",
  });
});

app.use("/api/auth", authRoutes);

export default app;