const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generatePosterWithOpenAI(prompt, options = {}) {
  console.log("[OpenAI] Called generatePosterWithOpenAI");
  console.log("[OpenAI] Prompt:", prompt);
  console.log("[OpenAI] Options:", options);

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    console.log("[OpenAI] API response received.");
    if (
      !response ||
      !response.data ||
      !Array.isArray(response.data) ||
      !response.data[0] ||
      !response.data[0].b64_json
    ) {
      console.error("[OpenAI] Unexpected API response format:", response);
      throw new Error("Unexpected OpenAI API response format.");
    }

    const b64 = response.data[0].b64_json;
    console.log("[OpenAI] Successfully extracted base64 image data.");
    return Buffer.from(b64, "base64");
  } catch (error) {
    // Log the error details
    console.error("[OpenAI] Error during image generation:", error);
    if (error.response) {
      console.error("[OpenAI] Error response status:", error.response.status);
      console.error("[OpenAI] Error response data:", error.response.data);
    }
    throw error;
  }
}

module.exports = { generatePosterWithOpenAI };