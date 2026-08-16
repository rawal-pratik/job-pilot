const pool = require("../db");

async function createJob(jobData) {
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
  } = jobData;

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
        [companyName, companyWebsiteUrl]
      );

      companyId = newCompanyResult.rows[0].id;
    }

    const query = `
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
      RETURNING *;
    `;

    const values = [
      companyId,
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
    ];

    const jobResult = await client.query(query, values);

    await client.query("COMMIT");

    return {
      ...jobResult.rows[0],
      company_name: companyName,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getJobs() {
  const query = `
    SELECT
      jobs.*,
      companies.name AS company_name
    FROM jobs
    JOIN companies
      ON jobs.company_id = companies.id
    ORDER BY jobs.created_at DESC;
  `;

  const result = await pool.query(query);

  return result.rows;
}

async function getJobById(id) {
  const query = `
    SELECT
      jobs.*,
      companies.name AS company_name
    FROM jobs
    JOIN companies
      ON jobs.company_id = companies.id
    WHERE jobs.id = $1;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0] || null;
}

module.exports = {
  createJob,
  getJobs,
  getJobById,
};