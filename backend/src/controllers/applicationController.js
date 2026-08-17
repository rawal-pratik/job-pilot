const applicationService = require("../services/applicationService");

const VALID_STATUSES = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
  "NO_RESPONSE",
];

async function createApplication(req, res) {
  try {
    const application =
      await applicationService.createApplication(
        req.body
      );

    res.status(201).json(application);
  } catch (error) {
    if (
      error.code ===
      "APPLICATION_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        error:
          "An application already exists for this job.",
        application: error.application,
      });
    }

    console.error(
      "Failed to create application:",
      error
    );

    res.status(500).json({
      error: "Failed to create application",
    });
  }
}

async function getApplications(req, res) {
  try {
    const applications =
      await applicationService.getApplications();

    res.json(applications);
  } catch (error) {
    console.error(
      "Failed to fetch applications:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
}

async function getApplicationById(req, res) {
  try {
    const application =
      await applicationService.getApplicationById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json(application);
  } catch (error) {
    console.error(
      "Failed to fetch application:",
      error
    );

    res.status(500).json({
      error: "Failed to fetch application",
    });
  }
}

async function updateApplication(req, res) {
  try {
    const { status } = req.body;

    if (
      status &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        error: `Invalid application status. Valid statuses are: ${VALID_STATUSES.join(
          ", "
        )}`,
      });
    }

    const application =
      await applicationService.updateApplication(
        req.params.id,
        req.body
      );

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json(application);
  } catch (error) {
    console.error(
      "Failed to update application:",
      error
    );

    res.status(500).json({
      error: "Failed to update application",
    });
  }
}

async function checkDuplicateApplication(
  req,
  res
) {
  try {
    const duplicate =
      await applicationService.checkDuplicateApplication(
        req.query
      );

    res.json({
      duplicate: Boolean(duplicate),
      application: duplicate,
    });
  } catch (error) {
    console.error(
      "Failed to check duplicate application:",
      error
    );

    res.status(500).json({
      error:
        "Failed to check duplicate application",
    });
  }
}

async function getApplicationByJobId(req, res) {
  try {
    const application =
      await applicationService.findApplicationByJobId(
        req.params.jobId
      );

    if (!application) {
      return res.status(404).json({
        error:
          "No application found for this job.",
      });
    }

    res.json(application);
  } catch (error) {
    console.error(
      "Failed to fetch application by job:",
      error
    );

    res.status(500).json({
      error:
        "Failed to fetch application by job",
    });
  }
}

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  checkDuplicateApplication,
  getApplicationByJobId
};