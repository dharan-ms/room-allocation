const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0, min: 0 },
    remainingBeds: { type: Number, required: true, min: 0 },
    isFull: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
