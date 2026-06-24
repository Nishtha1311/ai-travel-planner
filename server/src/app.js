import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Travel Planner API is running 🚀",
  });
});

export default app;