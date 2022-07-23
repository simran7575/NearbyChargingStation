const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const crypto = require("crypto");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);

//signing up using otp authentication
exports.signup = BigPromise(async (req, res, next) => {
  const { phone, channel } = req.body;
  client.verify
    .services(serviceId)
    .verifications.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
      channel: channel,
    })
    .then((message) => res.status(200).send(message));
});

//verifying the otp
exports.verifyOtp = BigPromise(async (req, res) => {
  const { phone, code } = req.body;

  client.verify
    .services(serviceId)
    .verificationChecks.create({
      to: phone,
      code: code,
    })
    .then((message) => res.status(200).send(message));
});
