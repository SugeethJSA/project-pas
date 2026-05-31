import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

const topicCreateSchema = z.object({
  topic_name: z.string().trim().min(1),
  course_code: z.string().trim().min(1).optional().nullable(),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const course_code = searchParams.get("course_code");
    const params = [];
    let sql = "SELECT * FROM topics";

    if (course_code) {
      params.push(course_code);
      sql += ` WHERE course_code = $${params.length} OR course_code IS NULL`;
    }

    sql += " ORDER BY topic_name ASC";
    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = topicCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors }, { status: 400 });
    }

    const payload = result.data;
    const existing = await query(
      `
        SELECT topic_id
        FROM topics
        WHERE topic_name = $1
          AND course_code IS NOT DISTINCT FROM $2
        LIMIT 1
      `,
      [payload.topic_name, payload.course_code ?? null]
    );

    if (existing.rowCount > 0) {
      return NextResponse.json({
        success: false,
        error: "Topic already exists",
        topic_id: existing.rows[0].topic_id,
      }, { status: 409 });
    }

    const insertResult = await query(
      `
        INSERT INTO topics (topic_name, course_code)
        VALUES ($1, $2)
        RETURNING *
      `,
      [payload.topic_name, payload.course_code ?? null]
    );

    return NextResponse.json({
      success: true,
      data: insertResult.rows[0],
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
