const CustomError = require("../utils/customError");
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  console.log("Line 7", req.header);
  console.log("Line 7", req.header("Authorization"));
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res
      .status(200)
      .json(CustomError("Please log in to find more information", 501));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});
