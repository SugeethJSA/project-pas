import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const sourceId = Number(id);
    if (!Number.isInteger(sourceId) || sourceId <= 0) {
      return NextResponse.json({
        success: false,
        error: "sourceId must be a positive integer",
      }, { status: 400 });
    }

    const result = await query(
      "SELECT * FROM sources WHERE source_id = $1",
      [sourceId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: "Source not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const authResult = await verifyAdmin(request);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
  }

  try {
    const { id } = await params;
    const sourceId = Number(id);
    if (!Number.isInteger(sourceId) || sourceId <= 0) {
      return NextResponse.json({ success: false, error: "sourceId must be a positive integer" }, { status: 400 });
    }

    const deleteResult = await query(
      "DELETE FROM sources WHERE source_id = $1 RETURNING source_id",
      [sourceId]
    );

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Source not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Source deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
