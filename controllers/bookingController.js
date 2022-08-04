const BigPromise = require("../middlewares/bigPromise");
const Booking = require("../models/booking");
const Socket = require("../models/socket");
const CustomError = require("../utils/customError");

exports.createBooking = BigPromise(async (req, res, next) => {
  const { socket } = req.body;
  if (!socket) {
    return next(new CustomError("Please provide socket id", 400));
  }

  const booking = await Booking.create({
    socket,
    user: req.user._id,
  });
  await updateSocketStatus(socket, "booked");
  res.status(200).json({
    success: true,
    message: "Booking Created",
    booking,
  });
});

exports.getLoggedInUserBookings = BigPromise(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id });
  if (!bookings) {
    return next(new CustomError("No Bookings found", 404));
  }

  res.status(200).json({
    success: true,
    bookings,
  });
});
exports.updateBooking = BigPromise(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new CustomError("No Bookings found", 404));
  }
  if (booking.status == "Completed" || booking.status == "Cancelled") {
    return next(new CustomError(`Booking is already ${booking.status} `, 401));
  }
  //Ongoing or Completed
  if (req.body.status == "Ongoing") {
    (booking.chargeStartTime = req.body.startTime),
      (booking.status = "Ongoing");
    await booking.save();
    res.status(200).json({
      success: true,
      booking,
    });
  } else if (req.body.status == "Completed") {
    booking.chargeEndTime = req.body.endTime;
    booking.status = "Completed";
    booking.cost = req.body.cost;
    booking.unitsConsumed = req.body.units;
    booking.durationOfCharge =
      (booking.chargeEndTime - booking.chargeStartTime) / 1000;
    await booking.save();
    await updateSocketStatus(booking.socket, "free");
    res.status(200).json({
      success: true,
      booking,
    });
  }
});
exports.cancelBooking = BigPromise(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new CustomError("No Bookings found", 404));
  }
  booking.status = "Cancelled";
  booking.cost = null;
  booking.unitsConsumed = null;
  booking.chargeStartTime = null;
  booking.chargeEndTime = null;
  booking.durationOfCharge = null;
  await booking.save();
  await updateSocketStatus(booking.socket, "free");
  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
  });
});

async function updateSocketStatus(socketId, status) {
  const socket = await Socket.findById(socketId);
  socket.status = status;
  await socket.save({ validateBeforeSave: true });
}
