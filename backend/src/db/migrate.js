const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const pool = require("./index");

async function migrate() {
  const migrationsPath = path.join(__dirname, "migrations");

  const files = fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const file of files) {
      const result = await pool.query(
        "SELECT 1 FROM schema_migrations WHERE migration_name = $1",
        [file]
      );

      if (result.rowCount > 0) {
        console.log(`Skipping migration: ${file}`);
        continue;
      }

      console.log(`Running migration: ${file}`);

      const filePath = path.join(migrationsPath, file);
      const sql = fs.readFileSync(filePath, "utf8");

      await pool.query("BEGIN");

      try {
        await pool.query(sql);

        await pool.query(
          "INSERT INTO schema_migrations (migration_name) VALUES ($1)",
          [file]
        );

        await pool.query("COMMIT");

        console.log(`Completed migration: ${file}`);
      } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
      }
    }

    console.log("All migrations completed.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();