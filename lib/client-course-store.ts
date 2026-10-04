import type { Course } from "@/lib/course-types";

const PREFIX = "studycast:course:";

export function saveCourse(course: Course) {
  window.localStorage.setItem(PREFIX + course.id, JSON.stringify(course));
}

export function getStoredCourse(courseId: string): Course | null {
  const raw = window.localStorage.getItem(PREFIX + courseId);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Course;
  } catch {
    window.localStorage.removeItem(PREFIX + courseId);
    return null;
  }
}
