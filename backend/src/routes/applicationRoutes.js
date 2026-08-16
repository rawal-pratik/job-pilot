const express = require("express");

const applicationController = require("../controllers/applicationController");

const router = express.Router();

router.post("/", applicationController.createApplication);
router.get("/", applicationController.getApplications);
router.get("/:id", applicationController.getApplicationById);
router.patch("/:id", applicationController.updateApplication);

module.exports = router;