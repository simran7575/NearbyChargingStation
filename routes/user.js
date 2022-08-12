const express = require("express");
const router = express.Router();
const {
  sendingOtpForSignup,
  verifyOtpForSignup,
  verifyOtpForLogin,
  allUsers,
  home,
  userDetails,
} = require("../controllers/userConroller");
const { isLoggedIn } = require("../middlewares/user");

router.route("/signup").post(sendingOtpForSignup);
router.route("/verify").post(verifyOtpForSignup);
router.route("/login").post(verifyOtpForLogin);
router.route("/allusers").get(allUsers);
router.route("/user").get(isLoggedIn, userDetails);

module.exports = router;
