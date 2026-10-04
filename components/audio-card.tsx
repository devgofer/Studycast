"use client";

import { useEffect, useState } from "react";

type AudioCardProps = {
  title: string;
  teachingScript: string;
};

export function AudioCard({ title, teachingScript }: AudioCardProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  function toggleAudio() {
    if (!window.speechSynthesis) return;

    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(teachingScript);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }

  return (
    <aside className="audio-card">
      <div className="audio-kicker">Listen to this lesson</div>
      <h2>{title}</h2>
      <p>
        Listen to the dedicated teaching script with a browser voice preview.
      </p>
      <button
        className={`play-button ${playing ? "active" : ""}`}
        onClick={toggleAudio}
        type="button"
      >
        {playing ? "■  Stop lesson" : "▶  Play lesson"}
      </button>
      <div className="audio-progress" aria-hidden="true"><span /></div>
      <div className="audio-caption">Teaching script · voice preview</div>
      <details className="lesson-script">
        <summary>View teaching script</summary>
        <p>{teachingScript}</p>
      </details>
    </aside>
  );
}
