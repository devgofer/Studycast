import Link from "next/link";
import { notFound } from "next/navigation";
import { demoCourse } from "@/lib/mock-data";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  if (courseId !== demoCourse.id) notFound();

  const totalMinutes = demoCourse.episodes.reduce(
    (sum, episode) => sum + episode.duration,
    0,
  );

  return (
    <main className="page-shell">
      <div className="container">
        <nav className="navbar">
          <Link className="brand" href="/">Studycast</Link>
          <div className="nav-note">Your learning path</div>
        </nav>

        <header className="course-header">
          <Link className="back-link" href="/">← New topic</Link>
          <h1 className="course-title">{demoCourse.title}</h1>
          <p className="course-description">{demoCourse.description}</p>
          <div className="course-meta">
            {demoCourse.episodes.length} episodes · {totalMinutes} min · {demoCourse.level}
          </div>
        </header>

        <section className="episode-list" aria-label="Course episodes">
          {demoCourse.episodes.map((episode) => (
            <Link
              className="episode-row"
              href={`/course/${demoCourse.id}/episode/${episode.id}`}
              key={episode.id}
            >
              <div className="episode-index">
                {String(episode.order).padStart(2, "0")}
              </div>
              <div>
                <div className="episode-title">{episode.title}</div>
                <div className="episode-goal">{episode.goal}</div>
              </div>
              <div className="episode-length">{episode.duration} min →</div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
