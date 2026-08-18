const authService = require("../services/authService");

async function login(req, res) {
  try {
    const authorizationUrl =
      authService.getAuthorizationUrl();

    res.redirect(authorizationUrl);
  } catch (error) {
    console.error(
      "Failed to start authentication:",
      error
    );

    res.status(500).json({
      error:
        "Failed to start authentication",
    });
  }
}

async function callback(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error:
          "Authorization code is missing",
      });
    }

    const user =
      await authService.authenticateWithGoogle(
        code
      );

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(
      "Authentication failed:",
      error.response?.data || error
    );

    res.status(500).json({
      error: "Authentication failed",
      details:
        error.response?.data ||
        error.message,
    });
  }
}

module.exports = {
  login,
  callback,
};