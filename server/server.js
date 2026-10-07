const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// 1. Initialize Express first
const app = express();

// 2. Apply Middleware
app.use(cors()); // Resolves the CORS issue
app.use(express.json()); // Parses incoming JSON requests

// 3. Define Mongoose Schema and Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
});
const Student = mongoose.model("Student", studentSchema);

// 4. API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve students" });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        message: "Enter a valid name and email address",
      });
    }
    const student = await Student.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered",
      });
    }
    res.status(500).json({ message: "Failed to add student" });
  }
});

// 5. Database Connection and Server Start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

app.use(express.static(path.join(__dirname, "../client/dist")));
startServer();