const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide a firstname"],
    minlength: [3, "Name should be more than 2 characters"],
    maxlength: [40, "Name should be under 40 characters"],
    validate: [validator.isAlpha, "Name should contain only alphabets"],
  },
  lastname: {
    type: String,
    maxlength: [40, "Name should be under 40 characters"],
  },
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Please add phone number"],
    validate: [validator.isMobilePhone, "Please enter a valid Mobile Number"],
    unique: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
