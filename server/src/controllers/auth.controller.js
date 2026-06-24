import { loginUser, registerUser } from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res.cookie("token", result.token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.cookie("token", result.token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};