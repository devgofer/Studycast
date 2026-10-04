import type { Course, CourseEpisode, CourseLevel, EpisodeLesson, LessonSection } from "@/lib/course-types";

const levels = new Set<CourseLevel>(["Beginner", "Intermediate", "Advanced"]);

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSection(value: unknown): value is LessonSection {
  if (!value || typeof value !== "object") return false;
  const section = value as Record<string, unknown>;
  return isText(section.heading) && isText(section.body);
}

function isLesson(value: unknown): value is EpisodeLesson {
  if (!value || typeof value !== "object") return false;
  const lesson = value as Record<string, unknown>;
  return isText(lesson.lead) &&
    Array.isArray(lesson.sections) &&
    lesson.sections.length >= 1 &&
    lesson.sections.every(isSection) &&
    (lesson.callout === undefined || isText(lesson.callout)) &&
    isText(lesson.takeaway) &&
    isText(lesson.teachingScript);
}

function isEpisode(value: unknown): value is CourseEpisode {
  if (!value || typeof value !== "object") return false;
  const episode = value as Record<string, unknown>;
  return isText(episode.id) &&
    typeof episode.order === "number" && Number.isInteger(episode.order) && episode.order > 0 &&
    isText(episode.title) &&
    isText(episode.goal) &&
    typeof episode.duration === "number" && Number.isFinite(episode.duration) && episode.duration > 0 &&
    (episode.lesson === undefined || isLesson(episode.lesson));
}

export function isCourse(value: unknown): value is Course {
  if (!value || typeof value !== "object") return false;
  const course = value as Record<string, unknown>;
  return isText(course.id) &&
    isText(course.title) &&
    isText(course.description) &&
    isText(course.topic) &&
    typeof course.level === "string" && levels.has(course.level as CourseLevel) &&
    Array.isArray(course.episodes) &&
    course.episodes.length > 0 &&
    course.episodes.every(isEpisode);
}
