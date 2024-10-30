// api/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection optimization for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  // Set connection timeout
  const mongoURI =
    "mongodb+srv://pavangouthu:Notimportant@usermanagementcluster.ryfbq.mongodb.net/userManagement?retryWrites=true&w=majority";

  try {
    const db = await mongoose.connect(mongoURI, {
      bufferCommands: false,
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
      connectTimeoutMS: 10000, // 10 seconds timeout
    });

    cachedDb = db;
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// User model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Home route with quick response
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the E-commerce API!");
});

// Login route with timeout handling
app.post("/login", async (req, res) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Database connection timeout")), 10000)
  );

  try {
    await Promise.race([connectToDatabase(), timeoutPromise]);

    const { email, password } = req.body;

    // Quick validation before DB operations
    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // Check for user in the database
    const user = await User.findOne({ email });

    if (user) {
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(200).json({ message: "Login successful!" });
      }
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    if (error.message === "Database connection timeout") {
      return res
        .status(503)
        .json({ message: "Service temporarily unavailable" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Registration route with timeout handling
app.post("/register", async (req, res) => {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Database connection timeout")), 10000)
  );

  try {
    await Promise.race([connectToDatabase(), timeoutPromise]);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user to the database
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.message === "Database connection timeout") {
      return res
        .status(503)
        .json({ message: "Service temporarily unavailable" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Export the Express app
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
