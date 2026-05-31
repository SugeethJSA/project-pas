import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const authResult = await verifyAdmin(request);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
  }

  try {
    const papersResult = await query("SELECT COUNT(*) FROM sources");
    const questionsResult = await query("SELECT COUNT(*) FROM questions");
    const pendingResult = await query("SELECT COUNT(*) FROM sources WHERE approval_status = 'PENDING'");

    return NextResponse.json({
      success: true,
      data: {
        totalPapers: parseInt(papersResult.rows[0].count, 10),
        totalQuestions: parseInt(questionsResult.rows[0].count, 10),
        pendingReviews: parseInt(pendingResult.rows[0].count, 10)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
