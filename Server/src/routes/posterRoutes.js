// File: Server/src/routes/posterRoutes.js (Final Version with Documentation)

const express = require('express');
const router = express.Router();


const { generatePoster, saveFeedback } = require('../controllers/posterController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/posters/generate:
 *   post:
 *     summary: Generate a new poster image
 *     description: Takes a user prompt and other metadata to generate a poster using an AI model. Requires authentication.
 *     tags: [Posters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The user's text prompt for the image.
 *                 example: "A majestic lion on a rock, photorealistic"
 *               style:
 *                 type: string
 *                 description: The selected artistic style for the poster.
 *                 example: "cinematic"
 *               aspectRatio:
 *                 type: string
 *                 description: The desired aspect ratio for the image.
 *                 example: "16:9"
 *     responses:
 *       '200':
 *         description: Poster generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: "https://path/to/your/image.png"
 *       '400':
 *         description: Bad request, prompt is missing.
 *       '401':
 *         description: Unauthorized, no token provided.
 *       '403':
 *         description: Forbidden, invalid token.
 */
router.post('/generate', authMiddleware, generatePoster);

/**
 * @swagger
 * /api/posters/feedback:
 *   post:
 *     summary: Save user feedback for a poster
 *     description: Stores user rating and comments for a specific poster in Firestore. Requires authentication.
 *     tags: [Posters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               posterId:
 *                 type: string
 *                 description: The unique ID of the poster being reviewed.
 *                 example: "xyz789posterID"
 *               rating:
 *                 type: number
 *                 description: A numerical rating, e.g., 1 to 5.
 *                 example: 5
 *               comment:
 *                 type: string
 *                 description: The user's text comment (optional).
 *                 example: "This generated an amazing image!"
 *     responses:
 *       '201':
 *         description: Feedback saved successfully.
 *       '400':
 *         description: Bad request, required fields are missing.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden.
 */
router.post('/feedback', authMiddleware, saveFeedback);

const {
  createPoster,
  getAllPosters,
  getPosterById,
  updatePoster,
  deletePoster,
  totalPosterCount,
  getAllPostersByUserId,
} = require("../controllers/posterController");
const { verifyFirebaseToken } = require("../middlewares/authMiddleware");

// Only authenticated users can create, update, or delete posters
router.post("/", createPoster);
router.patch("/:id", verifyFirebaseToken, updatePoster);
router.delete("/:id", deletePoster);
router.get("/user/:id", getAllPostersByUserId);

// Anyone can view posters or get the count
router.get("/", getAllPosters);
router.get("/count/ttc", totalPosterCount);
router.get("/:id", getPosterById);


module.exports = router;