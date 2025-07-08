const { db } = require("../config/firebase");
const { generatePosterWithVertex } = require("../services/vertexService");
const { uploadToGCS } = require("../utils/gcsUploader");
const logger = require("../utils/logger");

async function createPoster(req, res) {
  logger.info("[createPoster] Request by user:", req.body.userId);
  try {
    const { prompt, style, userId, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'A prompt is required to generate a poster.' });
    }
    console.log(`Received request to generate poster with prompt: "${prompt}"`);
    const simulatedImageUrl = `https://i.pravatar.cc/1024?u=${encodeURIComponent(prompt)}`;
    const posterData = {
      prompt,
      negativePrompt,
      style,
      aspectRatio,
      seed,
      dimensions,
      metadata,
      sampleCount,
      enhancePrompt,
      addWatermark,
      includeRaiReason,
      language,
    } = req.body;

    if (!userId || !prompt) {
      logger.warn("[createPoster] Missing userId or prompt");
      return res.status(400).json({ error: "userId and prompt are required" });
    }

    // 1. Generate image with Vertex AI
    logger.info("[createPoster] Generating image with Vertex AI...");
    const { base64 } = await generatePosterWithVertex({
      prompt,
      aspectRatio,
      sampleCount,
      negativePrompt,
      enhancePrompt,
      addWatermark,
      includeRaiReason,
      language,
    });

    // 2. Upload to GCS and get public URL
    logger.info("[createPoster] Uploading image to GCS...");
    const buffer = Buffer.from(base64, "base64");
    const fileName = `posters/${userId}/${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}.png`;
    const imageUrl = await uploadToGCS(buffer, fileName, "image/png");

    // 3. Save poster metadata with imageUrl (not base64!) in Firestore
    const poster = {
      userId,
      imageUrl,
      prompt,
      negativePrompt,
      style,
      aspectRatio,
      seed,
      dimensions,
      metadata,
      createdAt: new Date(),
    };

    const posterRef = await db.collection("posters").add(poster);
    const savedPoster = (await posterRef.get()).data();

    logger.info("[createPoster] Poster saved with ID:", posterRef.id);

    res.status(201).json({
      id: posterRef.id,
      ...savedPoster,
    });
  } catch (error) {
    logger.error("[createPoster] Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

async function getAllPosters(req, res) {
  logger.info("[getAllPosters] Fetching all posters");
  try {
    // 1. Get the data from the frontend: posterId, userId, rating, and an optional comment.
    const { posterId, userId, rating, comment } = req.body;

    // 2. Validate that we have the essential data.
    if (!posterId || !userId || !rating) {
      return res.status(400).json({ message: 'Poster ID, User ID, and Rating are required.' });
    }

    // 3. Build the feedback document with all the required fields.
    const feedbackDocument = {
      posterId,
      userId,
      rating,
      comment: comment || '', // Use the comment or an empty string if it's not provided.
      timestamp: new Date(),   // Use a server-side timestamp for accuracy.
    };

    // 4. Save the document to a 'feedback' collection in Firestore.
    // If the collection doesn't exist, Firestore will create it automatically.
    const feedbackRef = await db.collection('feedback').add(feedbackDocument);

    console.log(`Feedback saved to Firestore with new document ID: ${feedbackRef.id}`);

    // 5. Send a success response back to the frontend.
    res.status(201).json({ 
      success: true, 
      message: 'Feedback saved successfully.',
      feedbackId: feedbackRef.id // It's good practice to return the new ID.
    });
    res.status(200).json(posters);
  } catch (error) {
    logger.error("[getAllPosters] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getPosterById(req, res) {
  const { id } = req.params;
  logger.info("[getPosterById] Fetching poster:", id);
  try {
    const doc = await db.collection("posters").doc(id).get();
    if (!doc.exists) {
      logger.warn("[getPosterById] Poster not found:", id);
      return res.status(404).json({ error: "Poster not found" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    logger.error("[getPosterById] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function updatePoster(req, res) {
  const { id } = req.params;
  logger.info("[updatePoster] Updating poster:", id);
  const {
    imageUrl,
    prompt,
    negativePrompt,
    style,
    aspectRatio,
    seed,
    dimensions,
    metadata,
  } = req.body;
  try {
    const posterRef = db.collection("posters").doc(id);
    const doc = await posterRef.get();
    if (!doc.exists) {
      logger.warn("[updatePoster] Poster not found:", id);
      return res.status(404).json({ error: "Poster not found" });
    }
    const updateData = {};
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (prompt !== undefined) updateData.prompt = prompt;
    if (negativePrompt !== undefined)
      updateData.negativePrompt = negativePrompt;
    if (style !== undefined) updateData.style = style;
    if (aspectRatio !== undefined) updateData.aspectRatio = aspectRatio;
    if (seed !== undefined) updateData.seed = seed;
    if (dimensions !== undefined) updateData.dimensions = dimensions;
    if (metadata !== undefined) updateData.metadata = metadata;
    updateData.savedAt = new Date();

    await posterRef.update(updateData);
    const updatedDoc = await posterRef.get();
    logger.info("[updatePoster] Poster updated:", id);
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    logger.error("[updatePoster] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function deletePoster(req, res) {
  const { id } = req.params;
  logger.info("[deletePoster] Deleting poster:", id);
  try {
    await db.collection("posters").doc(id).delete();
    logger.info("[deletePoster] Poster deleted:", id);
    res.status(200).json({ message: "Poster deleted successfully" });
  } catch (error) {
    logger.error("[deletePoster] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function totalPosterCount(req, res) {
  logger.info("[totalPosterCount] Counting posters");
  try {
    const snapshot = await db.collection("posters").get();
    res.status(200).json({ totalPosters: snapshot.size });
  } catch (error) {
    logger.error("[totalPosterCount] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getAllPostersByUserId(req, res) {
  try {
    const userId = req.params.id;
    logger.info("[getAllPostersByUserId] Fetching posters for user:", userId);
    if (!userId) {
      logger.warn("[getAllPostersByUserId] Missing userId parameter");
      return res.status(400).json({ error: "Missing userId parameter." });
    }

    const snapshot = await db
      .collection("posters")
      .where("userId", "==", userId)
      .get();
    const posters = [];
    snapshot.forEach((doc) => posters.push({ id: doc.id, ...doc.data() }));
    res.json(posters);
  } catch (error) {
    logger.error("[getAllPostersByUserId] Error:", error);
    res.status(400).json({ error: error.message || error.toString() });

  }
};


module.exports = {
  generatePoster,
  saveFeedback,
};