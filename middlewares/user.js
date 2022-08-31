const CustomError = require("../utils/customError");
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  if (!req.header("Authorization")) {
    return res.status(200).json(CustomError("Token missing", 401));
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res
      .status(200)
      .json(CustomError("Please log in to find more information", 501));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (error) {
    return res.status(200).json(CustomError("Token has expired", 501));
  }

  next();
});
