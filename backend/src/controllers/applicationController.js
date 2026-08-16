const applicationService = require("../services/applicationService");

async function createApplication(req, res) {
  try {
    const application = await applicationService.createApplication(
      req.body
    );

    res.status(201).json(application);
  } catch (error) {
    console.error("Failed to create application:", error);

    res.status(500).json({
      error: "Failed to create application",
    });
  }
}

async function getApplications(req, res) {
  try {
    const applications = await applicationService.getApplications();

    res.json(applications);
  } catch (error) {
    console.error("Failed to fetch applications:", error);

    res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
}

async function getApplicationById(req, res) {
  try {
    const application = await applicationService.getApplicationById(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json(application);
  } catch (error) {
    console.error("Failed to fetch application:", error);

    res.status(500).json({
      error: "Failed to fetch application",
    });
  }
}

async function updateApplication(req, res) {
  try {
    const application = await applicationService.updateApplication(
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
    console.error("Failed to update application:", error);

    res.status(500).json({
      error: "Failed to update application",
    });
  }
}

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
};