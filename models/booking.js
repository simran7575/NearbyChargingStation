const mongoose = require("mongoose");
const validator = require("validator");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  socket: {
    type: mongoose.Schema.ObjectId,
    ref: "Socket",
    required: true,
  },
  status: {
    type: String,
    enum: {
      values: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      message: "Status can only be - Upcoming, Ongoing, Completed, Cancelled",
    },
    default: "Upcoming",
  },
  chargeStartTime: {
    type: Date,
  },
  chargeEndTime: {
    type: Date,
  },
  durationOfCharge: {
    type: Number,
  },
  unitsConsumed: {
    type: Number,
    default: 10,
  },
  cost: {
    type: Number,
    default: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
