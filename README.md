# Studycast

> Tell us what you want to learn. We'll turn it into a course you can read or listen to.

Studycast turns a broad learning topic into a structured, multi-episode course. Each episode can become a clear written explanation and a separate teaching script for listening.

## v0.3 — AI Explanation Generator

The current milestone turns each generated course outline into on-demand lessons:

- Topic + learning level input
- AI-generated course title and description
- AI-generated 6–10 episode learning path
- Dependency-aware episode ordering
- Episode goals and estimated duration
- AI-generated written explanations with 3–5 focused sections
- AI-generated teaching scripts, separate from the written lesson
- Loading, error, retry, and lesson-fallback states on every episode
- Generated lessons saved back to browser-local course storage
- OpenAI Responses API integration
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
Browser Voice Preview
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
```

The LLM layer is provider-based so the product is not coupled to one model vendor.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `OPENAI_API_KEY` in `.env.local` for live curriculum and lesson generation. `OPENAI_MODEL` can be changed without touching application code.

Without an API key, the course API automatically returns the built-in Docker curriculum. If a generated episode cannot reach AI, the lesson API returns a focused starter lesson so the reading and listening flow remains usable.

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
4. TTS audio generation
5. Database persistence
6. Progress tracking
7. Polish and deployment
