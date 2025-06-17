const axios = require("axios");

const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generatePosterWithGemini({
  prompt,
  negativePrompt,
  style,
  aspectRatio,
  seed,
  dimensions,
  metadata,
}) {
  const response = await axios.post(
    GEMINI_API_URL,
    {
      prompt,
      negativePrompt,
      style,
      aspectRatio,
      seed,
      dimensions,
      metadata,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
    }
  );
  // Adjust this according to Gemini's actual response
  return response.data.imageUrl;
}

module.exports = { generatePosterWithGemini };
