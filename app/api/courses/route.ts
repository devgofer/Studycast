import { NextResponse } from "next/server";
import { createCoursePlan, getDemoFallback } from "@/lib/ai/course-planner";
import type { CourseLevel } from "@/lib/course-types";

const levels = new Set<CourseLevel>(["Beginner", "Intermediate", "Advanced"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { topic?: unknown; level?: unknown };
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";
    const level = typeof body.level === "string" ? body.level : "Beginner";

    if (!topic || topic.length > 120) {
      return NextResponse.json({ error: "Topic must be between 1 and 120 characters." }, { status: 400 });
    }

    if (!levels.has(level as CourseLevel)) {
      return NextResponse.json({ error: "Invalid learning level." }, { status: 400 });
    }

    const courseLevel = level as CourseLevel;

    try {
      const course = await createCoursePlan(topic, courseLevel);
      return NextResponse.json({ course, generatedBy: "ai" });
    } catch (error) {
      console.error("Course generation failed:", error);
      return NextResponse.json({
        course: getDemoFallback(topic, courseLevel),
        generatedBy: "demo-fallback",
        warning: "AI generation is unavailable. A demo curriculum is being shown so you can still explore Studycast.",
      });
    }
  } catch {
    return NextResponse.json({ error: "Unable to create course." }, { status: 400 });
  }
}
