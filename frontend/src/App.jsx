import { useEffect, useState } from "react";

import { getApplications } from "./api/applications";

import ApplicationDetails from "./components/ApplicationDetails";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] =
    useState(null);

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

  function handleBackToApplications() {
    setSelectedApplicationId(null);
  }

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
          onApplicationCreated={handleApplicationCreated}
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
          <p>Your personal job application tracker.</p>
        </div>

        <button onClick={() => setShowForm(true)}>
          + Add Application
        </button>
      </header>

      <main>
        <section>
          <h2>Applications</h2>

          <p>
            {applications.length} application
            {applications.length !== 1 ? "s" : ""}
          </p>

          {loading && <p>Loading applications...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <ApplicationList
              applications={applications}
              onApplicationClick={handleApplicationClick}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;