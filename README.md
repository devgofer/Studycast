# Studycast

> Tell us what you want to learn. We'll turn it into a course you can read or listen to.

Studycast turns a broad learning topic into a structured, multi-episode course. Each episode is designed to become a clear written explanation and a separate teaching lesson.

## v0.2 — AI Curriculum Planner

The current milestone turns the static product shell into an AI-powered curriculum flow:

- Topic + learning level input
- AI-generated course title and description
- AI-generated 6–10 episode learning path
- Dependency-aware episode ordering
- Episode goals and estimated duration
- OpenAI Responses API integration
- LLM provider abstraction
- Demo fallback when no API key is configured
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
Written Explanation + Audio Lesson
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
```

The LLM layer is provider-based so the product is not coupled to one model vendor.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `OPENAI_API_KEY` in `.env.local` for live curriculum generation. `OPENAI_MODEL` can be changed without touching application code.

Without an API key, the API automatically returns the built-in Docker curriculum as a demo fallback.

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
3. AI explanation generation
4. Teaching-script generation
5. TTS audio generation
6. Database persistence
7. Progress tracking
8. Polish and deployment
