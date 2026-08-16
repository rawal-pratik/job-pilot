const express = require("express");

const applicationController = require("../controllers/applicationController");

const router = express.Router();

router.get(
  "/",
  applicationController.getApplications
);

router.get(
  "/check-duplicate",
  applicationController.checkDuplicateApplication
);

router.get(
  "/:id",
  applicationController.getApplicationById
);

router.post(
  "/",
  applicationController.createApplication
);

router.patch(
  "/:id",
  applicationController.updateApplication
);

module.exports = router;