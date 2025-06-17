const { db } = require("../config/firebase");
const PosterModel = require("../models/posterModel");
const { generatePosterWithGemini } = require("../services/geminiService");
// Create a new poster
async function createPoster(req, res) {
  try {
    const {
      userId,
      prompt,
      negativePrompt,
      style,
      aspectRatio,
      seed,
      dimensions,
      metadata,
    } = req.body;

    const customPrompt = `Create a high-resolution poster image of: ${prompt}. Use vibrant colors and a modern art style.`;

    // 1. Generate image using Gemini AI
    const imageUrl = await generatePosterWithGemini({
      prompt: customPrompt,
    });

    // 2. Create poster model instance
    const poster = new PosterModel({
      userId,
      imageUrl,
      prompt,
      negativePrompt,
      style,
      aspectRatio,
      seed,
      dimensions,
      metadata,
    });

    // 3. Save poster to Firestore
    const posterRef = await db.collection("posters").add({ ...poster });
    const posterDoc = await posterRef.get();

    res.status(201).json({ id: posterDoc.id, ...posterDoc.data() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all posters
async function getAllPosters(req, res) {
  try {
    const snapshot = await db.collection("posters").get();
    const posters = [];
    snapshot.forEach((doc) => {
      posters.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(posters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get poster by ID
async function getPosterById(req, res) {
  const { id } = req.params;
  try {
    const doc = await db.collection("posters").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Poster not found" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update poster
async function updatePoster(req, res) {
  const { id } = req.params;
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
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete poster
async function deletePoster(req, res) {
  const { id } = req.params;
  try {
    await db.collection("posters").doc(id).delete();
    res.status(200).json({ message: "Poster deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function totalPosterCount(req, res) {
  try {
    const snapshot = await db.collection("posters").get();
    res.status(200).json({ totalPosters: snapshot.size });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createPoster,
  getAllPosters,
  getPosterById,
  updatePoster,
  deletePoster,
  totalPosterCount,
};
