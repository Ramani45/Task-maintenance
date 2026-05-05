const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");
const projectRoutes = require("./routes/project");

const app = express();

// ✅ Middleware
// Updated CORS to be more explicit for your local development
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json()); 

// ✅ MongoDB connection
const mongoURI = process.env.MONGO_URI || "mongodb://admin2:admin123@ac-f3kgu8k-shard-00-00.zdmezqr.mongodb.net:27017,ac-f3kgu8k-shard-00-01.zdmezqr.mongodb.net:27017,ac-f3kgu8k-shard-00-02.zdmezqr.mongodb.net:27017/taskmanager?ssl=true&replicaSet=atlas-n3nvby-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("DB Connected Successfully"))
  .catch(err => console.log("DB Connection Error:", err));

// ✅ Register Routes
// These prefixes mean any route in 'task.js' starting with '/' becomes '/api/tasks/'
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/projects", projectRoutes);

// Base Test Route
app.get("/", (req, res) => {
  res.send("Team Task Manager API is Running...");
});

// ✅ Global Error Handler (Prevents the app from crashing on bad requests)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong on the server!" });
});

// Port Configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});