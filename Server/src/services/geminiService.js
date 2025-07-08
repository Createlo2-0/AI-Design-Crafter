const axios = require("axios");

const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function generatePosterWithGemini({ prompt }) {
  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

module.exports = { generatePosterWithGemini };
