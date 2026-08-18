const pool = require("../db");

async function createUser({
  email,
  name,
}) {
  const result = await pool.query(
    `
      INSERT INTO users (
        email,
        name
      )
      VALUES ($1, $2)
      RETURNING *;
    `,
    [
      email,
      name || null,
    ]
  );

  return result.rows[0];
}

async function getUserById(id) {
  const result = await pool.query(
    `
      SELECT *
      FROM users
      WHERE id = $1;
    `,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query(
    `
      SELECT *
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1;
    `,
    [email]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function findOrCreateUser({
  email,
  name,
}) {
  const existingUser =
    await getUserByEmail(email);

  if (existingUser) {
    return existingUser;
  }

  return createUser({
    email,
    name,
  });
}

async function getUserByGoogleSubject(googleSubject) {
  const result = await pool.query(
    `
      SELECT *
      FROM users
      WHERE google_subject = $1
      LIMIT 1;
    `,
    [googleSubject]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
}

async function createUserFromGoogle({
  googleSubject,
  email,
  name,
}) {
  const result = await pool.query(
    `
      INSERT INTO users (
        google_subject,
        email,
        name
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    [
      googleSubject,
      email,
      name || null,
    ]
  );

  return result.rows[0];
}

async function updateGoogleIdentity(
  id,
  googleSubject,
  name
) {
  const result = await pool.query(
    `
      UPDATE users
      SET
        google_subject = $1,
        name = COALESCE($2, name),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `,
    [
      googleSubject,
      name || null,
      id,
    ]
  );

  return result.rows[0] || null;
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  findOrCreateUser,
  getUserByGoogleSubject,
  createUserFromGoogle,
  updateGoogleIdentity,
};