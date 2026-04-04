const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getDashboard,
  getAllRooms,
  getAllStudents,
  getFullRooms,
  getAvailableRooms,
  getRoomsByCategoryForAdmin,
  resetDemoData
} = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", protect("admin"), getDashboard);
router.get("/rooms", protect("admin"), getAllRooms);
router.get("/students", protect("admin"), getAllStudents);
router.get("/full-rooms", protect("admin"), getFullRooms);
router.get("/available-rooms", protect("admin"), getAvailableRooms);
router.get("/category/:category", protect("admin"), getRoomsByCategoryForAdmin);
router.post("/reset-demo-data", protect("admin"), resetDemoData);

module.exports = router;
