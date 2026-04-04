const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getStudentMe,
  getCategoryStats,
  getRoomsByCategory,
  bookRoom,
  getMyBooking
} = require("../controllers/studentController");

const router = express.Router();

router.get("/me", protect("student"), getStudentMe);
router.get("/categories", protect("student"), getCategoryStats);
router.get("/rooms/:category", protect("student"), getRoomsByCategory);
router.post("/book-room", protect("student"), bookRoom);
router.get("/my-booking", protect("student"), getMyBooking);

module.exports = router;
