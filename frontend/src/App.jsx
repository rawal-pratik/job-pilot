import { useEffect, useState } from "react";

import { getApplications } from "./api/applications";
import ApplicationList from "./components/ApplicationList";

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Job Pilot</h1>
        <p>Your personal job application tracker.</p>
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
            <ApplicationList applications={applications} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;