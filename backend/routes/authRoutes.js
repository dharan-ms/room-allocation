const express = require("express");
const {
  registerStudent,
  loginStudent,
  loginAdmin,
  forgotPassword,
  verifyOtp,
  resetPasswordWithOtp
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.post("/admin/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPasswordWithOtp);

module.exports = router;
