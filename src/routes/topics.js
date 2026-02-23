const express = require("express");
const { z } = require("zod");
const { query } = require("../db/query");
const validateBody = require("../middleware/validate");

const router = express.Router();

const topicCreateSchema = z.object({
  topic_name: z.string().trim().min(1),
  course_code: z.string().trim().min(1).optional().nullable(),
});

router.get("/", async (req, res, next) => {
  try {
    const { course_code } = req.query;
    const params = [];
    let sql = "SELECT * FROM topics";

    if (course_code) {
      params.push(course_code);
      sql += ` WHERE course_code = $${params.length} OR course_code IS NULL`;
    }

    sql += " ORDER BY topic_name ASC";
    const result = await query(sql, params);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateBody(topicCreateSchema), async (req, res, next) => {
  try {
    const payload = req.validatedBody;
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
      return res.status(409).json({
        success: false,
        error: "Topic already exists",
        topic_id: existing.rows[0].topic_id,
      });
    }

    const result = await query(
      `
        INSERT INTO topics (topic_name, course_code)
        VALUES ($1, $2)
        RETURNING *
      `,
      [payload.topic_name, payload.course_code ?? null]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
