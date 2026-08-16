const FILTERS = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "APPLIED",
    label: "Applied",
  },
  {
    value: "INTERVIEW",
    label: "Interview",
  },
  {
    value: "OFFER",
    label: "Offers",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
  {
    value: "NO_RESPONSE",
    label: "No Response",
  },
];

function ApplicationFilters({
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="application-filters">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={
            activeFilter === filter.value
              ? "filter-button active"
              : "filter-button"
          }
          onClick={() =>
            onFilterChange(filter.value)
          }
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

export default ApplicationFilters;