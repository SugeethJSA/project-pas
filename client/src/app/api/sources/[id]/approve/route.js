import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export async function PUT(request, { params }) {
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

    const updateResult = await query(
      "UPDATE sources SET approval_status = 'APPROVED' WHERE source_id = $1 RETURNING *",
      [sourceId]
    );

    if (updateResult.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Source not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updateResult.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
