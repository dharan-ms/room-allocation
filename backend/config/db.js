const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`MongoDB connection failed in production: ${error.message}`);
    }

    console.warn("MongoDB connection failed:", error.message);
    console.warn("Using in-memory MongoDB for local development.");

    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri());
    console.log("In-memory MongoDB connected successfully");
  }
};

module.exports = connectDB;
