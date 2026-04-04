const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, unique: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    category: { type: String, required: true }
  },
  { timestamps: { createdAt: "bookedAt", updatedAt: false } }
);

module.exports = mongoose.model("Booking", bookingSchema);
