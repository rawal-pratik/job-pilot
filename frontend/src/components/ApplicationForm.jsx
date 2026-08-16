import { useState } from "react";
import { createApplication } from "../api/applications";

const initialFormState = {
  companyName: "",
  companyWebsiteUrl: "",
  title: "",
  externalJobId: "",
  platform: "",
  url: "",
  location: "",
  employmentType: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "INR",
  description: "",
  postedAt: "",
  appliedAt: "",
  notes: "",
};

function ApplicationForm({ onApplicationCreated, onCancel }) {
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      const application = await createApplication({
        ...formData,
        salaryMin: formData.salaryMin
          ? Number(formData.salaryMin)
          : null,
        salaryMax: formData.salaryMax
          ? Number(formData.salaryMax)
          : null,
        appliedAt: formData.appliedAt || null,
        postedAt: formData.postedAt || null,
      });

      setFormData(initialFormState);

      onApplicationCreated(application);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="application-form-container">
      <div className="form-header">
        <div>
          <h2>Add Application</h2>
          <p>Add a job you've applied to.</p>
        </div>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Company</h3>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="companyName">
                Company
              </label>

              <input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Google"
              />
            </div>

            <div className="form-field">
              <label htmlFor="companyWebsiteUrl">
                Company Website
              </label>

              <input
                id="companyWebsiteUrl"
                name="companyWebsiteUrl"
                type="url"
                value={formData.companyWebsiteUrl}
                onChange={handleChange}
                placeholder="https://google.com"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Job</h3>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="title">
                Role
              </label>

              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Software Engineer"
              />
            </div>

            <div className="form-field">
              <label htmlFor="externalJobId">
                Job ID
              </label>

              <input
                id="externalJobId"
                name="externalJobId"
                value={formData.externalJobId}
                onChange={handleChange}
                placeholder="REQ-12345"
              />
            </div>

            <div className="form-field">
              <label htmlFor="platform">
                Platform
              </label>

              <input
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
                placeholder="LinkedIn"
              />
            </div>

            <div className="form-field">
              <label htmlFor="url">
                Job URL
              </label>

              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Bangalore"
              />
            </div>

            <div className="form-field">
              <label htmlFor="employmentType">
                Employment Type
              </label>

              <input
                id="employmentType"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                placeholder="Full-time"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Salary</h3>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="salaryMin">
                Minimum
              </label>

              <input
                id="salaryMin"
                name="salaryMin"
                type="number"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="1200000"
              />
            </div>

            <div className="form-field">
              <label htmlFor="salaryMax">
                Maximum
              </label>

              <input
                id="salaryMax"
                name="salaryMax"
                type="number"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="1800000"
              />
            </div>

            <div className="form-field">
              <label htmlFor="salaryCurrency">
                Currency
              </label>

              <input
                id="salaryCurrency"
                name="salaryCurrency"
                value={formData.salaryCurrency}
                onChange={handleChange}
                placeholder="INR"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Job Description</h3>

          <div className="form-field">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="8"
              placeholder="Paste the job description here..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Application</h3>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="appliedAt">
                Date Applied
              </label>

              <input
                id="appliedAt"
                name="appliedAt"
                type="datetime-local"
                value={formData.appliedAt}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="postedAt">
                Job Posted Date
              </label>

              <input
                id="postedAt"
                name="postedAt"
                type="datetime-local"
                value={formData.postedAt}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Anything you want to remember about this application..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Application"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;