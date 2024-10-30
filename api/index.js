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
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if unable to connect
  });

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email === "test@example.com" && password === "password123") {
    return res.status(200).json({ message: "Login successful!" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Registration route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    // Here you would typically save the user to the database
    // For now, just simulate success
    return res.status(200).json({ message: "Registration successful!" });
  }
  return res.status(400).json({ message: "Please fill in all fields" });
});

// Export the app as a serverless function for Vercel
module.exports = app;
