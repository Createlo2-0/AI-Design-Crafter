const express = require("express");
const router = express.Router();
const {
  createPoster,
  getAllPosters,
  getPosterById,
  updatePoster,
  deletePoster,
  totalPosterCount,
} = require("../controllers/posterController");
const { verifyFirebaseToken } = require("../middlewares/authMiddleware");

// Only authenticated users can create, update, or delete posters
router.post("/", verifyFirebaseToken, createPoster);
router.patch("/:id", verifyFirebaseToken, updatePoster);
router.delete("/:id", verifyFirebaseToken, deletePoster);
router.get("/user/:userId", verifyFirebaseToken, getAllPostersByUserId);

// Anyone can view posters or get the count
router.get("/", getAllPosters);
router.get("/:id", getPosterById);
router.get("/ttc", totalPosterCount);

module.exports = router;
