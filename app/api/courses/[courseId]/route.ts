import { NextResponse } from "next/server";
import { getCourseRecord, saveCourseRecord } from "@/lib/course-repository";
import { isCourse } from "@/lib/course-validation";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/courses/[courseId]">,
) {
  try {
    const { courseId } = await params;
    const course = await getCourseRecord(courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Course lookup failed:", error);
    return NextResponse.json({ error: "Course storage is unavailable." }, { status: 503 });
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext<"/api/courses/[courseId]">,
) {
  try {
    const { courseId } = await params;
    const body = (await request.json()) as { course?: unknown };

    if (!isCourse(body.course) || body.course.id !== courseId) {
      return NextResponse.json({ error: "A valid course matching the route is required." }, { status: 400 });
    }

    await saveCourseRecord(body.course);
    return NextResponse.json({ course: body.course });
  } catch (error) {
    console.error("Course save failed:", error);
    return NextResponse.json({ error: "Course storage is unavailable." }, { status: 503 });
  }
}
