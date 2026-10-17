
export function EmptyState({ children }) {
  return <p className="digital-pr-empty">{children}</p>;
}

export function UnavailableState() {
  return (
    <div className="digital-pr-empty" role="status">
      <h2>Information temporarily unavailable</h2>
      <p>
        Please try again later or contact LiaisonBank for assistance.
      </p>
    </div>
  );
}

export function formatPublicDate(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}
