"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStoredCourse } from "@/lib/client-course-store";
import type { Course } from "@/lib/course-types";
import { demoCourse } from "@/lib/mock-data";

export default function CoursePage() {
  const params = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    const stored = getStoredCourse(params.courseId);
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        setCourse(
          stored ??
            (params.courseId.startsWith("demo-")
              ? { ...demoCourse, id: params.courseId }
              : null),
        );
      }
    });

    return () => { cancelled = true; };
  }, [params.courseId]);

  if (!course) {
    return (
      <main className="page-shell">
        <div className="container">
          <nav className="navbar">
            <Link className="brand" href="/">Studycast</Link>
          </nav>
          <div className="loading-panel">
            <span className="eyebrow">Course</span>
            <h1>Loading your learning path...</h1>
            <p>
              This course lives in your current browser session. Generate it
              again here if it was created on another device.
            </p>
            <Link className="back-link" href="/">← Create a new topic</Link>
          </div>
        </div>
      </main>
    );
  }

  const totalMinutes = course.episodes.reduce((sum, episode) => sum + episode.duration, 0);

  return (
    <main className="page-shell">
      <div className="container">
        <nav className="navbar">
          <Link className="brand" href="/">Studycast</Link>
          <div className="nav-note">Your learning path</div>
        </nav>

        <header className="course-header">
          <Link className="back-link" href="/">← New topic</Link>
          <div className="course-topic">{course.topic} · {course.level}</div>
          <h1 className="course-title">{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <div className="course-meta">
            {course.episodes.length} episodes · {totalMinutes} min
          </div>
        </header>

        <section className="episode-list" aria-label="Course episodes">
          {course.episodes.map((episode) => (
            <Link
              className="episode-row"
              href={`/course/${course.id}/episode/${episode.id}`}
              key={episode.id}
            >
              <div className="episode-index">{String(episode.order).padStart(2, "0")}</div>
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
