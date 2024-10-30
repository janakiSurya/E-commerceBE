const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "test@example.com" && password === "password123") {
    res.status(200).json({ message: "Login successful!" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Registration route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.status(200).json({ message: "Registration successful!" });
  } else {
    res.status(400).json({ message: "Please fill in all fields" });
  }
});

module.exports = app; // Export the app for Vercel
