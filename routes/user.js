const express = require("express");
const router = express.Router();
const { signup, verifyOtp } = require("../controllers/userConroller");

router.route("/signup").post(signup);
router.route("/verify").post(verifyOtp);

module.exports = router;
