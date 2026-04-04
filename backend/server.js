require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { seedRooms, seedDefaultAdmin } = require("./seed/seedRooms");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.length === 0 || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS blocked for this origin"));
    }
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Smart Hostel Room Allocation API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const startServer = async () => {
  await connectDB();

  // Ensures first-time setup has the 100 predefined rooms and default admin.
  await seedRooms();
  await seedDefaultAdmin();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
