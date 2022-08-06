const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const User = require("../models/user");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);

//signing up using otp authentication
exports.sendingOtpForSignup = BigPromise(async (req, res, next) => {
  const { phone, isLogin } = req.body;
  const user = await User.findOne({ phone });

  if (user && !isLogin) {
    res.status(400).send("User Already Exist");
    //next(new CustomError("User Already Exist", 400));
  }
  if (!user && isLogin) {
    return next(new CustomError("User does not exist", 400));
  }

  const response = await sendOtp(phone);

  res.status(200).json({
    response,
  });
});

//verifying the otp
exports.verifyOtpForSignup = BigPromise(async (req, res, next) => {
  const { phone, code, firstname, lastname, email } = req.body;
  if (!phone && !firstname) {
    return next(
      new CustomError("Please provide firstname and mobile number", 400)
    );
  }
  const response = await verifyOtp(phone, code);
  if (response.status == "approved") {
    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
    });
    const token = user.getJwtToken();
    res.status(200).json({
      success: "true",
      message: "User created successfully",
      user,
      token,
    });
  } else {
    return next(new CustomError("Invalid Token", 400));
  }
});
exports.verifyOtpForLogin = BigPromise(async (req, res, next) => {
  const { phone, code } = req.body;
  const response = await verifyOtp(phone, code);
  const user = await User.findOne({ phone });
  if (response.status == "approved") {
    const token = user.getJwtToken();
    res.status(200).json({
      success: "true",
      message: "User logged in  successfully",
      user,
      token,
    });
  } else {
    return next(new CustomError("Invalid Token", 400));
  }
});

exports.allUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

async function sendOtp(phone) {
  const response = await client.verify
    .services(serviceId)
    .verifications.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      channel: "sms",
    });
  {
    console.log(response);
  }
  return response;
}

async function verifyOtp(phone, code) {
  const response = await client.verify
    .services(serviceId)
    .verificationChecks.create({
      to: phone,
      code: code,
    });
  {
    console.log(response);
  }
  return response;
}
