const express = require("express");
const { listCourses, getCourse } = require("../controllers/courseController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, listCourses);
router.get("/:id", authMiddleware, getCourse);

module.exports = router;