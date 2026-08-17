const { google } = require("googleapis");

const {
  createOAuthClient,
  GOOGLE_SCOPES,
} = require("../config/google");

function getAuthorizationUrl() {
  const oauth2Client = createOAuthClient();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_SCOPES,
    include_granted_scopes: true,
    prompt: "consent",
  });
}

async function exchangeCodeForTokens(code) {
  const oauth2Client = createOAuthClient();

  const { tokens } =
    await oauth2Client.getToken(code);

  return tokens;
}

function createAuthenticatedClient(tokens) {
  const oauth2Client = createOAuthClient();

  oauth2Client.setCredentials(tokens);

  return oauth2Client;
}

async function listMessages(tokens, options = {}) {
  const auth =
    createAuthenticatedClient(tokens);

  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  const response =
    await gmail.users.messages.list({
      userId: "me",
      maxResults: options.maxResults || 20,
      q: options.query || "",
    });

  return response.data;
}

async function getMessage(tokens, messageId) {
  const auth =
    createAuthenticatedClient(tokens);

  const gmail = google.gmail({
    version: "v1",
    auth,
  });

  const response =
    await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

  return response.data;
}

module.exports = {
  getAuthorizationUrl,
  exchangeCodeForTokens,
  createAuthenticatedClient,
  listMessages,
  getMessage,
};