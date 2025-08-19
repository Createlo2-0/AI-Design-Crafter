const path = require("path");
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
const logger = require("../utils/logger");

const keyFilePath =
  process.env.VERTEX_KEY_PATH ||
  path.join(__dirname, "../config/vertex-key.json");
const projectId = require(keyFilePath).project_id;
const location = "us-central1";

const imageModels = [
  "imagen-4.0-generate-preview-06-06",
  "imagen-3.0-generate-preview-06-05",
  "imagegeneration@006",
];

function buildPosterPrompt({
  prompt,
  styleLabel,
  language,
  fontStyle,
  posterType,
  occasion,
  targetAudience,
  colorTheme,
  mainText,
}) {
  const clarityPrompt = `
    Create a high-resolution, visually compelling poster.

    Subject: ${prompt}
    Poster Type: ${posterType}
    Occasion/Festival: ${occasion}
    Target Audience: ${targetAudience}
    Color Theme: ${colorTheme}
    Main Text: ${mainText}
    Visual Style: ${styleLabel}

    Text Requirements:
    - All text must be rendered in "${language}" language only. Do not use any other language.
    - Use a clean, highly readable, and professional font style: "${fontStyle}" only. Do not use any other font.
    - The main text should be exactly: "${mainText}" (if provided).
    - Ensure the font is easy to read, visually appealing, and well-integrated into the design.
    - Avoid decorative, funky, or overly stylized fonts that reduce legibility.
    - The text must be sharp, clear, and stand out against the background.
    - Do not use English if another language is specified.

    Design & Quality Guidelines:
    - Resolution: Ultra-sharp, print-quality (minimum 4K).
    - Focus: Clear subject emphasis with balanced composition and lighting.
    - Style Consistency: Match "${styleLabel}" across visuals and typography.
    - Avoid: Distortion, artifacts, pixelation, bad typography, or misplaced text.
    - Ensure: Clean layout, harmonious colors, professional typography, and strong visual impact.

    Final Goal: A poster that looks professionally designed, highly detailed, aesthetically appealing, and ready for real-world use.
  `.trim();

  const variantPrompt = `
    Generate a poster for "${occasion}" with all text in "${language}" using a clean, modern, and highly legible font style: "${fontStyle}". 
    Poster type: ${posterType}. Target audience: ${targetAudience}. Color theme: ${colorTheme}.
    Main text: "${mainText}".
    Prioritize clarity, readability, and professional appearance for all text elements. 
    The poster should be visually balanced, with text that is easy to read and harmoniously integrated into the overall design.
    Do not use any language or font other than specified.
  `.trim();

  return [clarityPrompt.replace(/\s+/g, " "), variantPrompt.replace(/\s+/g, " ")];
}

async function generatePosterWithVertex({
  prompt,
  style = "Photorealistic",
  aspectRatio = "1:1",
  sampleCount = 1,
  negativePrompt = "blur, low quality, distorted text",
  enhancePrompt = false,
  addWatermark = true,
  includeRaiReason = true,
  metadata = "",
  language = "English",
  fontStyle = "default",
  posterType = "",
  occasion = "",
  targetAudience = "",
  colorTheme = "",
  mainText = "",
}) {
  if (!prompt) throw new Error("Prompt is required");

  const styleLabel =
    typeof style === "object" && style !== null && style.label
      ? style.label
      : style;

  const [clarityPrompt, variantPrompt] = buildPosterPrompt({
    prompt,
    styleLabel,
    language,
    fontStyle,
    posterType,
    occasion,
    targetAudience,
    colorTheme,
    mainText,
  });

  const finalPrompt = clarityPrompt;

  logger.info(
    `[VertexAI] Initializing image generation for prompt: "${finalPrompt}"`
  );

  const auth = new GoogleAuth({
    keyFile: keyFilePath,
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  const token =
    typeof tokenResponse === "string" ? tokenResponse : tokenResponse.token;

  if (!token) {
    logger.error("[VertexAI] Failed to get access token");
    throw new Error("Failed to get access token");
  }

  for (const modelId of imageModels) {
    logger.info(
      `[VertexAI] Attempting to generate image with model: ${modelId}`
    );
    const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predict`;

    const parameters = {
      aspectRatio,
      sampleCount,
      negativePrompt,
      enhancePrompt,
      addWatermark,
      includeRaiReason,
      language,
    };

    Object.keys(parameters).forEach(
      (key) => parameters[key] === undefined && delete parameters[key]
    );

    const payload = {
      instances: [{ prompt: finalPrompt }],
      parameters,
    };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const base64 = response.data?.predictions?.[0]?.bytesBase64Encoded;
      if (base64) {
        logger.info(
          `[VertexAI] Image generated successfully with model: ${modelId}`
        );
        return { base64 };
      }

      logger.warn(`[VertexAI] Model ${modelId} returned an empty prediction.`);
      if (response.data?.predictions?.[0]?.raiFilteredReason) {
        throw new Error(
          `Image generation blocked by safety filters: ${response.data.predictions[0].raiFilteredReason}`
        );
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.message || error.message;
      logger.error(`[VertexAI] Error with model ${modelId}: ${errorMessage}`);

      if (errorMessage.includes("Quota exceeded")) {
        logger.warn(
          `[VertexAI] Quota exceeded for ${modelId}. Trying next model...`
        );
        continue;
      } else {
        throw new Error(errorMessage);
      }
    }
  }

  throw new Error(
    "Failed to generate image: All available models failed, mostly due to quota limits."
  );
}

module.exports = { generatePosterWithVertex };