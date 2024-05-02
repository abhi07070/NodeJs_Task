const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
dotenv.config();

app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const DB = process.env.MONGO_DB;

// Connect to MongoDB
mongoose.connect(DB);

// User Registration API
app.post("/api/register", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    if (!email || !password || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user with same email already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid password" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password with a salt of 10 rounds
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Login API
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Forget User Password API
app.post("/api/forgot-password", async (req, res) => {
  const { email, newPassword } = req.body; // Assuming the request includes a new password
  try {
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Hash the new password before saving
    user.password = bcrypt.hashSync(newPassword, 10); // Hash the password with a salt of 10 rounds
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
