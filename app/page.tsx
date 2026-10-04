"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const demoCourseId = "docker-for-beginners";

export default function Home() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!topic.trim()) return;
    router.push(
      "/course/" +
        demoCourseId +
        "?topic=" +
        encodeURIComponent(topic.trim()) +
        "&level=" +
        encodeURIComponent(level),
    );
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
                />
                <select
                  aria-label="Learning level"
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={!topic.trim()}
                >
                  Create course
                </button>
              </div>
            </div>
          </form>
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
              Each episode is written around a clear learning goal, examples,
              and a simple takeaway.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-number">03 / LISTEN</div>
            <h2>Take the lesson with you.</h2>
            <p>
              Every episode has a teaching script designed for spoken
              explanation, not just text read aloud.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
