import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/lib/db";

const attachTopicsSchema = z.object({
  topic_ids: z.array(z.number().int().positive()).min(1),
});

export async function POST(request, { params }) {
  const client = await pool.connect();
  try {
    const { id } = await params;
    const questionId = Number(id);
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return NextResponse.json({
        success: false,
        error: "questionId must be a positive integer",
      }, { status: 400 });
    }

    const body = await request.json();
    const result = attachTopicsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors }, { status: 400 });
    }

    const topicIds = [...new Set(result.data.topic_ids)];
    await client.query("BEGIN");

    const questionExists = await client.query(
      "SELECT question_id FROM questions WHERE question_id = $1",
      [questionId]
    );
    if (questionExists.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({
        success: false,
        error: "Question not found",
      }, { status: 404 });
    }

    const topicCheck = await client.query(
      "SELECT topic_id FROM topics WHERE topic_id = ANY($1::bigint[])",
      [topicIds]
    );
    if (topicCheck.rowCount !== topicIds.length) {
      await client.query("ROLLBACK");
      return NextResponse.json({
        success: false,
        error: "One or more topic_ids are invalid",
      }, { status: 400 });
    }

    for (const topicId of topicIds) {
      await client.query(
        `
          INSERT INTO question_topics (question_id, topic_id)
          VALUES ($1, $2)
          ON CONFLICT (question_id, topic_id) DO NOTHING
        `,
        [questionId, topicId]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({
      success: true,
      question_id: questionId,
      topic_ids: topicIds,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
