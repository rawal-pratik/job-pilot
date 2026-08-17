const userService = require("../services/userService");

async function createUser(req, res) {
  try {
    const {
      email,
      name,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const existingUser =
      await userService.getUserByEmail(
        email
      );

    if (existingUser) {
      return res.status(409).json({
        error: "User already exists",
        user: existingUser,
      });
    }

    const user =
      await userService.createUser({
        email,
        name,
      });

    res.status(201).json(user);
  } catch (error) {
    console.error(
      "Failed to create user:",
      error
    );

    res.status(500).json({
      error: "Failed to create user",
    });
  }
}

module.exports = {
  createUser,
};