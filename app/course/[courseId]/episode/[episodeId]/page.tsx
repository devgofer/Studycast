"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AudioCard } from "@/components/audio-card";
import { getStoredCourse } from "@/lib/client-course-store";
import type { Course } from "@/lib/course-types";
import { demoCourse } from "@/lib/mock-data";

export default function EpisodePage() {
  const params = useParams<{ courseId: string; episodeId: string }>();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const stored = getStoredCourse(params.courseId);
    setCourse(
      stored ??
        (params.courseId.startsWith("demo-")
          ? { ...demoCourse, id: params.courseId }
          : null),
    );
  }, [params.courseId]);

  const episode = useMemo(
    () => course?.episodes.find((item) => item.id === params.episodeId) ?? null,
    [course, params.episodeId],
  );

  if (!course || !episode) {
    return (
      <main className="page-shell">
        <div className="container">
          <nav className="navbar">
            <Link className="brand" href="/">Studycast</Link>
          </nav>
          <div className="loading-panel">
            <span className="eyebrow">Episode</span>
            <h1>Loading your lesson...</h1>
            <Link className="back-link" href="/">← Back to Studycast</Link>
          </div>
        </div>
      </main>
    );
  }

  const previous = course.episodes.find((item) => item.order === episode.order - 1);
  const next = course.episodes.find((item) => item.order === episode.order + 1);
  const demoDetails = course.id.startsWith("demo-")
    ? demoCourse.episodes.find((item) => item.id === episode.id)
    : null;

  const explanation = demoDetails
    ? {
        lead: demoDetails.lead,
        sections: demoDetails.sections,
        callout: demoDetails.callout,
        takeaway: demoDetails.takeaway,
        script: demoDetails.teachingScript,
      }
    : {
        lead: `This episode is designed to help you understand one step in your ${course.title} learning path.`,
        sections: [
          {
            heading: "What you'll learn",
            body: episode.goal,
          },
          {
            heading: "The lesson is coming next",
            body: "Studycast will generate the full written explanation and dedicated teaching script for this episode in the next milestone.",
          },
        ],
        callout: "The curriculum is already personalized. The next step is turning this outline into a real lesson.",
        takeaway: episode.goal,
        script: `Let's talk about ${episode.title}. The goal of this lesson is simple: ${episode.goal}`,
      };

  return (
    <main className="page-shell">
      <div className="container episode-shell">
        <div className="episode-top">
          <Link className="back-link" href={`/course/${course.id}`}>
            ← {course.title}
          </Link>
          <div className="episode-label">
            Episode {String(episode.order).padStart(2, "0")} · {episode.duration} min
          </div>
        </div>

        <h1 className="episode-heading">{episode.title}</h1>

        <div className="content-grid">
          <article className="reader">
            <p className="lead">{explanation.lead}</p>

            {explanation.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </section>
            ))}

            {explanation.callout ? (
              <div className="callout">{explanation.callout}</div>
            ) : null}

            <div className="takeaway">
              <div className="takeaway-label">Key takeaway</div>
              <p>{explanation.takeaway}</p>
            </div>
          </article>

          <AudioCard title="Audio lesson" teachingScript={explanation.script} />
        </div>

        <nav className="episode-nav" aria-label="Episode navigation">
          {previous ? (
            <Link className="nav-button" href={`/course/${course.id}/episode/${previous.id}`}>
              ← Previous
              <strong>{previous.title}</strong>
            </Link>
          ) : <div />}

          {next ? (
            <Link className="nav-button" href={`/course/${course.id}/episode/${next.id}`}>
              Next →
              <strong>{next.title}</strong>
            </Link>
          ) : <div />}
        </nav>
      </div>
    </main>
  );
}
