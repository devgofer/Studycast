"use client";

import { useEffect, useRef, useState } from "react";
import { ttsVoices, type TtsVoice } from "@/lib/tts-voices";

type AudioCardProps = {
  title: string;
  teachingScript: string;
};

export function AudioCard({ title, teachingScript }: AudioCardProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "playing" | "fallback" | "error">("idle");
  const [message, setMessage] = useState("");
  const [hasGeneratedAudio, setHasGeneratedAudio] = useState(false);
  const [voice, setVoice] = useState<TtsVoice>("cedar");
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [browserVoiceName, setBrowserVoiceName] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!window.speechSynthesis) return;

    function loadBrowserVoices() {
      const voices = window.speechSynthesis.getVoices();
      setBrowserVoices(voices);
      setBrowserVoiceName((current) => current || voices[0]?.name || "");
    }

    loadBrowserVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadBrowserVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadBrowserVoices);
  }, []);

  function playBrowserPreview() {
    if (!window.speechSynthesis) {
      setStatus("error");
      setMessage("Audio playback is unavailable in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(teachingScript);
    const selectedVoice = browserVoices.find((voice) => voice.name === browserVoiceName);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");

    window.speechSynthesis.speak(utterance);
    setStatus("fallback");
    setMessage("Playing the browser voice preview.");
  }

  function stopAudio() {
    window.speechSynthesis?.cancel();
    audioRef.current?.pause();
    setStatus("idle");
    setMessage("");
  }

  function changeVoice(nextVoice: TtsVoice) {
    stopAudio();
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    audioRef.current?.removeAttribute("src");
    audioRef.current?.load();
    setHasGeneratedAudio(false);
    setVoice(nextVoice);
  }

  async function playLesson() {
    if (status === "playing" || status === "fallback") {
      stopAudio();
      return;
    }

    if (audioRef.current?.src) {
      try {
        await audioRef.current.play();
        setStatus("playing");
        setMessage("Playing AI-generated audio.");
      } catch {
        setStatus("error");
        setMessage("Audio could not start. Try the browser voice preview.");
      }
      return;
    }

    setStatus("generating");
    setMessage("Generating AI audio from this teaching script...");

    try {
      const response = await fetch("/api/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teachingScript, voice }),
      });

      if (!response.ok) {
        playBrowserPreview();
        return;
      }

      const url = URL.createObjectURL(await response.blob());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = url;

      if (!audioRef.current) throw new Error("Audio player is unavailable.");
      audioRef.current.src = url;
      audioRef.current.load();
      setHasGeneratedAudio(true);
      await audioRef.current.play();
      setStatus("playing");
      setMessage("Playing AI-generated audio.");
    } catch {
      playBrowserPreview();
    }
  }

  return (
    <aside className="audio-card">
      <div className="audio-kicker">Listen to this lesson</div>
      <h2>{title}</h2>
      <p>
        Generate spoken audio from this episode&apos;s dedicated teaching script.
      </p>
      <label className="voice-selector" htmlFor="voice">
        <span>AI voice</span>
        <select
          id="voice"
          value={voice}
          onChange={(event) => changeVoice(event.target.value as TtsVoice)}
          disabled={status === "generating"}
        >
          {ttsVoices.map((option) => (
            <option key={option.id} value={option.id}>{option.label}</option>
          ))}
        </select>
      </label>
      {browserVoices.length > 0 ? (
        <label className="voice-selector" htmlFor="browser-voice">
          <span>Browser voice</span>
          <select
            id="browser-voice"
            value={browserVoiceName}
            onChange={(event) => setBrowserVoiceName(event.target.value)}
            disabled={status === "generating"}
          >
            {browserVoices.map((option) => (
              <option key={`${option.name}-${option.lang}`} value={option.name}>
                {option.name} ({option.lang})
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <button
        className={`play-button ${status === "playing" || status === "fallback" ? "active" : ""}`}
        onClick={playLesson}
        type="button"
        disabled={status === "generating"}
      >
        {status === "generating"
          ? "Preparing audio..."
          : status === "playing" || status === "fallback"
            ? "■  Stop lesson"
            : "▶  Generate & play lesson"}
      </button>
      <div className="audio-progress" aria-hidden="true"><span /></div>
      <div className="audio-caption">AI-generated voice · browser preview fallback</div>
      <p className="audio-disclosure">Audio is generated by AI.</p>
      {message ? <p className="audio-status" role="status">{message}</p> : null}
      {hasGeneratedAudio ? (
        <audio
          className="audio-player"
          controls
          onEnded={() => { setStatus("idle"); setMessage(""); }}
          onPause={() => setStatus((current) => current === "playing" ? "idle" : current)}
          ref={audioRef}
        />
      ) : <audio ref={audioRef} />}
      <details className="lesson-script">
        <summary>View teaching script</summary>
        <p>{teachingScript}</p>
      </details>
    </aside>
  );
}
