import { testGeminiConnection } from "../services/gemini.service.js";

export const testAI = async (req, res) => {
  try {
    const message = await testGeminiConnection();

    return res.status(200).json({
      success: true,
      message: "Gemini API is connected",
      data: {
        reply: message,
      },
    });
  } catch (error) {
    console.error("Gemini test error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to connect to Gemini API",
    });
  }
};