const aiplatform = require("@google-cloud/aiplatform");
const { PredictionServiceClient } = aiplatform.v1;

const project = process.env.GCLOUD_PROJECT;
const location = "us-central1"; // Change if your model is in a different region
const endpoint = `${location}-aiplatform.googleapis.com`;

const client = new PredictionServiceClient({ apiEndpoint: endpoint });

async function generatePosterWithVertex(prompt) {
  console.log("[VertexAI] Generating image with prompt:", prompt);

  const model = `projects/${project}/locations/${location}/publishers/google/models/imagegeneration`;

  const instance = { prompt };
  const instances = [instance];
  const parameters = {}; // Add parameters if needed

  const request = {
    endpoint: model,
    instances,
    parameters,
  };

  try {
    const [response] = await client.predict(request);
    // The response format may vary; adjust as needed
    // For Imagen, the image is usually in response.predictions[0].bytesBase64Encoded
    const base64Image = response.predictions?.[0]?.bytesBase64Encoded;
    if (!base64Image) throw new Error("No image data returned from Vertex AI");
    return Buffer.from(base64Image, "base64");
  } catch (error) {
    console.error("[VertexAI] Error generating image:", error);
    throw error;
  }
}

module.exports = { generatePosterWithVertex };
