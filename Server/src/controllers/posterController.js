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
}

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
}

module.exports = {
  createPoster,
  getAllPosters,
  getPosterById,
  updatePoster,
  deletePoster,
  totalPosterCount,
  getAllPostersByUserId,
};
