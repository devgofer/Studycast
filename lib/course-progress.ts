import type { Course } from "@/lib/course-types";

export function getCompletedEpisodeCount(course: Course): number {
  return course.episodes.filter((episode) => episode.completedAt).length;
}

export function getCourseProgressPercent(course: Course): number {
  if (course.episodes.length === 0) return 0;
  return Math.round((getCompletedEpisodeCount(course) / course.episodes.length) * 100);
}
