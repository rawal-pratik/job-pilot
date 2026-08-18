const crypto = require("crypto");

const pool = require("../db");

const SESSION_DURATION_MS =
  7 * 24 * 60 * 60 * 1000;

async function createSession(userId) {
  const sessionId =
    crypto.randomUUID();

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_MS
  );

  const result = await pool.query(
    `
      INSERT INTO sessions (
        id,
        user_id,
        expires_at
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    [
      sessionId,
      userId,
      expiresAt,
    ]
  );

  return result.rows[0];
}

async function getSession(sessionId) {
  const result = await pool.query(
    `
      SELECT
        sessions.id,
        sessions.user_id,
        sessions.expires_at,
        users.email,
        users.name
      FROM sessions
      JOIN users
        ON sessions.user_id = users.id
      WHERE sessions.id = $1
        AND sessions.expires_at > CURRENT_TIMESTAMP;
    `,
    [sessionId]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function deleteSession(sessionId) {
  await pool.query(
    `
      DELETE FROM sessions
      WHERE id = $1;
    `,
    [sessionId]
  );
}

module.exports = {
  createSession,
  getSession,
  deleteSession,
};