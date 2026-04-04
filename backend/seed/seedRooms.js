require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Room = require("../models/Room");
const Admin = require("../models/Admin");
const { ROOM_CATEGORIES, buildRoomNumbers } = require("../utils/roomConfig");

const createRoomDocs = () => {
  const rooms = [];

  ROOM_CATEGORIES.forEach((categoryConfig) => {
    const roomNumbers = buildRoomNumbers(categoryConfig);
    roomNumbers.forEach((roomNumber) => {
      rooms.push({
        roomNumber,
        category: categoryConfig.name,
        capacity: categoryConfig.capacity,
        occupied: 0,
        remainingBeds: categoryConfig.capacity,
        isFull: false
      });
    });
  });

  return rooms;
};

const seedRooms = async () => {
  const existingCount = await Room.countDocuments();
  if (existingCount === 100) {
    console.log("Room seed already exists. Skipping room seed.");
    return;
  }

  await Room.deleteMany({});
  const roomDocs = createRoomDocs();
  await Room.insertMany(roomDocs);
  console.log("Room seed completed with 100 rooms.");
};

const seedDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@hostel.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log("Default admin already exists. Skipping admin seed.");
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 10);
  await Admin.create({
    email: adminEmail,
    password: hashed
  });

  console.log(`Default admin created -> email: ${adminEmail}`);
};

const runSeed = async () => {
  try {
    await connectDB();
    await seedRooms();
    await seedDefaultAdmin();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  runSeed();
}

module.exports = { seedRooms, seedDefaultAdmin };
