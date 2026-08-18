const authService =
  require("../services/authService");

const sessionService =
  require("../services/sessionService");

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

    const session =
      await sessionService.createSession(
        user.id
      );

    res.cookie(
      "job_pilot_session",
      session.id,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
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
      error
    );

    res.status(500).json({
      error: "Authentication failed",
    });
  }
}

async function logout(req, res) {
  try {
    const sessionId =
      req.cookies.job_pilot_session;

    if (sessionId) {
      await sessionService.deleteSession(
        sessionId
      );
    }

    res.clearCookie(
      "job_pilot_session"
    );

    res.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error(
      "Logout failed:",
      error
    );

    res.status(500).json({
      error: "Logout failed",
    });
  }
}

async function getCurrentUser(req, res) {
  res.json({
    user: req.user,
  });
}

module.exports = {
  login,
  callback,
  logout,
  getCurrentUser
};