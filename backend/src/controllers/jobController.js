const jobService = require("../services/jobService");

async function createJob(req, res) {
  try {
    const job = await jobService.createJob(req.body);

    res.status(201).json(job);
  } catch (error) {
    console.error("Failed to create job:", error);

    res.status(500).json({
      error: "Failed to create job",
    });
  }
}

async function getJobs(req, res) {
  try {
    const jobs = await jobService.getJobs();

    res.json(jobs);
  } catch (error) {
    console.error("Failed to fetch jobs:", error);

    res.status(500).json({
      error: "Failed to fetch jobs",
    });
  }
}

async function getJobById(req, res) {
  try {
    const job = await jobService.getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        error: "Job not found",
      });
    }

    res.json(job);
  } catch (error) {
    console.error("Failed to fetch job:", error);

    res.status(500).json({
      error: "Failed to fetch job",
    });
  }
}

module.exports = {
  createJob,
  getJobs,
  getJobById,
};