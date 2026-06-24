import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

import {
  validateRegister,
  validateLogin,
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", validateRegister, register);

router.post("/login", validateLogin, login);

router.post("/logout", logout);

router.get("/me", protect, getCurrentUser);

export default router;