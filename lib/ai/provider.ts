import type { Course, CourseLevel } from "@/lib/course-types";

export type CoursePlanInput = {
  topic: string;
  level: CourseLevel;
};

export interface LLMProvider {
  generateCoursePlan(input: CoursePlanInput): Promise<Course>;
}
