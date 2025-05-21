import { onRequest } from 'firebase-functions/v2/https';
import cors from 'cors';
import express from 'express';
import { OpenAI } from 'openai'; // Ensure this is 'openai', not 'OpenAI' if that was a typo in previous versions

const app = express();

// Global Middlewares
app.use(express.json()); // For parsing application/json

// Strict CORS configuration for your deployed frontend
// This should be placed before your routes if you want it to apply globally
// or on specific routes as you had it.
// For a dedicated API, applying it globally can be cleaner.
app.use(cors({
  origin: ["https://portfolio-pratap.web.app", "http://localhost:3000"], // Add localhost for easier local dev
  methods: ["GET", "POST", "OPTIONS"], // OPTIONS is important for preflight requests
  allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow necessary headers
  credentials: true // If you plan to use cookies or sessions with auth
}));

// Route for Poster Generation
app.post('/generatePoster', async (req, res) => {
  console.log("🚀 Incoming Request to /generatePoster:", {
    body: req.body,
    headers: req.headers // Log headers for debugging auth/content-type issues
  });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY is not set in the function's environment.");
    return res.status(500).json({ error: "Server configuration error: Missing API key." });
  }

  const openai = new OpenAI({ apiKey });

  // Destructure and provide defaults for all expected parameters
  const {
    prompt,
    style = "", // Default to empty string if not provided
    negativePrompt = "", // Default to empty string
    aspectRatio = "1:1",   // Default aspect ratio
    quality = "standard"   // Default quality, can be overridden by request
  } = req.body;

  // Validate prompt
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    console.log("❌ Prompt is missing, empty, or not a string.");
    return res.status(400).json({ error: "Prompt is required and must be a non-empty string." });
  }

  // Validate quality parameter
  const validQualities = ["standard", "hd"];
  if (!validQualities.includes(quality)) {
    console.error(`❌ Invalid quality parameter received: '${quality}'. Supported: ${validQualities.join(', ')}.`);
    return res.status(400).json({ error: `Invalid quality value: '${quality}'. Supported values are: '${validQualities.join("', '")}'.` });
  }

  // Construct the final prompt
  let finalPrompt = prompt.trim();
  if (style && typeof style === 'string' && style.trim()) {
    finalPrompt += `, in the style of ${style.trim()}`;
  }
  if (negativePrompt && typeof negativePrompt === 'string' && negativePrompt.trim()) {
    // Consider how to best phrase avoidance, e.g., "avoiding a, b, c"
    // or relying on DALL-E's native negative prompt capabilities if the model/API supports it directly
    finalPrompt += `, avoiding ${negativePrompt.trim()}`;
  }

  // Determine image size based on aspect ratio
  let imageSize;
  switch (aspectRatio) {
    case "16:9":
      imageSize = "1792x1024";
      break;
    case "9:16":
      imageSize = "1024x1792";
      break;
    case "1:1":
    default: // Default to 1:1 if aspectRatio is missing or invalid
      imageSize = "1024x1024";
      break;
  }
  if (aspectRatio !== "1:1" && aspectRatio !== "16:9" && aspectRatio !== "9:16") {
    console.warn(`⚠️ Unsupported aspectRatio '${aspectRatio}' received. Defaulting to 1:1 (1024x1024).`);
  }


  console.log("ℹ️ Final prompt for OpenAI:", finalPrompt);
  console.log("ℹ️ OpenAI request parameters:", { model: "dall-e-3", n: 1, size: imageSize, quality, response_format: "url" });

  try {
    const imageResponse = await openai.images.generate({
      model: "dall-e-3", // DALL-E 3 is generally preferred if available and affordable
      prompt: finalPrompt,
      n: 1,
      size: imageSize,
      quality: quality, // Use the validated or defaulted quality
      response_format: "url", // "b64_json" is an alternative if you want to handle image data directly
      // user: req.user?.uid // Optional: If you implement user identification for OpenAI tracking/safety
    });

    // Robustly access the image URL
    const imageUrl = imageResponse?.data?.[0]?.url;
    if (!imageUrl) {
      console.error("❌ No image URL returned from OpenAI. Full response:", JSON.stringify(imageResponse, null, 2));
      return res.status(500).json({ error: "Failed to retrieve image URL from OpenAI response." });
    }

    console.log("✅ Image URL successfully generated:", imageUrl);
    res.status(200).json({ imageUrl });

  } catch (error) {
    console.error("❌ Error during OpenAI API call:", error);
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error Details:", {
        status: error.status,
        name: error.name,
        message: error.message,
        code: error.code,
        type: error.type,
        param: error.param,
        headers: error.headers // Useful for rate limit info
      });
      // Send a more user-friendly error message if possible, or the direct OpenAI message
      return res.status(error.status || 500).json({
        error: error.message || "An error occurred while generating the image with the AI service.",
        details: { code: error.code, type: error.type } // Provide some detail to frontend if helpful
      });
    }
    // For other types of errors (network, etc.)
    return res.status(500).json({ error: "An unexpected server error occurred during image generation." });
  }
});

// Optional Root Path for Health Check or API info
app.get('/', (req, res) => {
  console.log("ℹ️ Request to API root path");
  res.status(200).send('DesignCrafter.AI API v1.0 is operational!');
});

// Fallback for unhandled routes within the /api prefix
app.use((req, res) => {
  console.warn(`⚠️ Unhandled route accessed: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Not Found: The requested API endpoint does not exist." });
});


// Export as 'api' Firebase HTTPS Function
export const api = onRequest(
  {
    region: 'us-central1',    // Ensure this matches your desired region
    timeoutSeconds: 360,      // 6 minutes; DALL-E 3 can take time
    memory: '1GiB',           // Adjust based on observed needs, 1GiB is a good start
    secrets: ['OPENAI_API_KEY'],// Crucial for securely accessing the API key
    // concurrency: 10,       // Optional: Set concurrency based on expected load and OpenAI rate limits
    // minInstances: 0,       // Optional: For controlling cold starts
  },
  app
);