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
  "imagen-4.0-generate-preview-06-06", // Highest quality, try first
  "imagen-3.0-generate-preview-06-05", // Excellent fallback
  "imagegeneration@006", // A stable, older version
];

async function generatePosterWithVertex({
  prompt,
  style = "Photorealistic",
  aspectRatio = "1:1",
  sampleCount = 1,
  negativePrompt = "blur",
  enhancePrompt = false,
  addWatermark = true,
  includeRaiReason = true,
  language = "auto",
}) {
  if (!prompt) throw new Error("Prompt is required");

  const styleLabel =
    typeof style === "object" && style !== null && style.label
      ? style.label
      : style;

  const finalPrompt = `
    Create a visually compelling, high-resolution image.
    Style: ${styleLabel}.
    Subject: ${prompt}.
    Requirements: The image should be artistically styled as "${styleLabel}", with sharp focus, balanced lighting, and clean composition. Avoid artifacts, distortion, or low-quality elements. Emphasize clarity, detail, and visual appeal.
  `
    .trim()
    .replace(/\s+/g, " ");

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
        return { base64 }; // Success!
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
