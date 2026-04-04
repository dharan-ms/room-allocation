const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.warn("MongoDB connection failed:", error.message);
    console.warn("Using in-memory MongoDB for local development.");

    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log("In-memory MongoDB connected successfully");
  }
};

module.exports = connectDB;
