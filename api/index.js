// api/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection handling for serverless environment
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoURI =
    process.env.MONGODB_URI ||
    "mongodb+srv://pavangouthu:Notimportant@usermanagementcluster.ryfbq.mongodb.net/userManagement?retryWrites=true&w=majority";

  try {
    const db = await mongoose.connect(mongoURI, {
      // These options help with serverless deployments
      bufferCommands: false,
      maxPoolSize: 1,
    });

    cachedDb = db;
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Wrap routes in async handlers with proper error handling
app.get("/", async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).send("Welcome to the E-commerce API!");
  } catch (error) {
    console.error("Error in home route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    await connectToDatabase();
    const { email, password } = req.body;

    // Replace this with actual user authentication logic
    if (email === "test@example.com" && password === "password123") {
      return res.status(200).json({ message: "Login successful!" });
    }
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    await connectToDatabase();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Replace this with actual user registration logic
    return res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error in register route:", error);
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
