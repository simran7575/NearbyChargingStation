const express = require("express");
const router = express.Router();
const {
  createSocket,
  updateSocket,
  deleteSocket,
  getSocketsInRange,
  getOneSocket,
} = require("../controllers/socketController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/socket/create").post(isLoggedIn, createSocket);

router
  .route("/socket")
  .get(isLoggedIn, getOneSocket)
  .put(isLoggedIn, updateSocket)
  .delete(isLoggedIn, deleteSocket);

router.route("/sockets").post(isLoggedIn, getSocketsInRange);

module.exports = router;
