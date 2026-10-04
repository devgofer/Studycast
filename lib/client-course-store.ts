import type { Course } from "@/lib/course-types";

const PREFIX = "studycast:course:";

export function saveCourse(course: Course) {
  window.localStorage.setItem(PREFIX + course.id, JSON.stringify(course));
  void fetch(`/api/courses/${encodeURIComponent(course.id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course }),
  }).catch(() => undefined);
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

export async function getPersistedCourse(courseId: string): Promise<Course | null> {
  try {
    const response = await fetch(`/api/courses/${encodeURIComponent(courseId)}`);
    if (!response.ok) return null;

    const data = (await response.json()) as { course?: Course };
    return data.course ?? null;
  } catch {
    return null;
  }
}
