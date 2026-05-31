import { NextResponse } from "next/server";
import { z } from "zod";
import { query, pool } from "@/lib/db";

export const dynamic = "force-dynamic";

const createQuestionSchema = z.object({
  source_id: z.number().int().positive(),
  question_number: z.string().trim().min(1).optional().nullable(),
  question_type: z.string().trim().min(1).optional().nullable(),
  difficulty: z.string().trim().min(1).optional().nullable(),
  marks: z.number().int().nonnegative().optional().nullable(),
  topic_ids: z.array(z.number().int().positive()).optional(),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const source_id = searchParams.get("source_id");
    const limit = searchParams.get("limit") || "100";
    const offset = searchParams.get("offset") || "0";

    const params = [];
    let sql = `
      SELECT
        q.*,
        COALESCE(
          json_agg(
            json_build_object('topic_id', t.topic_id, 'topic_name', t.topic_name)
          ) FILTER (WHERE t.topic_id IS NOT NULL),
          '[]'
        ) AS topics
      FROM questions q
      LEFT JOIN question_topics qt ON qt.question_id = q.question_id
      LEFT JOIN topics t ON t.topic_id = qt.topic_id
    `;

    if (source_id) {
      const parsedSourceId = Number(source_id);
      if (!Number.isInteger(parsedSourceId) || parsedSourceId <= 0) {
        return NextResponse.json({
          success: false,
          error: "source_id must be a positive integer",
        }, { status: 400 });
      }

      params.push(parsedSourceId);
      sql += ` WHERE q.source_id = $${params.length}`;
    }

    const parsedLimit = Math.min(Math.max(Number(limit), 1), 500);
    const parsedOffset = Math.max(Number(offset), 0);
    params.push(parsedLimit, parsedOffset);

    sql += `
      GROUP BY q.question_id
      ORDER BY q.created_at DESC
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
    `;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parsedLimit,
        offset: parsedOffset,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const result = createQuestionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors }, { status: 400 });
    }

    const payload = result.data;
    await client.query("BEGIN");

    const sourceExists = await client.query(
      "SELECT source_id FROM sources WHERE source_id = $1",
      [payload.source_id]
    );

    if (sourceExists.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({
        success: false,
        error: "Source not found",
      }, { status: 404 });
    }

    const questionResult = await client.query(
      `
        INSERT INTO questions (source_id, question_number, question_type, difficulty, marks)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `,
      [
        payload.source_id,
        payload.question_number ?? null,
        payload.question_type ?? null,
        payload.difficulty ?? null,
        payload.marks ?? null,
      ]
    );

    const question = questionResult.rows[0];
    const topicIds = Array.isArray(payload.topic_ids) ? [...new Set(payload.topic_ids)] : [];

    if (topicIds.length > 0) {
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
          [question.question_id, topicId]
        );
      }
    }

    await client.query("COMMIT");

    return NextResponse.json({
      success: true,
      data: question,
      topic_ids: topicIds,
    }, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK");
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
