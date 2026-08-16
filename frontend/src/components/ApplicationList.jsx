import ApplicationRow from "./ApplicationRow";

function ApplicationList({ applications }) {
  if (applications.length === 0) {
    return (
      <div>
        <p>No applications yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="application-header application-row">
        <div>Company</div>
        <div>Role</div>
        <div>Platform</div>
        <div>Status</div>
        <div>Applied</div>
      </div>

      {applications.map((application) => (
        <ApplicationRow
          key={application.id}
          application={application}
        />
      ))}
    </div>
  );
}

export default ApplicationList;