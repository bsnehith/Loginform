const mongoose = require('mongoose');

const Loginschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", Loginschema);

module.exports = User;
