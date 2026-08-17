const { google } = require("googleapis");

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
];

function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

module.exports = {
  createOAuthClient,
  GOOGLE_SCOPES,
};