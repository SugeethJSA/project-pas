import { NextResponse } from "next/server";
import { z } from "zod";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

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
  approval_status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const course_code = searchParams.get("course_code");
    const source_type = searchParams.get("source_type");
    const semester = searchParams.get("semester");
    const academic_year = searchParams.get("academic_year");
    const exam_year = searchParams.get("exam_year");
    const slot = searchParams.get("slot");
    const approval_status = searchParams.get("approval_status");
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

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
  try {
    const body = await request.json();
    const result = sourceCreateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.errors }, { status: 400 });
    }

    const payload = result.data;

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
      return NextResponse.json({
        success: false,
        error: "Potential duplicate source exists for this exam metadata",
        duplicate_source_id: duplicateCheck.rows[0].source_id,
      }, { status: 409 });
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

    return NextResponse.json({
      success: true,
      data: insertResult.rows[0],
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
