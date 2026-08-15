CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,

    company_id INTEGER NOT NULL
        REFERENCES companies(id)
        ON DELETE CASCADE,

    title VARCHAR(255) NOT NULL,

    external_job_id VARCHAR(255),

    platform VARCHAR(100) NOT NULL,

    url TEXT NOT NULL,

    location VARCHAR(255),

    employment_type VARCHAR(100),

    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_currency VARCHAR(10),

    description TEXT,

    posted_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(platform, external_job_id)
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,

    job_id INTEGER NOT NULL
        REFERENCES jobs(id)
        ON DELETE CASCADE,

    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',

    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT applications_status_check
        CHECK (
            status IN (
                'SAVED',
                'APPLIED',
                'INTERVIEW',
                'OFFER',
                'REJECTED',
                'NO_RESPONSE',
                'WITHDRAWN'
            )
        )
);

CREATE TABLE application_events (
    id SERIAL PRIMARY KEY,

    application_id INTEGER NOT NULL
        REFERENCES applications(id)
        ON DELETE CASCADE,

    event_type VARCHAR(100) NOT NULL,

    source VARCHAR(50) NOT NULL,

    metadata JSONB,

    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_company_id
    ON jobs(company_id);

CREATE INDEX idx_jobs_external_job_id
    ON jobs(external_job_id);

CREATE INDEX idx_applications_job_id
    ON applications(job_id);

CREATE INDEX idx_applications_status
    ON applications(status);

CREATE INDEX idx_application_events_application_id
    ON application_events(application_id);

CREATE INDEX idx_application_events_occurred_at
    ON application_events(occurred_at);