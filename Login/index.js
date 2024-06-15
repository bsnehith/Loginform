const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const User = require("./src/models/User"); // Correctly import the User model

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// Use EJS as the view engine
app.set("view engine", "ejs");

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/LoginForm", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.error("Database connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
  try {
    const data = {
      name: req.body.username,
      password: req.body.password
    };

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ name: data.name });

    if (existingUser) {
      return res.status(400).send('User already exists. Please choose a different username.');
    }

    // Hash the password using bcrypt
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; // Replace the original password with the hashed one

    const userdata = new User(data);
    await userdata.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Login user 
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.username });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Compare the hashed password from the database with the plaintext password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).send("Wrong Password");
    }

    res.render("home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Define Port for Application
const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
