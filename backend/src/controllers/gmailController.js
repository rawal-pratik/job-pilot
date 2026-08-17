const gmailService = require("../services/gmailService");
const gmailConnectionService = require("../services/gmailConnectionService");
const userService = require("../services/userService");

async function authorizeGmail(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const user =
      await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const authorizationUrl =
      gmailService.getAuthorizationUrl(userId);

    res.redirect(authorizationUrl);
  } catch (error) {
    console.error(
      "Failed to start Gmail authorization:",
      error
    );

    res.status(500).json({
      error:
        "Failed to start Gmail authorization",
    });
  }
}

async function gmailCallback(req, res) {
  try {
    const { code, state } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Authorization code is missing",
      });
    }

    if (!state) {
      return res.status(400).json({
        error: "User state is missing",
      });
    }

    const userId = Number(state);

    if (!Number.isInteger(userId)) {
      return res.status(400).json({
        error: "Invalid user state",
      });
    }

    const user =
      await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const tokens =
      await gmailService.exchangeCodeForTokens(
        code
      );

    const googleAccount =
      await gmailService.getGoogleAccountInfo(
        tokens
      );

    const connection =
      await gmailConnectionService
        .createOrUpdateConnection({
          userId,
          googleAccountEmail:
            googleAccount.email,
          accessToken:
            tokens.access_token,
          refreshToken:
            tokens.refresh_token,
          tokenExpiry: tokens.expiry_date
            ? new Date(tokens.expiry_date)
            : null,
        });

    res.json({
      message:
        "Gmail account connected successfully.",
      connection: {
        id: connection.id,
        userId: connection.user_id,
        googleAccountEmail:
          connection.google_account_email,
      },
    });
  } catch (error) {
    console.error(
      "Gmail authorization failed:",
      error
    );

    res.status(500).json({
      error:
        "Gmail authorization failed",
    });
  }
}

async function getMessages(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const connection =
      await gmailConnectionService
        .getConnectionByUserId(userId);

    if (!connection) {
      return res.status(401).json({
        error:
          "Gmail account is not connected",
      });
    }

    const messages =
      await gmailService.listMessages(
        {
          access_token:
            connection.access_token,
          refresh_token:
            connection.refresh_token,
          expiry_date:
            connection.token_expiry
              ? new Date(
                  connection.token_expiry
                ).getTime()
              : null,
        },
        {
          maxResults:
            Number(req.query.maxResults) || 20,
          query: req.query.q || "",
        }
      );

    res.json(messages);
  } catch (error) {
    console.error(
      "Failed to retrieve Gmail messages:",
      error
    );

    res.status(500).json({
      error:
        "Failed to retrieve Gmail messages",
    });
  }
}

async function getMessage(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const connection =
      await gmailConnectionService
        .getConnectionByUserId(userId);

    if (!connection) {
      return res.status(401).json({
        error:
          "Gmail account is not connected",
      });
    }

    const message =
      await gmailService.getMessage(
        {
          access_token:
            connection.access_token,
          refresh_token:
            connection.refresh_token,
          expiry_date:
            connection.token_expiry
              ? new Date(
                  connection.token_expiry
                ).getTime()
              : null,
        },
        req.params.messageId
      );

    res.json(message);
  } catch (error) {
    console.error(
      "Gmail authorization failed:",
      error.response?.data || error
    );
    res.status(500).json({
      error: "Gmail authorization failed",
      details:
        error.response?.data ||
        error.message,
    });
  }
}

module.exports = {
  authorizeGmail,
  gmailCallback,
  getMessages,
  getMessage,
};