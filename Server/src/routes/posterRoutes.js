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

router.post("/", createPoster);
router.get("/", getAllPosters);
router.get("/:id", getPosterById);
router.patch("/:id", updatePoster);
router.delete("/:id", deletePoster);
router.get("/ttc", totalPosterCount);

module.exports = router;
