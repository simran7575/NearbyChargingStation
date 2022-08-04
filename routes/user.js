const express = require("express");
const router = express.Router();
const {
  sendingOtpForSignup,
  verifyOtpForSignup,
  verifyOtpForLogin,
  allUsers,
} = require("../controllers/userConroller");

router.route("/signup").post(sendingOtpForSignup);
router.route("/verify").post(verifyOtpForSignup);
router.route("/login").post(verifyOtpForLogin);
router.route("/allusers").get(allUsers);

module.exports = router;
