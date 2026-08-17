const express = require("express");

const gmailController = require("../controllers/gmailController");

const router = express.Router();

router.get(
  "/auth",
  gmailController.authorizeGmail
);

router.get(
  "/callback",
  gmailController.gmailCallback
);

router.get(
  "/messages",
  gmailController.getMessages
);

router.get(
  "/messages/:messageId",
  gmailController.getMessage
);

module.exports = router;