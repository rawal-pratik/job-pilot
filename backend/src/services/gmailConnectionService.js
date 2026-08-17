const pool = require("../db");

async function createOrUpdateConnection({
  userId,
  googleAccountEmail,
  accessToken,
  refreshToken,
  tokenExpiry,
}) {
  const result = await pool.query(
    `
      INSERT INTO gmail_connections (
        user_id,
        google_account_email,
        access_token,
        refresh_token,
        token_expiry
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id)
      DO UPDATE SET
        google_account_email = EXCLUDED.google_account_email,
        access_token = EXCLUDED.access_token,
        refresh_token = COALESCE(
          EXCLUDED.refresh_token,
          gmail_connections.refresh_token
        ),
        token_expiry = EXCLUDED.token_expiry,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `,
    [
      userId,
      googleAccountEmail,
      accessToken,
      refreshToken || null,
      tokenExpiry || null,
    ]
  );

  return result.rows[0];
}

async function getConnectionByUserId(userId) {
  const result = await pool.query(
    `
      SELECT *
      FROM gmail_connections
      WHERE user_id = $1;
    `,
    [userId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function deleteConnectionByUserId(userId) {
  const result = await pool.query(
    `
      DELETE FROM gmail_connections
      WHERE user_id = $1
      RETURNING id;
    `,
    [userId]
  );

  return result.rowCount > 0;
}

module.exports = {
  createOrUpdateConnection,
  getConnectionByUserId,
  deleteConnectionByUserId,
};