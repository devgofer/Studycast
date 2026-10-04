# Studycast

> Tell us what you want to learn. We'll turn it into a course you can read or listen to.

Studycast turns a broad learning topic into a structured, multi-episode course. Each episode combines a clear written explanation with a separate teaching script designed for audio.

## v0.1

The first milestone focuses on the learning experience before connecting the real AI pipeline:

- Topic input + learning level
- Course overview / learning map
- Episode reading experience
- Separate teaching script
- Browser speech preview using SpeechSynthesis
- Responsive editorial-style UI
- Mock Docker course to validate the flow

## Product flow

```text
Topic
  ↓
Learning Map
  ↓
Episodes
  ↓
Explanation
  ├── Text
  └── Teaching Script → Audio
```

## Planned architecture

```text
Topic
  ↓
Curriculum Planner
  ↓
Course Structure
  ↓
Explanation Generator
  ↓
Teaching Script Generator
  ↓
TTS Provider
  ↓
Audio Lesson
```

The LLM and TTS layers will live behind provider interfaces so model or voice providers can change without rewriting the product layer.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Stack

- Next.js App Router
- React
- TypeScript
- Plain CSS for the initial product shell

## Roadmap

1. Product shell ✅
2. AI curriculum generation
3. AI explanation generation
4. Teaching-script generation
5. TTS audio generation
6. Persistence
7. Polish and deployment
