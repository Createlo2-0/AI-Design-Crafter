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
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", createPoster);
router.patch("/:id", authMiddleware, updatePoster);
router.delete("/:id", deletePoster);
router.get("/user/:id", getAllPostersByUserId);
router.get("/", getAllPosters);
router.get("/count/ttc", totalPosterCount);
router.get("/:id", getPosterById);

module.exports = router;
