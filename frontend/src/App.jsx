import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

  const [
    selectedApplicationId,
    setSelectedApplicationId,
  ] = useState(null);

  const [activeFilter, setActiveFilter] =
    useState("ALL");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [sortOption, setSortOption] =
    useState("APPLIED_DATE_DESC");

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

  function handleApplicationClick(
    applicationId
  ) {
    setSelectedApplicationId(applicationId);
  }

  async function handleBackToApplications() {
    setSelectedApplicationId(null);
    await loadApplications();
  }

  const displayedApplications = useMemo(() => {
    let result = [...applications];

    if (activeFilter !== "ALL") {
      result = result.filter(
        (application) =>
          application.status === activeFilter
      );
    }

    if (searchQuery.trim()) {
      const query =
        searchQuery.trim().toLowerCase();

      result = result.filter((application) => {
        return (
          application.company_name
            ?.toLowerCase()
            .includes(query) ||
          application.job_title
            ?.toLowerCase()
            .includes(query) ||
          application.platform
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case "APPLIED_DATE_ASC":
          return (
            new Date(a.applied_at) -
            new Date(b.applied_at)
          );

        case "COMPANY_ASC":
          return a.company_name.localeCompare(
            b.company_name
          );

        case "ROLE_ASC":
          return a.job_title.localeCompare(
            b.job_title
          );

        case "STATUS_ASC":
          return a.status.localeCompare(
            b.status
          );

        case "APPLIED_DATE_DESC":
        default:
          return (
            new Date(b.applied_at) -
            new Date(a.applied_at)
          );
      }
    });

    return result;
  }, [
    applications,
    activeFilter,
    searchQuery,
    sortOption,
  ]);

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
          onCancel={() =>
            setShowForm(false)
          }
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
                {displayedApplications.length}{" "}
                application
                {displayedApplications.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            <div className="application-controls">
              <div className="search-container">
                <input
                  type="search"
                  placeholder="Search applications..."
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="sort-container">
                <label htmlFor="application-sort">
                  Sort
                </label>

                <select
                  id="application-sort"
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(
                      event.target.value
                    )
                  }
                >
                  <option value="APPLIED_DATE_DESC">
                    Applied date (newest)
                  </option>

                  <option value="APPLIED_DATE_ASC">
                    Applied date (oldest)
                  </option>

                  <option value="COMPANY_ASC">
                    Company (A-Z)
                  </option>

                  <option value="ROLE_ASC">
                    Role (A-Z)
                  </option>

                  <option value="STATUS_ASC">
                    Status (A-Z)
                  </option>
                </select>
              </div>
            </div>
          </div>

          <ApplicationFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {loading && (
            <p>Loading applications...</p>
          )}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <ApplicationList
              applications={displayedApplications}
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