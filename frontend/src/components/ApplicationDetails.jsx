import { useEffect, useState } from "react";

import {
  getApplicationById,
  updateApplication,
} from "../api/applications";

import StatusSelector from "./StatusSelector";

function ApplicationDetails({ applicationId, onBack }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadApplication() {
      try {
        setLoading(true);
        setError(null);

        const data = await getApplicationById(applicationId);

        setApplication(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId]);

  async function handleStatusChange(newStatus) {
    if (newStatus === application.status) {
      return;
    }

    try {
      setUpdatingStatus(true);
      setError(null);

      await updateApplication(applicationId, {
        status: newStatus,
      });

      const updatedApplication =
        await getApplicationById(applicationId);

      setApplication(updatedApplication);
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="application-details">
        <button onClick={onBack}>← Back</button>
        <p>Loading application...</p>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div className="application-details">
        <button onClick={onBack}>← Back</button>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="application-details">
      <button onClick={onBack}>
        ← Back to Applications
      </button>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <header className="details-header">
        <div>
          <h1>{application.job_title}</h1>
          <p>{application.company_name}</p>
        </div>

        <div className="status-control">
          <StatusSelector
            status={application.status}
            onStatusChange={handleStatusChange}
            disabled={updatingStatus}
          />
        </div>
      </header>

      <section className="details-section">
        <h2>Job Information</h2>

        <div className="details-grid">
          <div>
            <strong>Company</strong>
            <p>{application.company_name}</p>
          </div>

          <div>
            <strong>Platform</strong>
            <p>{application.platform}</p>
          </div>

          <div>
            <strong>Location</strong>
            <p>
              {application.location || "Not specified"}
            </p>
          </div>

          <div>
            <strong>Employment Type</strong>
            <p>
              {application.employment_type ||
                "Not specified"}
            </p>
          </div>

          <div>
            <strong>Job ID</strong>
            <p>
              {application.external_job_id ||
                "Not specified"}
            </p>
          </div>

          <div>
            <strong>Applied</strong>
            <p>
              {new Date(
                application.applied_at
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="job-link">
          <a
            href={application.job_url}
            target="_blank"
            rel="noreferrer"
          >
            View Original Job Posting →
          </a>
        </div>
      </section>

      <section className="details-section">
        <h2>Job Description</h2>

        <div className="job-description">
          {application.description ? (
            <p>{application.description}</p>
          ) : (
            <p>No job description available.</p>
          )}
        </div>
      </section>

      <section className="details-section">
        <h2>Application</h2>

        <div className="application-notes">
          <strong>Notes</strong>

          <p>
            {application.notes || "No notes added."}
          </p>
        </div>
      </section>

      <section className="details-section">
        <h2>Timeline</h2>

        <div className="timeline">
          {application.events.length === 0 ? (
            <p>No events recorded.</p>
          ) : (
            application.events.map((event) => (
              <div
                className="timeline-event"
                key={event.id}
              >
                <div>
                  <strong>{event.event_type}</strong>

                  <p>
                    Source: {event.source}
                  </p>
                </div>

                <time>
                  {new Date(
                    event.occurred_at
                  ).toLocaleString()}
                </time>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ApplicationDetails;