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

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  findOrCreateUser,
};