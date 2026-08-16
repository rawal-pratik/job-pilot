import { useEffect, useMemo, useState } from "react";

import { getApplications } from "./api/applications";

import ApplicationDetails from "./components/ApplicationDetails";
import ApplicationFilters from "./components/ApplicationFilters";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import ApplicationStats from "./components/ApplicationStats";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [selectedApplicationId, setSelectedApplicationId] =
    useState(null);

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  async function loadApplications() {
    try {
      setLoading(true);
      setError(null);

      const data = await getApplications();

      setApplications(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  function handleApplicationCreated() {
    setShowForm(false);
    loadApplications();
  }

  function handleApplicationClick(applicationId) {
    setSelectedApplicationId(applicationId);
  }

  async function handleBackToApplications() {
    setSelectedApplicationId(null);
    await loadApplications();
  }

  const filteredApplications = useMemo(() => {
    if (activeFilter === "ALL") {
      return applications;
    }

    return applications.filter(
      (application) =>
        application.status === activeFilter
    );
  }, [applications, activeFilter]);

  if (selectedApplicationId !== null) {
    return (
      <div className="app">
        <ApplicationDetails
          applicationId={selectedApplicationId}
          onBack={handleBackToApplications}
        />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="app">
        <ApplicationForm
          onApplicationCreated={
            handleApplicationCreated
          }
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="dashboard-header">
        <div>
          <h1>Job Pilot</h1>

          <p>
            Your personal job application tracker.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
        >
          + Add Application
        </button>
      </header>

      <main>
        <ApplicationStats
          applications={applications}
        />

        <section className="applications-section">
          <div className="applications-section-header">
            <div>
              <h2>Applications</h2>

              <p>
                {filteredApplications.length}{" "}
                application
                {filteredApplications.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <ApplicationFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          {loading && (
            <p>Loading applications...</p>
          )}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <ApplicationList
              applications={filteredApplications}
              onApplicationClick={
                handleApplicationClick
              }
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;