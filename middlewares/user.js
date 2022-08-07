const CustomError = require("../utils/customError");
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.body.token || req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    res
      .status(501)
      .send(CustomError("Please log in to find more information", 501));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});
