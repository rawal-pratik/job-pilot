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

async function createApplication(applicationData) {
  const {
    companyName,
    companyWebsiteUrl,
    title,
    externalJobId,
    platform,
    url,
    location,
    employmentType,
    salaryMin,
    salaryMax,
    salaryCurrency,
    description,
    postedAt,
    status = "APPLIED",
    appliedAt,
    notes,
  } = applicationData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let companyResult = await client.query(
      `
        SELECT id
        FROM companies
        WHERE LOWER(name) = LOWER($1)
        LIMIT 1;
      `,
      [companyName]
    );

    let companyId;

    if (companyResult.rowCount > 0) {
      companyId = companyResult.rows[0].id;
    } else {
      const newCompanyResult = await client.query(
        `
          INSERT INTO companies (
            name,
            website_url
          )
          VALUES ($1, $2)
          RETURNING id;
        `,
        [companyName, companyWebsiteUrl || null]
      );

      companyId = newCompanyResult.rows[0].id;
    }

    let jobResult;

    if (externalJobId) {
      jobResult = await client.query(
        `
          SELECT id
          FROM jobs
          WHERE platform = $1
            AND external_job_id = $2;
        `,
        [platform, externalJobId]
      );
    } else {
      jobResult = await client.query(
        `
          SELECT id
          FROM jobs
          WHERE company_id = $1
            AND LOWER(title) = LOWER($2)
            AND platform = $3
            AND url = $4;
        `,
        [companyId, title, platform, url]
      );
    }

    let jobId;

    if (jobResult.rowCount > 0) {
      jobId = jobResult.rows[0].id;
    } else {
      const newJobResult = await client.query(
        `
          INSERT INTO jobs (
            company_id,
            title,
            external_job_id,
            platform,
            url,
            location,
            employment_type,
            salary_min,
            salary_max,
            salary_currency,
            description,
            posted_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, $9, $10, $11, $12
          )
          RETURNING id;
        `,
        [
          companyId,
          title,
          externalJobId || null,
          platform,
          url,
          location || null,
          employmentType || null,
          salaryMin || null,
          salaryMax || null,
          salaryCurrency || null,
          description || null,
          postedAt || null,
        ]
      );

      jobId = newJobResult.rows[0].id;
    }

    const applicationResult = await client.query(
      `
        INSERT INTO applications (
          job_id,
          status,
          applied_at,
          notes
        )
        VALUES (
          $1,
          $2,
          COALESCE($3, CURRENT_TIMESTAMP),
          $4
        )
        RETURNING *;
      `,
      [
        jobId,
        status,
        appliedAt || null,
        notes || null,
      ]
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

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  createApplication
};