const pool = require("../db");

async function createApplication(applicationData) {
  const {
    jobId,
    status = "APPLIED",
    appliedAt,
    notes,
  } = applicationData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const applicationResult = await client.query(
      `
        INSERT INTO applications (
          job_id,
          status,
          applied_at,
          notes
        )
        VALUES ($1, $2, COALESCE($3, CURRENT_TIMESTAMP), $4)
        RETURNING *;
      `,
      [jobId, status, appliedAt || null, notes || null]
    );

    const application = applicationResult.rows[0];

    await client.query(
      `
        INSERT INTO application_events (
          application_id,
          event_type,
          source,
          metadata
        )
        VALUES ($1, $2, $3, $4);
      `,
      [
        application.id,
        "APPLICATION_CREATED",
        "MANUAL",
        JSON.stringify({
          status,
        }),
      ]
    );

    await client.query("COMMIT");

    return application;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getApplications() {
  const query = `
    SELECT
      applications.*,
      jobs.title AS job_title,
      jobs.platform,
      jobs.url AS job_url,
      companies.name AS company_name
    FROM applications
    JOIN jobs
      ON applications.job_id = jobs.id
    JOIN companies
      ON jobs.company_id = companies.id
    ORDER BY applications.applied_at DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
}

async function getApplicationById(id) {
  const applicationQuery = `
    SELECT
      applications.*,
      jobs.title AS job_title,
      jobs.external_job_id,
      jobs.platform,
      jobs.url AS job_url,
      jobs.location,
      jobs.employment_type,
      jobs.salary_min,
      jobs.salary_max,
      jobs.salary_currency,
      jobs.description,
      jobs.posted_at,
      companies.name AS company_name,
      companies.website_url AS company_website_url
    FROM applications
    JOIN jobs
      ON applications.job_id = jobs.id
    JOIN companies
      ON jobs.company_id = companies.id
    WHERE applications.id = $1;
  `;

  const applicationResult = await pool.query(applicationQuery, [id]);

  if (applicationResult.rowCount === 0) {
    return null;
  }

  const eventsQuery = `
    SELECT *
    FROM application_events
    WHERE application_id = $1
    ORDER BY occurred_at ASC;
  `;

  const eventsResult = await pool.query(eventsQuery, [id]);

  return {
    ...applicationResult.rows[0],
    events: eventsResult.rows,
  };
}

async function updateApplication(id, applicationData) {
  const { status, notes } = applicationData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const existingResult = await client.query(
      `
        SELECT *
        FROM applications
        WHERE id = $1;
      `,
      [id]
    );

    if (existingResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const existingApplication = existingResult.rows[0];

    const updatedStatus = status ?? existingApplication.status;
    const updatedNotes = notes ?? existingApplication.notes;

    const updateResult = await client.query(
      `
        UPDATE applications
        SET
          status = $1,
          notes = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *;
      `,
      [updatedStatus, updatedNotes, id]
    );

    if (status && status !== existingApplication.status) {
      await client.query(
        `
          INSERT INTO application_events (
            application_id,
            event_type,
            source,
            metadata
          )
          VALUES ($1, $2, $3, $4);
        `,
        [
          id,
          "STATUS_CHANGED",
          "MANUAL",
          JSON.stringify({
            from: existingApplication.status,
            to: status,
          }),
        ]
      );
    }

    await client.query("COMMIT");

    return updateResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
};