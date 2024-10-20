// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs"); // Import the filesystem module
const path = require("path"); // For file path management

const app = express();
const PORT = 5001;

app.use(cors());
app.use(bodyParser.json());

// Login endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Read users from JSON file
  const usersPath = path.join(__dirname, "..", "users.json");
  fs.readFile(usersPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading user data" });
    }

    const users = JSON.parse(data); // Parse JSON data

    // Find the user with matching email and password
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      return res.json({ message: "Login successful" });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  });
});

// Start the server
module.exports = app;
