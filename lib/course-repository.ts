import { createClient, type Client } from "@libsql/client";
import type { Course } from "@/lib/course-types";

let client: Client | null = null;

function getClient(): Client {
  if (client) return client;

  client = createClient({
    url: process.env.DATABASE_URL || "file:studycast.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  return client;
}

async function ensureSchema() {
  await getClient().execute(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}

export async function saveCourseRecord(course: Course): Promise<void> {
  await ensureSchema();
  await getClient().execute({
    sql: `
      INSERT INTO courses (id, content, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        content = excluded.content,
        updated_at = excluded.updated_at
    `,
    args: [course.id, JSON.stringify(course), new Date().toISOString()],
  });
}

export async function getCourseRecord(courseId: string): Promise<Course | null> {
  await ensureSchema();
  const result = await getClient().execute({
    sql: "SELECT content FROM courses WHERE id = ?",
    args: [courseId],
  });
  const content = result.rows[0]?.content;

  if (typeof content !== "string") return null;
  return JSON.parse(content) as Course;
}
