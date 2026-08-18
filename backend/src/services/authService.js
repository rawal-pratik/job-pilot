const { google } = require("googleapis");

const {
  createOAuthClient,
} = require("../config/google");

const userService = require("./userService");

const AUTH_SCOPES = [
  "openid",
  "email",
  "profile",
];

function getAuthorizationUrl() {
  const oauth2Client = createOAuthClient(
    process.env.GOOGLE_AUTH_REDIRECT_URI
  );

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: AUTH_SCOPES,
  });
}

async function authenticateWithGoogle(code) {
    const oauth2Client =
    createOAuthClient(
        process.env.GOOGLE_AUTH_REDIRECT_URI
    );

  const { tokens } =
    await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    version: "v2",
    auth: oauth2Client,
  });

  const response =
    await oauth2.userinfo.get();

  const googleUser = response.data;

  let user =
    await userService.getUserByGoogleSubject(
      googleUser.id
    );

  if (!user) {
    user =
      await userService.getUserByEmail(
        googleUser.email
      );

    if (user) {
      user = await userService.updateGoogleIdentity(
        user.id,
        googleUser.id,
        googleUser.name
      );
    } else {
      user =
        await userService.createUserFromGoogle({
          googleSubject: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
        });
    }
  }

  return user;
}

module.exports = {
  getAuthorizationUrl,
  authenticateWithGoogle,
};