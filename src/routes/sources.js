const express = require("express");
const { z } = require("zod");
const { query } = require("../db/query");
const validateBody = require("../middleware/validate");

const router = express.Router();

const sourceCreateSchema = z.object({
  course_code: z.string().trim().min(1).optional().nullable(),
  title: z.string().trim().min(1),
  source_type: z.string().trim().min(1),
  semester: z.string().trim().min(1),
  academic_year: z.string().trim().min(1),
  exam_year: z.number().int().min(2000).max(2100),
  slot: z.string().trim().min(1).optional().nullable(),
  campus: z.string().trim().min(1).optional(),
  curriculum: z.string().trim().min(1).optional(),
  file_url: z.string().trim().url().optional().nullable(),
  approval_status: z
    .enum(["PENDING", "APPROVED", "REJECTED"])
    .optional(),
});

router.get("/", async (req, res, next) => {
  try {
    const {
      course_code,
      source_type,
      semester,
      academic_year,
      exam_year,
      slot,
      approval_status,
      limit = "50",
      offset = "0",
    } = req.query;

    const clauses = [];
    const params = [];

    const pushClause = (clause, value) => {
      params.push(value);
      clauses.push(`${clause} $${params.length}`);
    };

    if (course_code) pushClause("course_code =", course_code);
    if (source_type) pushClause("source_type =", source_type);
    if (semester) pushClause("semester =", semester);
    if (academic_year) pushClause("academic_year =", academic_year);
    if (exam_year) pushClause("exam_year =", Number(exam_year));
    if (slot) pushClause("slot =", slot);

    if (approval_status) {
      pushClause("approval_status =", approval_status);
    } else {
      pushClause("approval_status =", "APPROVED");
    }

    const parsedLimit = Math.min(Math.max(Number(limit), 1), 200);
    const parsedOffset = Math.max(Number(offset), 0);
    params.push(parsedLimit, parsedOffset);

    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    const sql = `
      SELECT *
      FROM sources
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${params.length - 1}
      OFFSET $${params.length}
    `;

    const result = await query(sql, params);
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

router.get("/:sourceId", async (req, res, next) => {
  try {
    const sourceId = Number(req.params.sourceId);
    if (!Number.isInteger(sourceId) || sourceId <= 0) {
      return res.status(400).json({
        success: false,
        error: "sourceId must be a positive integer",
      });
    }

    const result = await query(
      "SELECT * FROM sources WHERE source_id = $1",
      [sourceId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Source not found",
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateBody(sourceCreateSchema), async (req, res, next) => {
  try {
    const payload = req.validatedBody;

    const duplicateCheck = await query(
      `
        SELECT source_id
        FROM sources
        WHERE course_code IS NOT DISTINCT FROM $1
          AND source_type = $2
          AND semester = $3
          AND academic_year = $4
          AND exam_year = $5
          AND slot IS NOT DISTINCT FROM $6
        LIMIT 1
      `,
      [
        payload.course_code ?? null,
        payload.source_type,
        payload.semester,
        payload.academic_year,
        payload.exam_year,
        payload.slot ?? null,
      ]
    );

    if (duplicateCheck.rowCount > 0) {
      return res.status(409).json({
        success: false,
        error: "Potential duplicate source exists for this exam metadata",
        duplicate_source_id: duplicateCheck.rows[0].source_id,
      });
    }

    const insertResult = await query(
      `
        INSERT INTO sources (
          course_code,
          title,
          source_type,
          semester,
          academic_year,
          exam_year,
          slot,
          campus,
          curriculum,
          file_url,
          approval_status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, 'CHENNAI'), COALESCE($9, 'ACE'), $10, COALESCE($11, 'PENDING'))
        RETURNING *
      `,
      [
        payload.course_code ?? null,
        payload.title,
        payload.source_type,
        payload.semester,
        payload.academic_year,
        payload.exam_year,
        payload.slot ?? null,
        payload.campus ?? null,
        payload.curriculum ?? null,
        payload.file_url ?? null,
        payload.approval_status ?? null,
      ]
    );

    return res.status(201).json({
      success: true,
      data: insertResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
