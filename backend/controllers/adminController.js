const Student = require("../models/Student");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const getDashboard = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const fullRooms = await Room.countDocuments({ isFull: true });
    const availableRooms = await Room.countDocuments({ isFull: false });
    const totalAllocatedStudents = await Student.countDocuments({ allocatedRoom: { $ne: null } });
    const totalCategories = (await Room.distinct("category")).length;

    res.json({
      totalRooms,
      totalCategories,
      totalAllocatedStudents,
      availableRooms,
      fullRooms
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching admin dashboard." });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const { category, status } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (status === "full") {
      query.isFull = true;
    } else if (status === "available") {
      query.isFull = false;
    }

    const rooms = await Room.find(query).sort({ roomNumber: 1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching room details." });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const students = await Student.find({
      role: "student",
      $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    })
      .populate("allocatedRoom")
      .sort({ createdAt: -1 });

    res.json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching students." });
  }
};

const getFullRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isFull: true }).sort({ roomNumber: 1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching full rooms." });
  }
};

const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isFull: false }).sort({ roomNumber: 1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching available rooms." });
  }
};

const getRoomsByCategoryForAdmin = async (req, res) => {
  try {
    const category = decodeURIComponent(req.params.category);
    const rooms = await Room.find({ category }).sort({ roomNumber: 1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Server error while filtering by category." });
  }
};

const resetDemoData = async (req, res) => {
  try {
    const deleteStudentsResult = await Student.deleteMany({ role: "student" });
    await Booking.deleteMany({});

    const rooms = await Room.find({});
    for (const room of rooms) {
      room.occupied = 0;
      room.remainingBeds = room.capacity;
      room.isFull = false;
      await room.save();
    }

    res.json({
      message: "Demo data reset successful.",
      studentsRemoved: deleteStudentsResult.deletedCount,
      roomsReset: rooms.length
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while resetting demo data." });
  }
};

module.exports = {
  getDashboard,
  getAllRooms,
  getAllStudents,
  getFullRooms,
  getAvailableRooms,
  getRoomsByCategoryForAdmin,
  resetDemoData
};
