"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AudioCard } from "@/components/audio-card";
import { getStoredCourse, saveCourse } from "@/lib/client-course-store";
import type { Course, EpisodeLesson } from "@/lib/course-types";
import { demoCourse } from "@/lib/mock-data";

type LessonStatus = "loading" | "ready" | "fallback" | "error";

export default function EpisodePage() {
  const params = useParams<{ courseId: string; episodeId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessonStatus, setLessonStatus] = useState<LessonStatus>("loading");
  const [lessonMessage, setLessonMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

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

  const episode = useMemo(
    () => course?.episodes.find((item) => item.id === params.episodeId) ?? null,
    [course, params.episodeId],
  );

  useEffect(() => {
    if (!course || !episode) return;
    if (episode.lesson) return;

    let cancelled = false;
    const lessonCourse = course;
    const lessonEpisode = episode;

    async function loadLesson() {
      setLessonStatus("loading");
      setLessonMessage("");
      try {
        const response = await fetch("/api/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course: {
              title: lessonCourse.title,
              description: lessonCourse.description,
              topic: lessonCourse.topic,
              level: lessonCourse.level,
            },
            episode: lessonEpisode,
          }),
        });
        const data = (await response.json()) as {
          lesson?: EpisodeLesson;
          generatedBy?: "ai" | "demo-fallback";
          warning?: string;
          error?: string;
        };

        if (!response.ok || !data.lesson) {
          throw new Error(data.error || "Unable to generate this lesson.");
        }
        if (cancelled) return;

        const updatedCourse: Course = {
          ...lessonCourse,
          episodes: lessonCourse.episodes.map((item) =>
            item.id === lessonEpisode.id ? { ...item, lesson: data.lesson } : item,
          ),
        };
        saveCourse(updatedCourse);
        setCourse(updatedCourse);
        setLessonStatus(data.generatedBy === "demo-fallback" ? "fallback" : "ready");
        setLessonMessage(data.warning || "");
      } catch (error) {
        if (cancelled) return;
        setLessonStatus("error");
        setLessonMessage(error instanceof Error ? error.message : "Unable to generate this lesson.");
      }
    }

    void loadLesson();
    return () => { cancelled = true; };
  }, [course, episode, retryCount]);

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
  const explanation = episode.lesson;

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

        {lessonStatus === "loading" && !explanation ? (
          <div className="lesson-state" aria-live="polite">
            <span className="eyebrow">Writing lesson</span>
            <h2>Studycast is preparing your explanation and teaching script.</h2>
            <p>This usually takes a moment. The lesson will stay available in this browser once it is ready.</p>
          </div>
        ) : null}

        {lessonStatus === "error" ? (
          <div className="lesson-state lesson-error" role="alert">
            <span className="eyebrow">Lesson unavailable</span>
            <h2>We could not prepare this lesson yet.</h2>
            <p>{lessonMessage}</p>
            <button className="primary-button" type="button" onClick={() => setRetryCount((count) => count + 1)}>
              Try again
            </button>
          </div>
        ) : null}

        {explanation ? (
          <>
            {lessonStatus === "fallback" ? (
              <p className="lesson-notice" role="status">
                {lessonMessage || "A starter lesson is shown while AI generation is unavailable."}
              </p>
            ) : null}

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

              <AudioCard title="Audio lesson" teachingScript={explanation.teachingScript} />
            </div>
          </>
        ) : null}

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
