const express = require("express");
const router = express.Router();
const {
  createBooking,
  cancelBooking,
  getLoggedInUserBookings,
  updateBooking,
  getOneBooking,
} = require("../controllers/bookingController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/booking/create").post(isLoggedIn, createBooking);
router.route("/booking/cancel").put(isLoggedIn, cancelBooking);
router.route("/mybookings").get(isLoggedIn, getLoggedInUserBookings);
router.route("/booking/update/:id").put(isLoggedIn, updateBooking);
router.route("/onebooking").get(isLoggedIn, getOneBooking);

module.exports = router;
