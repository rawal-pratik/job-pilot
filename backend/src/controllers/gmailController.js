const gmailService = require("../services/gmailService");

let gmailTokens = null;

async function authorizeGmail(req, res) {
  try {
    const authorizationUrl =
      gmailService.getAuthorizationUrl();

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
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Authorization code is missing",
      });
    }

    const tokens =
      await gmailService.exchangeCodeForTokens(
        code
      );

    gmailTokens = tokens;

    res.json({
      message:
        "Gmail account connected successfully.",
    });
  } catch (error) {
    console.error(
      "Gmail authorization failed:",
      error
    );

    res.status(500).json({
      error: "Gmail authorization failed",
    });
  }
}

async function getMessages(req, res) {
  try {
    if (!gmailTokens) {
      return res.status(401).json({
        error: "Gmail account is not connected",
      });
    }

    const messages =
      await gmailService.listMessages(
        gmailTokens,
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
    if (!gmailTokens) {
      return res.status(401).json({
        error: "Gmail account is not connected",
      });
    }

    const message =
      await gmailService.getMessage(
        gmailTokens,
        req.params.messageId
      );

    res.json(message);
  } catch (error) {
    console.error(
      "Failed to retrieve Gmail message:",
      error
    );

    res.status(500).json({
      error:
        "Failed to retrieve Gmail message",
    });
  }
}

module.exports = {
  authorizeGmail,
  gmailCallback,
  getMessages,
  getMessage,
};