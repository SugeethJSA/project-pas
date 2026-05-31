import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { verifyAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(request) {
  const authResult = await verifyAdmin(request);
  if (!authResult.success) {
    return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No CSV file uploaded" }, { status: 400 });
    }

    const csvData = await file.text();
    
    let records;
    try {
      records = parse(csvData, { columns: true, skip_empty_lines: true });
    } catch (parseErr) {
      return NextResponse.json({ success: false, error: "Failed to parse CSV file: " + parseErr.message }, { status: 400 });
    }

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      try {
        // Expected Columns: Source_ID, Question_Number, Question_Type, Difficulty, Marks, Topic_Names, Question_Text
        const sourceId = Number(row.Source_ID);
        const qNum = Number(row.Question_Number) || i + 1;
        const qType = row.Question_Type || "DESCRIPTIVE";
        const difficulty = row.Difficulty || "MEDIUM";
        const marks = Number(row.Marks) || 0;
        const text = row.Question_Text;
        
        if (!sourceId || !text) {
          throw new Error("Missing required fields (Source_ID, Question_Text)");
        }

        // Verify source exists
        const sourceCheck = await query("SELECT source_id FROM sources WHERE source_id = $1", [sourceId]);
        if (sourceCheck.rowCount === 0) {
          throw new Error(`Source paper with ID ${sourceId} does not exist`);
        }

        // Insert question
        const qResult = await query(
          `INSERT INTO questions (source_id, question_number, question_text, question_type, marks, difficulty)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING question_id`,
          [sourceId, qNum, text, qType, marks, difficulty]
        );
        
        const questionId = qResult.rows[0].question_id;

        // Handle Topics (comma separated)
        if (row.Topic_Names) {
          const topics = row.Topic_Names.split(",").map(t => t.trim()).filter(Boolean);
          for (const tName of topics) {
            let topicId;
            const tCheck = await query("SELECT topic_id FROM topics WHERE topic_name ILIKE $1", [tName]);
            if (tCheck.rowCount > 0) {
              topicId = tCheck.rows[0].topic_id;
            } else {
              const tInsert = await query("INSERT INTO topics (topic_name) VALUES ($1) RETURNING topic_id", [tName]);
              topicId = tInsert.rows[0].topic_id;
            }
            
            // Link topic to question
            await query(
              "INSERT INTO question_topics (question_id, topic_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
              [questionId, topicId]
            );
          }
        }

        successCount++;
      } catch (rowErr) {
        errorCount++;
        errors.push(`Row ${i + 2}: ${rowErr.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        total: records.length,
        successCount,
        errorCount,
        errors
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
