function ApplicationRow({ application }) {
  return (
    <div className="application-row">
      <div>
        <strong>{application.company_name}</strong>
      </div>

      <div>{application.job_title}</div>

      <div>{application.platform}</div>

      <div>
        <span className={`status status-${application.status.toLowerCase()}`}>
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