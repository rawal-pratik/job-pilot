import { APPLICATION_STATUSES } from "../constants/applicationStatus";

function StatusSelector({
  status,
  onStatusChange,
  disabled = false,
}) {
  return (
    <select
      value={status}
      onChange={(event) => onStatusChange(event.target.value)}
      disabled={disabled}
    >
      {APPLICATION_STATUSES.map((statusOption) => (
        <option
          key={statusOption.value}
          value={statusOption.value}
        >
          {statusOption.label}
        </option>
      ))}
    </select>
  );
}

export default StatusSelector;