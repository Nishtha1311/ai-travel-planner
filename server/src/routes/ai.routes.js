import express from "express";
import { testAI } from "../controllers/ai.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/test", protect, testAI);

export default router;