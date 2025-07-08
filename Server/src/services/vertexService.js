const path = require("path");
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");
const logger = require("../utils/logger");

const keyFilePath =
  process.env.VERTEX_KEY_PATH ||
  path.join(__dirname, "../config/vertex-key.json");
const projectId = require(keyFilePath).project_id;
const location = "us-central1";
const modelId = "imagen-4.0-generate-preview-06-06";

async function generatePosterWithVertex({
  prompt,
  aspectRatio = "1:1",
  sampleCount = 1,
  negativePrompt = "blur",
  enhancePrompt = false,
  addWatermark = true,
  includeRaiReason = true,
  language = "auto",
}) {
  if (!prompt) throw new Error("Prompt is required");

  logger.info("[VertexAI] Generating image for prompt:", prompt);

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
    instances: [{ prompt }],
    parameters,
  };

  logger.debug("[VertexAI] Sending request to Vertex endpoint");
  const response = await axios.post(endpoint, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const base64 = response.data?.predictions?.[0]?.bytesBase64Encoded;
  if (!base64) {
    logger.error("[VertexAI] No image data returned from Vertex AI");
    throw new Error("No image data returned from Vertex AI");
  }

  logger.info("[VertexAI] Image generated successfully");
  return { base64 };
}

module.exports = { generatePosterWithVertex };
