const { google } = require("googleapis");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
];

function createOAuthClient(redirectUri) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

module.exports = {
  createOAuthClient,
  GOOGLE_SCOPES,
};