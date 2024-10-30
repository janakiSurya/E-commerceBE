const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoURI =
  "mongodb+srv://pavangouthu:Notimportant@usermanagementcluster.ryfbq.mongodb.net/userManagement?retryWrites=true&w=majority";

// MongoDB connection
mongoose
  .connect(mongoURI, {
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

  // Replace this with actual user authentication logic
  if (email === "test@example.com" && password === "password123") {
    return res.status(200).json({ message: "Login successful!" });
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// Registration route
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Replace this with actual user registration logic (e.g., saving to the database)
  if (email && password) {
    // Here you would typically save the user to the database
    // For now, just simulate success
    return res.status(200).json({ message: "Registration successful!" });
  }

  return res.status(400).json({ message: "Please fill in all fields" });
});

// Export the app as a serverless function for Vercel
module.exports = app;
