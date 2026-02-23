const express = require("express");
const { z } = require("zod");
const { pool } = require("../db/query");
const validateBody = require("../middleware/validate");

const router = express.Router();

const createQuestionSchema = z.object({
  source_id: z.number().int().positive(),
  question_number: z.string().trim().min(1).optional().nullable(),
  question_type: z.string().trim().min(1).optional().nullable(),
  difficulty: z.string().trim().min(1).optional().nullable(),
  marks: z.number().int().nonnegative().optional().nullable(),
  topic_ids: z.array(z.number().int().positive()).optional(),
});

const attachTopicsSchema = z.object({
  topic_ids: z.array(z.number().int().positive()).min(1),
});

router.get("/", async (req, res, next) => {
  try {
    const { source_id, limit = "100", offset = "0" } = req.query;
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
        return res.status(400).json({
          success: false,
          error: "source_id must be a positive integer",
        });
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

    const result = await pool.query(sql, params);

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        limit: parsedLimit,
        offset: parsedOffset,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateBody(createQuestionSchema), async (req, res, next) => {
  const client = await pool.connect();

  try {
    const payload = req.validatedBody;
    await client.query("BEGIN");

    const sourceExists = await client.query(
      "SELECT source_id FROM sources WHERE source_id = $1",
      [payload.source_id]
    );

    if (sourceExists.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: "Source not found",
      });
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
        return res.status(400).json({
          success: false,
          error: "One or more topic_ids are invalid",
        });
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

    return res.status(201).json({
      success: true,
      data: question,
      topic_ids: topicIds,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

router.post(
  "/:questionId/topics",
  validateBody(attachTopicsSchema),
  async (req, res, next) => {
    const client = await pool.connect();
    try {
      const questionId = Number(req.params.questionId);
      if (!Number.isInteger(questionId) || questionId <= 0) {
        return res.status(400).json({
          success: false,
          error: "questionId must be a positive integer",
        });
      }

      const topicIds = [...new Set(req.validatedBody.topic_ids)];
      await client.query("BEGIN");

      const questionExists = await client.query(
        "SELECT question_id FROM questions WHERE question_id = $1",
        [questionId]
      );
      if (questionExists.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          error: "Question not found",
        });
      }

      const topicCheck = await client.query(
        "SELECT topic_id FROM topics WHERE topic_id = ANY($1::bigint[])",
        [topicIds]
      );
      if (topicCheck.rowCount !== topicIds.length) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          error: "One or more topic_ids are invalid",
        });
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
      return res.json({
        success: true,
        question_id: questionId,
        topic_ids: topicIds,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      next(error);
    } finally {
      client.release();
    }
  }
);

module.exports = router;
