const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse");
const { requireAdmin } = require("../middleware/auth");
const { query } = require("../db/query");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/questions", requireAdmin, upload.single("file"), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No CSV file uploaded" });
  }

  try {
    const csvData = req.file.buffer.toString('utf8');
    
    // Using csv-parse with columns: true to auto-map headers
    parse(csvData, { columns: true, skip_empty_lines: true }, async (err, records) => {
      if (err) {
        return res.status(400).json({ success: false, error: "Failed to parse CSV" });
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
              // Get or create topic
              let topicId;
              const tCheck = await query("SELECT topic_id FROM topics WHERE name ILIKE $1", [tName]);
              if (tCheck.rowCount > 0) {
                topicId = tCheck.rows[0].topic_id;
              } else {
                const tInsert = await query("INSERT INTO topics (name) VALUES ($1) RETURNING topic_id", [tName]);
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

      return res.json({
        success: true,
        data: {
          total: records.length,
          successCount,
          errorCount,
          errors
        }
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
