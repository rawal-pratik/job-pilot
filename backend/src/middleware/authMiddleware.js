const sessionService =
  require("../services/sessionService");

async function requireAuth(
  req,
  res,
  next
) {
  try {
    const sessionId =
      req.cookies.job_pilot_session;

    if (!sessionId) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const session =
      await sessionService.getSession(
        sessionId
      );

    if (!session) {
      res.clearCookie(
        "job_pilot_session"
      );

      return res.status(401).json({
        error: "Session expired or invalid",
      });
    }

    req.user = {
      id: session.user_id,
      email: session.email,
      name: session.name,
    };

    req.session = {
      id: session.id,
      expiresAt: session.expires_at,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication middleware failed:",
      error
    );

    res.status(500).json({
      error:
        "Authentication check failed",
    });
  }
}

module.exports = {
  requireAuth,
};