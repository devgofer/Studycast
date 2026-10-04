import { NextResponse } from "next/server";
import { createLesson, getLessonFallback } from "@/lib/ai/course-planner";
import type { CourseEpisode, CourseLevel } from "@/lib/course-types";

const levels = new Set<CourseLevel>(["Beginner", "Intermediate", "Advanced"]);

function parseRequest(body: unknown): {
  course: { title: string; description: string; topic: string; level: CourseLevel };
  episode: CourseEpisode;
} | null {
  if (!body || typeof body !== "object") return null;

  const value = body as { course?: unknown; episode?: unknown };
  if (!value.course || typeof value.course !== "object" ||
      !value.episode || typeof value.episode !== "object") return null;

  const course = value.course as Record<string, unknown>;
  const episode = value.episode as Record<string, unknown>;
  if (typeof course.title !== "string" || typeof course.description !== "string" ||
      typeof course.topic !== "string" || typeof course.level !== "string" ||
      !levels.has(course.level as CourseLevel) ||
      typeof episode.id !== "string" || typeof episode.order !== "number" ||
      typeof episode.title !== "string" || typeof episode.goal !== "string" ||
      typeof episode.duration !== "number") {
    return null;
  }

  const normalizedCourse = {
    title: course.title.trim(),
    description: course.description.trim(),
    topic: course.topic.trim(),
    level: course.level as CourseLevel,
  };
  const normalizedEpisode = {
    id: episode.id.trim(),
    order: Math.round(episode.order),
    title: episode.title.trim(),
    goal: episode.goal.trim(),
    duration: Math.round(episode.duration),
  };

  if (!normalizedCourse.title || !normalizedCourse.description || !normalizedCourse.topic ||
      !normalizedEpisode.id || !normalizedEpisode.title || !normalizedEpisode.goal ||
      normalizedEpisode.order < 1 || normalizedEpisode.duration < 1) {
    return null;
  }

  return { course: normalizedCourse, episode: normalizedEpisode };
}

export async function POST(request: Request) {
  try {
    const input = parseRequest(await request.json());
    if (!input) {
      return NextResponse.json({ error: "A valid course and episode are required." }, { status: 400 });
    }

    try {
      const lesson = await createLesson(input.course, input.episode);
      return NextResponse.json({ lesson, generatedBy: "ai" });
    } catch (error) {
      console.error("Lesson generation failed:", error);
      return NextResponse.json({
        lesson: getLessonFallback(input.course, input.episode),
        generatedBy: "demo-fallback",
        warning: "AI lesson generation is unavailable. A starter lesson is being shown so you can keep learning.",
      });
    }
  } catch {
    return NextResponse.json({ error: "Unable to create lesson." }, { status: 400 });
  }
}
