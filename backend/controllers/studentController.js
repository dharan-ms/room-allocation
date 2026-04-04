const Student = require("../models/Student");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

const getStudentMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate("allocatedRoom");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({
      id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      selectedCategory: student.selectedCategory,
      allocatedRoom: student.allocatedRoom
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching student profile." });
  }
};

const getCategoryStats = async (req, res) => {
  try {
    const categories = await Room.aggregate([
      {
        $group: {
          _id: "$category",
          roomCount: { $sum: 1 },
          totalBeds: { $sum: "$capacity" },
          occupiedBeds: { $sum: "$occupied" },
          availableBeds: { $sum: "$remainingBeds" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const mapped = categories.map((category) => ({
      category: category._id,
      roomCount: category.roomCount,
      totalBeds: category.totalBeds,
      occupiedBeds: category.occupiedBeds,
      availableBeds: category.availableBeds,
      roomType: category._id.includes("Non AC") ? "Non AC" : "AC",
      status:
        category.availableBeds === 0
          ? "Full"
          : category.availableBeds <= Math.ceil(category.totalBeds * 0.2)
          ? "Almost Full"
          : "Available"
    }));

    const noHostelRoomsAvailable = mapped.every((item) => item.availableBeds === 0);

    res.json({ categories: mapped, noHostelRoomsAvailable });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching categories." });
  }
};

const getRoomsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const decodedCategory = decodeURIComponent(category);

    const rooms = await Room.find({
      category: decodedCategory,
      isFull: false
    }).sort({ roomNumber: 1 });

    if (!rooms.length) {
      return res.status(200).json({
        message: "Rooms not available in this category. Please select another category.",
        rooms: []
      });
    }

    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching room list." });
  }
};

const bookRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ message: "Room id is required." });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    if (student.allocatedRoom) {
      return res.status(400).json({ message: "You have already booked a room." });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Invalid room id." });
    }

    if (room.isFull || room.occupied >= room.capacity) {
      return res.status(400).json({ message: "Selected room is already full." });
    }

    room.occupied += 1;
    room.remainingBeds = room.capacity - room.occupied;
    room.isFull = room.occupied >= room.capacity;
    await room.save();

    student.allocatedRoom = room._id;
    student.selectedCategory = room.category;
    await student.save();

    await Booking.create({
      studentId: student._id,
      roomId: room._id,
      category: room.category
    });

    res.status(201).json({
      message: "Room booked successfully.",
      booking: {
        roomId: room._id,
        roomNumber: room.roomNumber,
        category: room.category,
        capacity: room.capacity,
        occupied: room.occupied,
        remainingBeds: room.remainingBeds,
        isFull: room.isFull
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate booking prevented. You already booked a room." });
    }
    res.status(500).json({ message: "Server error while booking room." });
  }
};

const getMyBooking = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate("allocatedRoom");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    if (!student.allocatedRoom) {
      return res.status(404).json({ message: "No booking found for this student." });
    }

    res.json({
      studentName: student.name,
      category: student.selectedCategory,
      room: student.allocatedRoom
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching booking details." });
  }
};

module.exports = {
  getStudentMe,
  getCategoryStats,
  getRoomsByCategory,
  bookRoom,
  getMyBooking
};
