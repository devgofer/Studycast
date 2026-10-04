export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type CourseEpisode = {
  id: string;
  order: number;
  title: string;
  goal: string;
  duration: number;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  topic: string;
  level: CourseLevel;
  episodes: CourseEpisode[];
};
