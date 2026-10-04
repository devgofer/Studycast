export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type LessonSection = {
  heading: string;
  body: string;
};

export type EpisodeLesson = {
  lead: string;
  sections: LessonSection[];
  callout?: string;
  takeaway: string;
  teachingScript: string;
};

export type CourseEpisode = {
  id: string;
  order: number;
  title: string;
  goal: string;
  duration: number;
  lesson?: EpisodeLesson;
  completedAt?: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  topic: string;
  level: CourseLevel;
  episodes: CourseEpisode[];
};
