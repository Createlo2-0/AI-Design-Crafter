const express = require('express');
const router = express.Router();
const {
  createPoster,
  getAllPosters,
  getPosterById,
  updatePoster,
  deletePoster,
  totalPosterCount,
  getAllPostersByUserId,
  generatePoster,
  saveFeedback
} = require("../controllers/posterController");
const { verifyFirebaseToken } = require("../middlewares/authMiddleware");
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/generate', authMiddleware, generatePoster);
router.post('/feedback', authMiddleware, saveFeedback);
router.post("/", createPoster);
router.patch("/:id", verifyFirebaseToken, updatePoster);
router.delete("/:id", deletePoster);
router.get("/user/:id", getAllPostersByUserId);

// Anyone can view posters or get the count
router.get("/", getAllPosters);
router.get("/count/ttc", totalPosterCount);
router.get("/:id", getPosterById);


module.exports = router;