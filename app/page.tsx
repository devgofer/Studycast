"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveCourse } from "@/lib/client-course-store";
import type { CourseLevel } from "@/lib/course-types";

const examples = ["Docker", "React", "Photography"];

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<CourseLevel>("Beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTopic = topic.trim();
    if (!trimmedTopic || loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmedTopic, level }),
      });

      const data = (await response.json()) as {
        course?: Parameters<typeof saveCourse>[0];
        error?: string;
      };

      if (!response.ok || !data.course) {
        throw new Error(data.error || "Unable to create course.");
      }

      saveCourse(data.course);
      router.push(`/course/${data.course.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <div className="container">
        <nav className="navbar">
          <div className="brand">Studycast</div>
          <div className="nav-note">Learn it. Read it. Listen to it.</div>
        </nav>

        <section className="hero">
          <span className="eyebrow">AI learning companion</span>
          <h1>Turn one topic into a course.</h1>
          <p className="hero-copy">
            Tell Studycast what you want to learn. It organizes the knowledge
            into a clear learning path, then turns each lesson into an
            explanation you can read or listen to.
          </p>

          <form className="topic-card" onSubmit={submit}>
            <div className="topic-card-inner">
              <label className="topic-label" htmlFor="topic">
                What do you want to learn?
              </label>
              <div className="topic-form">
                <input
                  id="topic"
                  className="topic-input"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  placeholder="e.g. Docker, React, photography..."
                  autoComplete="off"
                  maxLength={120}
                  disabled={loading}
                />
                <select
                  aria-label="Learning level"
                  value={level}
                  onChange={(event) => setLevel(event.target.value as CourseLevel)}
                  disabled={loading}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={!topic.trim() || loading}
                >
                  {loading ? "Building..." : "Create course"}
                </button>
              </div>
              <div className="example-topics">
                {examples.map((example) => (
                  <button
                    className="example-chip"
                    key={example}
                    type="button"
                    onClick={() => setTopic(example)}
                    disabled={loading}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {error ? <p className="form-error">{error}</p> : null}
          <p className="demo-note">
            No API key? No problem. Studycast falls back to the Docker demo so
            the learning flow stays explorable.
          </p>
        </section>

        <section className="feature-grid" aria-label="Studycast highlights">
          <article className="feature-card">
            <div className="feature-number">01 / STRUCTURE</div>
            <h2>Start with the map.</h2>
            <p>
              Break a broad topic into a sequence that makes sense, instead of
              collecting random tutorials.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-number">02 / EXPLAIN</div>
            <h2>Learn one idea at a time.</h2>
            <p>
              Each episode is organized around a clear learning goal and the
              concepts needed to reach it.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-number">03 / LISTEN</div>
            <h2>Take the lesson with you.</h2>
            <p>
              Every episode will have a dedicated teaching script designed for
              spoken explanation.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
