const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  editUserProfile,
  ttc,
  deleteUser
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/ttc", ttc);
router.get("/:id", getUserById);
router.patch("/:id", editUserProfile);
router.delete("/:id", deleteUser);

module.exports = router;
