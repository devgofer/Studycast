import { createSpeech } from "@/lib/ai/course-planner";
import { isTtsVoice } from "@/lib/tts-voices";

const MAX_SCRIPT_LENGTH = 4096;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { teachingScript?: unknown; voice?: unknown };
    const teachingScript = typeof body.teachingScript === "string"
      ? body.teachingScript.trim()
      : "";

    if (!teachingScript || teachingScript.length > MAX_SCRIPT_LENGTH) {
      return Response.json(
        { error: `Teaching scripts must be between 1 and ${MAX_SCRIPT_LENGTH} characters.` },
        { status: 400 },
      );
    }

    if (body.voice !== undefined && !isTtsVoice(body.voice)) {
      return Response.json({ error: "Choose a supported voice." }, { status: 400 });
    }

    const audio = await createSpeech({ teachingScript, voice: body.voice });
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Audio generation failed:", error);
    return Response.json(
      { error: "AI audio is unavailable. Browser voice preview is ready instead." },
      { status: 503 },
    );
  }
}
