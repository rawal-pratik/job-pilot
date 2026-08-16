function ApplicationStats({ applications }) {
  const stats = {
    total: applications.length,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
    noResponse: 0,
  };

  applications.forEach((application) => {
    switch (application.status) {
      case "APPLIED":
        stats.applied++;
        break;

      case "INTERVIEW":
        stats.interview++;
        break;

      case "OFFER":
        stats.offer++;
        break;

      case "REJECTED":
        stats.rejected++;
        break;

      case "WITHDRAWN":
        stats.withdrawn++;
        break;

      case "NO_RESPONSE":
        stats.noResponse++;
        break;

      default:
        break;
    }
  });

  return (
    <div className="application-stats">
      <div className="stat-card stat-card-total">
        <span className="stat-label">
          Total Applications
        </span>

        <strong>{stats.total}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">
          Applied
        </span>

        <strong>{stats.applied}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">
          Interviews
        </span>

        <strong>{stats.interview}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">
          Offers
        </span>

        <strong>{stats.offer}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">
          Rejected
        </span>

        <strong>{stats.rejected}</strong>
      </div>

      <div className="stat-card">
        <span className="stat-label">
          No Response
        </span>

        <strong>{stats.noResponse}</strong>
      </div>
    </div>
  );
}

export default ApplicationStats;