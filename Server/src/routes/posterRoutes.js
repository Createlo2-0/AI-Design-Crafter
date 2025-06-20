const express = require("express");
const router = express.Router();
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
