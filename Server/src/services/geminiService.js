const axios = require("axios");

const GEMINI_API_URL = process.env.GEMINI_API_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generates content using Gemini API.
 * @param {object} options
 * @param {string} options.prompt
 * @returns {Promise<string>} - The generated image URL or base64 (depending on your Gemini model)
 */
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
  // You need to adjust this according to the actual Gemini response.
  // For text: response.data.candidates[0].content.parts[0].text
  // For image: response.data.candidates[0].content.parts[0].inline_data.data (base64)
  return response.data;
}

module.exports = { generatePosterWithGemini };
