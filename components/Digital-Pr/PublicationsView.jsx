
import PublicPageShell from "./PublicPageShell";
import { EmptyState, formatPublicDate } from "./PublicDataState";

export default function PublicationsView({ publications }) {
  return (
    <PublicPageShell
      eyebrow="Newsroom"
      title="Media & Press Coverage"
      description="Read approved LiaisonBank press releases, interviews, announcements, and media coverage."
    >
      {publications.length === 0 ? (
        <EmptyState>
          No media publications are currently available.
        </EmptyState>
      ) : (
        <div className="digital-pr-publication-list">
          {publications.map((item) => (
            <article
              className="digital-pr-publication"
              key={item.id}
            >
              {formatPublicDate(item.published_at) && (
                <p className="digital-pr-date">
                  {formatPublicDate(item.published_at)}
                </p>
              )}

              <h2>{item.title}</h2>

              {item.publisher && <p>{item.publisher}</p>}

              {item.summary && <p>{item.summary}</p>}

              {item.publication_url && (
                <a
                  href={item.publication_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read publication
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </PublicPageShell>
  );
}
