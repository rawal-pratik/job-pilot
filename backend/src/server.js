const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Job Pilot API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Job Pilot backend running on port ${PORT}`);
});