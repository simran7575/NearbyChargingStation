const mongoose = require("mongoose");
const validator = require("validator");

const socketSchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "Please provide socket address"],
  },
  location: {
    type: { type: String },
    coordinates: Array,
  },
  status: {
    type: String,
    enum: {
      values: ["free", "booked"],
      message: "Status can only be - free or booked",
    },
    default: "free",
  },
  plugType: {
    type: String,
    enum: {
      values: ["Type-A", "Type-C"],
      message: "Plug Type can only be - type A or type C",
    },
    default: "Type-A",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

socketSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Socket", socketSchema);
