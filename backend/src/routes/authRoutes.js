const express = require("express");

const authController =
  require("../controllers/authController");

const {
  requireAuth,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/login",
  authController.login
);

router.get(
  "/callback",
  authController.callback
);

router.get(
  "/me",
  requireAuth,
  authController.getCurrentUser
);

router.post(
  "/logout",
  authController.logout
);

module.exports = router;