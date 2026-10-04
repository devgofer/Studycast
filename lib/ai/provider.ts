import type { Course, CourseEpisode, CourseLevel, EpisodeLesson } from "@/lib/course-types";

export type CoursePlanInput = {
  topic: string;
  level: CourseLevel;
};

export type LessonGenerationInput = {
  course: Pick<Course, "title" | "description" | "topic" | "level">;
  episode: CourseEpisode;
};

export type SpeechGenerationInput = {
  teachingScript: string;
};

export interface LLMProvider {
  generateCoursePlan(input: CoursePlanInput): Promise<Course>;
  generateLesson(input: LessonGenerationInput): Promise<EpisodeLesson>;
  generateSpeech(input: SpeechGenerationInput): Promise<ArrayBuffer>;
}
