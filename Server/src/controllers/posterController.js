
// File: Server/src/controllers/posterController.js (Updated for Task 2)

const { db } = require("../config/firebase");

// async function createPoster(req, res) {
//   try {
//     const {
//       userId,
//       prompt,
//       negativePrompt,
//       style,
//       aspectRatio,
//       seed,
//       dimensions,
//       metadata,
//     } = req.body;

//     // Build a custom prompt
//     const customPrompt = `
// Create a high-resolution poster image of: ${prompt}.
// ${style ? `Style: ${style}.` : ""}
// ${aspectRatio ? `Aspect Ratio: ${aspectRatio}.` : ""}
// ${dimensions ? `Dimensions: ${dimensions}.` : ""}
// ${seed ? `Seed: ${seed}.` : ""}
// ${
//   metadata && Object.keys(metadata).length
//     ? `Additional details: ${JSON.stringify(metadata)}.`
//     : ""
// }
// ${negativePrompt ? `Avoid: ${negativePrompt}.` : ""}
// Use vibrant colors and a modern art style.
// `
//       .replace(/\n\s+/g, " ")
//       .trim();

//     console.log("[createPoster] Custom prompt:", customPrompt);

//     // 1. Generate image using OpenAI
//     let imageBuffer;
//     try {
//       imageBuffer = await generatePosterWithOpenAI(customPrompt, {
//         size: dimensions || "1024x1024",
//       });
//       console.log("[createPoster] Image generated successfully.");
//     } catch (genError) {
//       console.error("[createPoster] Error generating image:", genError);
//       throw new Error(
//         "Image generation failed: " + (genError.message || genError.toString())
//       );
//     }

//     // 2. Upload image to GCS
//     const filename = `posters/${userId}_${uuidv4()}.png`;
//     let imageUrl;
//     try {
//       imageUrl = await uploadToGCS(imageBuffer, filename, "image/png");
//       console.log("[createPoster] Image uploaded to GCS:", imageUrl);
//     } catch (uploadError) {
//       console.error(
//         "[createPoster] Error uploading image to GCS:",
//         uploadError
//       );
//       throw new Error(
//         "Image upload failed: " +
//           (uploadError.message || uploadError.toString())
//       );
//     }

//     // 3. Create poster model instance
//     const poster = new PosterModel({
//       userId,
//       imageUrl,
//       prompt,
//       negativePrompt,
//       style,
//       aspectRatio,
//       seed,
//       dimensions,
//       metadata,
//     });

//     // 4. Save poster to Firestore
//     try {
//       const posterRef = await db.collection("posters").add({ ...poster });
//       const posterDoc = await posterRef.get();
//       console.log(
//         "[createPoster] Poster saved to Firestore with ID:",
//         posterDoc.id
//       );
//       res.status(201).json({ id: posterDoc.id, ...posterDoc.data() });
//     } catch (dbError) {
//       console.error(
//         "[createPoster] Error saving poster to Firestore:",
//         dbError
//       );
//       throw new Error(
//         "Saving to Firestore failed: " + (dbError.message || dbError.toString())
//       );
//     }
//   } catch (error) {
//     console.error("[createPoster] Error:", error);
//     res.status(400).json({ error: error.message || error.toString() });
//   }
// }


require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { db } = require('../config/firebase'); // Import the Firestore database connection


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @description   Generate a poster image using an AI model
 * @route         POST /api/posters/generate
 * @access        Private
 */
const generatePoster = async (req, res) => {
  // This is your existing function from Task 1. No changes needed here.
  try {
    const { prompt, style, userId, aspectRatio } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: 'A prompt is required to generate a poster.' });
    }
    console.log(`Received request to generate poster with prompt: "${prompt}"`);
    const simulatedImageUrl = `https://i.pravatar.cc/1024?u=${encodeURIComponent(prompt)}`;
    const posterData = {
      prompt,
      style: style || 'default',
      userId: userId || 'test-user-id',
      timestamp: new Date().toISOString(),
      imageUrl: simulatedImageUrl,
      aspectRatio: aspectRatio || '1:1'
    };
    res.status(200).json({
      success: true,
      message: 'Poster generated successfully (simulated).',
      data: posterData,
    });
  } catch (error) {
    console.error('Error in poster generation:', error);
    res.status(500).json({ message: 'Server error while generating poster.' });

    let imageUrl = "https://dummyimage.com/600x400/000/fff&text=Test+Poster";

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
    };

    // Save poster to Firestore
    try {
      const posterRef = await db.collection("posters").add(poster);
      const posterDoc = await posterRef.get();
      console.log(
        "[createPoster] Poster saved to Firestore with ID:",
        posterDoc.id
      );
      res.status(201).json({ id: posterDoc.id, ...posterDoc.data() });
    } catch (dbError) {
      console.error(
        "[createPoster] Error saving poster to Firestore:",
        dbError
      );
      throw new Error(
        "Saving to Firestore failed: " + (dbError.message || dbError.toString())
      );
    }
  } catch (error) {
    console.error("[createPoster] Error:", error);
    res.status(400).json({ error: error.message || error.toString() });

  }
};


// --- THIS IS THE NEW FUNCTION FOR TASK 2 ---
/**
 * @description   Save user feedback for a poster to Firestore
 * @route         POST /api/posters/feedback
 * @access        Private (to be protected later)
 */
const saveFeedback = async (req, res) => {
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

  } catch (error) {
    console.error('Error saving feedback to Firestore:', error);
    res.status(500).json({ message: 'Server error while saving feedback.' });

async function getAllPostersByUserId(req, res) {
  try {
    const userId = req.params.id;
    if (!userId) {
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
    console.error("[getAllPostersByUserId] Error:", error);
    res.status(400).json({ error: error.message || error.toString() });

  }
};


// Update the exports to include our new function
module.exports = {
  generatePoster,
  saveFeedback,
};