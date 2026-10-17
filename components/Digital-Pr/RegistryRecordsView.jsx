
import PublicPageShell from "./PublicPageShell";
import { EmptyState } from "./PublicDataState";

export default function RegistryRecordsView({ records }) {
  return (
    <PublicPageShell
      eyebrow="Corporate information"
      title="Legal Registrations"
      description="Publicly approved company registration information and verification sources."
    >
      {records.length === 0 ? (
        <EmptyState>
          No verified registration records are currently available for
          public display.
        </EmptyState>
      ) : (
        <div className="digital-pr-record-list">
          {records.map((record) => (
            <article
              className="digital-pr-record"
              key={record.id}
            >
              <h2>{record.source_name}</h2>

              {record.observed_legal_name && (
                <p>
                  <strong>Legal name:</strong>{" "}
                  {record.observed_legal_name}
                </p>
              )}

              {record.observed_brand_name && (
                <p>
                  <strong>Brand name:</strong>{" "}
                  {record.observed_brand_name}
                </p>
              )}

              {record.observed_registration_number && (
                <p>
                  <strong>Registration number:</strong>{" "}
                  {record.observed_registration_number}
                </p>
              )}

              {record.observed_address && (
                <p>
                  <strong>Address:</strong>{" "}
                  {record.observed_address}
                </p>
              )}

              {record.source_url && (
                <a
                  href={record.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View source
                </a>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="digital-pr-disclaimer">
        A source link is provided for independent verification. Listing
        a record here does not imply endorsement or regulatory approval.
      </p>
    </PublicPageShell>
  );
}
