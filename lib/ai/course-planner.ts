import { demoCourse } from "@/lib/mock-data";
import type { Course, CourseEpisode, CourseLevel, EpisodeLesson } from "@/lib/course-types";
import { OpenAIProvider } from "./openai-provider";
import type { LLMProvider, SpeechGenerationInput } from "./provider";

function getProvider(): LLMProvider {
  return new OpenAIProvider();
}

export async function createCoursePlan(topic: string, level: CourseLevel): Promise<Course> {
  return getProvider().generateCoursePlan({ topic, level });
}

export async function createLesson(
  course: Pick<Course, "title" | "description" | "topic" | "level">,
  episode: CourseEpisode,
): Promise<EpisodeLesson> {
  return getProvider().generateLesson({ course, episode });
}

export async function createSpeech(input: SpeechGenerationInput): Promise<ArrayBuffer> {
  return getProvider().generateSpeech(input);
}

export function getDemoFallback(topic: string, level: CourseLevel): Course {
  return {
    ...demoCourse,
    id: `demo-${Date.now()}`,
    topic: topic.trim() || demoCourse.topic,
    level,
  };
}

export function getLessonFallback(
  course: Pick<Course, "title" | "topic">,
  episode: CourseEpisode,
): EpisodeLesson {
  return {
    lead: `This lesson is a practical starting point for ${episode.title}, one step in your ${course.title} learning path.`,
    sections: [
      {
        heading: "Start with the goal",
        body: episode.goal,
      },
      {
        heading: "Make the idea concrete",
        body: `Connect ${episode.title} to a situation you already know. Ask what changes when you apply this idea, what problem it solves, and what would be harder without it.`,
      },
      {
        heading: "Keep building",
        body: `You do not need to master every detail at once. Use this episode as a lens for the next part of ${course.topic}, and return to the goal when a new term feels unfamiliar.`,
      },
    ],
    callout: "A learning path works best when each new idea has a clear connection to the one before it.",
    takeaway: episode.goal,
    teachingScript: `Welcome to ${episode.title}. In this lesson, we are working toward one clear outcome: ${episode.goal} Start by connecting the idea to a real problem or situation you recognize. Then notice how it fits into the larger topic of ${course.topic}. Keep the goal close as you learn the details, because understanding the purpose makes the details much easier to remember.`,
  };
}
