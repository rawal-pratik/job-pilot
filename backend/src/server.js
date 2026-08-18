const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");

const pool = require("./db");

const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const gmailRoutes = require("./routes/gmailRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "Job Pilot API is running",
  });
});

app.get("/api/health/db", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/gmail", gmailRoutes);

app.listen(PORT, () => {
  console.log(`Job Pilot backend running on port ${PORT}`);
});