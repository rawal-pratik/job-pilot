function ApplicationRow({ application, onClick }) {
  return (
    <div
      className="application-row application-row-clickable"
      onClick={() => onClick(application.id)}
    >
      <div>
        <strong>{application.company_name}</strong>
      </div>

      <div>{application.job_title}</div>

      <div>{application.platform}</div>

      <div>
        <span
          className={`status status-${application.status.toLowerCase()}`}
        >
          {application.status}
        </span>
      </div>

      <div>
        {new Date(application.applied_at).toLocaleDateString()}
      </div>
    </div>
  );
}

export default ApplicationRow;