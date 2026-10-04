import { demoCourse } from "@/lib/mock-data";
import type { Course, CourseLevel } from "@/lib/course-types";
import { OpenAIProvider } from "./openai-provider";
import type { LLMProvider } from "./provider";

function getProvider(): LLMProvider {
  return new OpenAIProvider();
}

export async function createCoursePlan(topic: string, level: CourseLevel): Promise<Course> {
  return getProvider().generateCoursePlan({ topic, level });
}

export function getDemoFallback(topic: string, level: CourseLevel): Course {
  return {
    ...demoCourse,
    id: `demo-${Date.now()}`,
    topic: topic.trim() || demoCourse.topic,
    level,
  };
}
