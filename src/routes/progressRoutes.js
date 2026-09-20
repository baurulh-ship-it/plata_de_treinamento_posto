const express = require("express");
const {
  saveProgress,
  getMyProgress,
  getUserProgress
} = require("../controllers/progressController");
const {
  authMiddleware,
  gestorOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, saveProgress);
router.get("/me", authMiddleware, getMyProgress);
router.get("/user/:userId", authMiddleware, gestorOnly, getUserProgress);

module.exports = router;