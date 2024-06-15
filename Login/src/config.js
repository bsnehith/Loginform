const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/LoginForm", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database Connected Successfully"))
  .catch(err => console.error("Database connection error:", err));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Login Form App' });
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.render('users', { users });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name, password });
    if (user) {
      res.status(200).send('Login Successful');
    } else {
      res.status(401).send('Invalid Credentials');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
