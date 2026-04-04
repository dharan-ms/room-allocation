const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    allocatedRoom: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },
    selectedCategory: { type: String, default: "" },
    resetOtp: { type: String, default: null },
    resetOtpExpiresAt: { type: Date, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
