import type { Course, CourseEpisode, EpisodeLesson, LessonSection } from "@/lib/course-types";
import type { CoursePlanInput, LessonGenerationInput, LLMProvider } from "./provider";

const DEFAULT_MODEL = "gpt-5.5";

type OpenAIOutput = {
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
  output_text?: string;
};

function extractOutputText(data: OpenAIOutput): string {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const text = data.output?.flatMap((item) => item.content ?? [])
    .map((content) => content.text ?? "")
    .join("")
    .trim();

  if (!text) throw new Error("OpenAI returned no text output.");
  return text;
}

function parseCoursePlan(raw: string, topic: string, level: CoursePlanInput["level"]): Course {
  const cleaned = raw.replace(/^\s*\`\`\`json\s*/i, "")
    .replace(/^\s*\`\`\`\s*/i, "")
    .replace(/\s*\`\`\`\s*$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as {
    title?: unknown;
    description?: unknown;
    episodes?: unknown;
  };

  if (typeof parsed.title !== "string" ||
      typeof parsed.description !== "string" ||
      !Array.isArray(parsed.episodes) ||
      parsed.episodes.length < 4 ||
      parsed.episodes.length > 12) {
    throw new Error("The AI returned an invalid course structure.");
  }

  const episodes: CourseEpisode[] = parsed.episodes.map((item, index) => {
    const value = item as Record<string, unknown>;
    if (typeof value.title !== "string" ||
        typeof value.goal !== "string" ||
        typeof value.duration !== "number") {
      throw new Error("The AI returned an invalid episode.");
    }

    return {
      id: `episode-${index + 1}`,
      order: index + 1,
      title: value.title.trim(),
      goal: value.goal.trim(),
      duration: Math.max(3, Math.min(25, Math.round(value.duration))),
    };
  });

  return {
    id: `course-${Date.now()}`,
    title: parsed.title.trim(),
    description: parsed.description.trim(),
    topic,
    level,
    episodes,
  };
}

function parseLesson(raw: string): EpisodeLesson {
  const cleaned = raw.replace(/^\s*\`\`\`json\s*/i, "")
    .replace(/^\s*\`\`\`\s*/i, "")
    .replace(/\s*\`\`\`\s*$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;
  const requiredText = ["lead", "takeaway", "teachingScript"] as const;

  for (const field of requiredText) {
    if (typeof parsed[field] !== "string" || !parsed[field].trim()) {
      throw new Error("The AI returned an invalid lesson.");
    }
  }

  if (!Array.isArray(parsed.sections) || parsed.sections.length < 3 || parsed.sections.length > 5) {
    throw new Error("The AI returned an invalid lesson structure.");
  }

  const sections: LessonSection[] = parsed.sections.map((item) => {
    const section = item as Record<string, unknown>;
    if (typeof section.heading !== "string" || !section.heading.trim() ||
        typeof section.body !== "string" || !section.body.trim()) {
      throw new Error("The AI returned an invalid lesson section.");
    }

    return { heading: section.heading.trim(), body: section.body.trim() };
  });

  return {
    lead: (parsed.lead as string).trim(),
    sections,
    ...(typeof parsed.callout === "string" && parsed.callout.trim()
      ? { callout: parsed.callout.trim() }
      : {}),
    takeaway: (parsed.takeaway as string).trim(),
    teachingScript: (parsed.teachingScript as string).trim(),
  };
}

export class OpenAIProvider implements LLMProvider {
  async generateCoursePlan(input: CoursePlanInput): Promise<Course> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        instructions: [
          "You are Studycast's curriculum architect.",
          "Turn one broad topic into a coherent learning path.",
          "Think about concept dependencies: learners should meet prerequisites before advanced ideas.",
          "Design for one human learner, not an academic syllabus.",
          "Favor intuition and practical understanding over exhaustive coverage.",
          "Return ONLY valid JSON. No markdown fences. No commentary.",
        ].join(" "),
        input: `Create a ${input.level.toLowerCase()} course about: "${input.topic.trim()}".

Return this exact JSON shape:
{
  "title": "course title",
  "description": "one or two sentence course description",
  "episodes": [
    {
      "title": "episode title",
      "goal": "one sentence describing what the learner should understand after this episode",
      "duration": 8
    }
  ]
}

Rules:
- Create 6 to 10 episodes.
- Episode order must reflect learning dependencies.
- Start with the mental model and why the topic matters.
- Move from fundamentals to practical concepts.
- End with integration, real-world usage, or a practical mental model.
- Avoid duplicate episodes.
- Keep episode titles concise.
- Duration is an estimated number of minutes for the written/audio explanation.`,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 300)}`);
    }

    const data = (await response.json()) as OpenAIOutput;
    return parseCoursePlan(extractOutputText(data), input.topic.trim(), input.level);
  }

  async generateLesson(input: LessonGenerationInput): Promise<EpisodeLesson> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        instructions: [
          "You are Studycast's patient lesson writer.",
          "Teach one concept for a human learner in clear, concrete language.",
          "Build understanding from the episode goal and avoid assuming missing prerequisites.",
          "Write a distinct spoken teaching script; do not copy the written lesson.",
          "Return ONLY valid JSON. No markdown fences. No commentary.",
        ].join(" "),
        input: `Write a ${input.course.level.toLowerCase()} Studycast lesson.

Course topic: "${input.course.topic}"
Course title: "${input.course.title}"
Course description: "${input.course.description}"
Episode ${input.episode.order}: "${input.episode.title}"
Learning goal: "${input.episode.goal}"
Estimated duration: ${input.episode.duration} minutes

Return this exact JSON shape:
{
  "lead": "two or three sentences that orient the learner",
  "sections": [
    { "heading": "concise heading", "body": "one clear explanatory paragraph" }
  ],
  "callout": "an optional memorable insight, analogy, or practical prompt",
  "takeaway": "one sentence the learner should remember",
  "teachingScript": "a natural 2–4 minute spoken lesson, written as its own narration"
}

Rules:
- Include 3 to 5 sections in a useful teaching order.
- Explain ideas rather than listing facts.
- Use a practical example or analogy when it helps.
- Do not invent citations, sources, or external links.
- Keep the written lesson focused on this one episode.`,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 300)}`);
    }

    const data = (await response.json()) as OpenAIOutput;
    return parseLesson(extractOutputText(data));
  }
}
