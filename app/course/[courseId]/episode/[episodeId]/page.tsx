import Link from "next/link";
import { notFound } from "next/navigation";
import { AudioCard } from "@/components/audio-card";
import { demoCourse, getEpisode } from "@/lib/mock-data";

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ courseId: string; episodeId: string }>;
}) {
  const { courseId, episodeId } = await params;
  const episode = getEpisode(courseId, episodeId);
  if (!episode) notFound();

  const previous = demoCourse.episodes.find(
    (item) => item.order === episode.order - 1,
  );
  const next = demoCourse.episodes.find(
    (item) => item.order === episode.order + 1,
  );

  return (
    <main className="page-shell">
      <div className="container episode-shell">
        <div className="episode-top">
          <Link className="back-link" href={`/course/${courseId}`}>
            ← {demoCourse.title}
          </Link>
          <div className="episode-label">
            Episode {String(episode.order).padStart(2, "0")} · {episode.duration} min
          </div>
        </div>

        <h1 className="episode-heading">{episode.title}</h1>

        <div className="content-grid">
          <article className="reader">
            <p className="lead">{episode.lead}</p>
            {episode.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}
            {episode.callout ? (
              <div className="callout">{episode.callout}</div>
            ) : null}
            <div className="takeaway">
              <div className="takeaway-label">Key takeaway</div>
              <p>{episode.takeaway}</p>
            </div>
          </article>

          <AudioCard
            title="Audio lesson"
            teachingScript={episode.teachingScript}
          />
        </div>

        <nav className="episode-nav" aria-label="Episode navigation">
          {previous ? (
            <Link
              className="nav-button"
              href={`/course/${courseId}/episode/${previous.id}`}
            >
              ← Previous
              <strong>{previous.title}</strong>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              className="nav-button"
              href={`/course/${courseId}/episode/${next.id}`}
            >
              Next →
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </main>
  );
}
