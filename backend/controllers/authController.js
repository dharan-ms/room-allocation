const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const { sendOtpEmail } = require("../utils/emailService");

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Please provide name, email and password." });
    }

    const existingStudent = await Student.findOne({ email: normalizedEmail });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Student registered successfully.",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while registering student." });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const student = await Student.findOne({ email: normalizedEmail });

    if (!student) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken({
      id: student._id,
      role: student.role,
      email: student.email
    });

    res.json({
      message: "Student login successful.",
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while logging in student." });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const token = createToken({
      id: admin._id,
      role: admin.role,
      email: admin.email
    });

    res.json({
      message: "Admin login successful.",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while logging in admin." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required." });
    }

    const student = await Student.findOne({ email: normalizedEmail });
    if (!student) {
      return res.status(404).json({ message: "Student with this email not found." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    student.resetOtp = otp;
    student.resetOtpExpiresAt = expiresAt;
    await student.save();

    const mailResult = await sendOtpEmail({
      to: student.email,
      otp,
      name: student.name
    });

    const response = {
      message: "OTP sent to your email. It is valid for 10 minutes."
    };

    if (!mailResult.delivered && process.env.NODE_ENV !== "production") {
      response.devOtp = otp;
      response.message = "Email config missing. OTP generated in dev mode.";
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: "Server error while sending OTP." });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();

    if (!normalizedEmail || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const student = await Student.findOne({ email: normalizedEmail });
    if (!student || !student.resetOtp || !student.resetOtpExpiresAt) {
      return res.status(400).json({ message: "OTP not requested for this email." });
    }

    if (student.resetOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    }

    if (student.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    return res.json({ message: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error while verifying OTP." });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const normalizedEmail = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();
    const newPassword = req.body.newPassword;

    if (!normalizedEmail || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const student = await Student.findOne({ email: normalizedEmail });
    if (!student || !student.resetOtp || !student.resetOtpExpiresAt) {
      return res.status(400).json({ message: "OTP not requested for this email." });
    }

    if (student.resetOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please request a new OTP." });
    }

    if (student.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    student.resetOtp = null;
    student.resetOtpExpiresAt = null;
    await student.save();

    return res.json({ message: "Password reset successful. Please login now." });
  } catch (error) {
    return res.status(500).json({ message: "Server error while resetting password." });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  loginAdmin,
  forgotPassword,
  verifyOtp,
  resetPasswordWithOtp
};
