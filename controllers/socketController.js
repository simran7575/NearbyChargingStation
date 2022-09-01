const BigPromise = require("../middlewares/bigPromise");
const Socket = require("../models/socket");
const CustomError = require("../utils/customError");

exports.createSocket = BigPromise(async (req, res, next) => {
  const { address, latitude, longitude, plugType } = req.body;
  if (!address || !latitude || !longitude) {
    return res
      .status(200)
      .json(CustomError("Please provide address and location", 400));
  }
  const location = {
    type: "Point",
    coordinates: [latitude, longitude],
  };

  const socket = await Socket.create({
    address,
    location,
    plugType,
  });
  return res.status(200).json({
    success: true,
    socket,
  });
});

exports.updateSocket = BigPromise(async (req, res, next) => {
  const socket = await Socket.findById(req.query.id);

  if (!socket) {
    return res.status(200).json(CustomError("Socket not found", 400));
  }
  socket.status = req.body.status;

  await socket.save();

  return res.status(200).json({
    success: true,
    socket,
  });
});
exports.deleteSocket = BigPromise(async (req, res, next) => {
  let socket = await Socket.findById(req.query.id);

  if (!socket) {
    return res.status(200).json(CustomError("Socket not found", 400));
  }

  await socket.remove();
  return res.status(200).json({
    success: true,
    message: "Socket deleted successfully!",
  });
});

exports.getSocketsInRange = BigPromise(async (req, res, next) => {
  const sockets = await Socket.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: req.body.location.coordinates,
        },
        $maxDistance: 100000,
      },
    },
    status: "free",
  });
  if (!sockets) {
    return res.status(200).json(CustomError("No Socket found", 400));
  }

  res.status(200).json({
    success: true,
    sockets,
  });
});
exports.getOneSocket = BigPromise(async (req, res, next) => {
  let socket = await Socket.findById(req.query.id);

  if (!socket) {
    return res.status(200).json(CustomError("Socket not found", 400));
  }

  return res.status(200).json({
    success: true,
    socket,
  });
});
