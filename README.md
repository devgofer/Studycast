# Studycast

> Tell us what you want to learn. We'll turn it into a course you can read or listen to.

Studycast turns a broad learning topic into a structured, multi-episode course. Each episode can become a clear written explanation, teaching script, playable AI audio lesson, durable course record, and visible learning progress.

## v0.6 — Progress Tracking

The current milestone turns a saved course into an active learning path:

- Topic + learning level input
- AI-generated course title and description
- AI-generated 6–10 episode learning path
- Dependency-aware episode ordering
- Episode goals and estimated duration
- AI-generated written explanations with 3–5 focused sections
- AI-generated teaching scripts, separate from the written lesson
- Loading, error, retry, and lesson-fallback states on every episode
- Generated lessons saved back to browser-local course storage
- AI-generated MP3 audio from each teaching script
- In-page audio player for generated lessons
- Browser speech preview fallback when AI audio is unavailable
- Clear disclosure for AI-generated voices
- libSQL-backed course persistence with a local SQLite default
- Cloud database support through `DATABASE_URL` and `DATABASE_AUTH_TOKEN`
- Course restore API for opening saved learning paths on another browser
- Browser localStorage retained as the immediate prototype cache
- Mark individual lessons complete or incomplete
- Course-level completed count and percentage progress bar
- Completion state stored locally and synchronized to the course database
- OpenAI Responses API integration
- OpenAI Text-to-Speech API integration
- LLM provider abstraction
- Docker demo course fallback when no API key is configured
- Starter-lesson fallback if lesson generation is unavailable
- Browser-local course persistence for the prototype

## Product flow

```text
Topic
  ↓
Curriculum Planner
  ↓
Learning Map
  ↓
Episodes
  ↓
AI Written Explanation + Teaching Script
  ↓
AI Audio Lesson
  ↓
Browser Voice Preview Fallback
  ↓
Course Database
  ↓
Progress Tracking
```

## AI architecture

```text
User Topic
    ↓
Course Planner
    ↓
LLM Provider
    ↓
Course Structure
    ├── Title
    ├── Description
    └── Episodes
         ├── Goal
         └── Duration
              ↓
         Lesson Generator
              ├── Written explanation
              └── Teaching script
                    ↓
               Speech Generator
                    └── MP3 audio lesson
                         ↓
                    Course Repository
                         └── SQLite or libSQL database
                              ↓
                         Completion state
```

The LLM layer is provider-based so the product is not coupled to one model vendor.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `OPENAI_API_KEY` in `.env.local` for live curriculum, lesson, and audio generation. `OPENAI_MODEL`, `OPENAI_TTS_MODEL`, and `OPENAI_TTS_VOICE` can be changed without touching application code.

`DATABASE_URL=file:studycast.db` creates a durable local SQLite database for development. Set `DATABASE_URL` and `DATABASE_AUTH_TOKEN` to a hosted libSQL database for deployment.

Without an API key, the course API automatically returns the built-in Docker curriculum. If a generated episode cannot reach AI, the lesson API returns a focused starter lesson. If audio generation cannot reach AI, the browser voice preview keeps the listening flow available.

## Stack

- Next.js App Router
- React
- TypeScript
- OpenAI Responses API
- Plain CSS for the initial product shell
- Browser localStorage for prototype persistence

## Roadmap

1. Product shell ✅
2. AI curriculum generation ✅
3. AI explanation generation + teaching scripts ✅
4. TTS audio generation ✅
5. Database persistence ✅
6. Progress tracking ✅
7. Polish and deployment
