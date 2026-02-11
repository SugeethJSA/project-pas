BEGIN;
CREATE TABLE questions (
    question_id BIGSERIAL PRIMARY KEY,
    source_id BIGINT NOT NULL REFERENCES sources(source_id) ON DELETE CASCADE,
    --from what source
    question_number TEXT,
    --number from the original paper (for easy identification)
    question_type TEXT,
    -- MCQ or numericals etc
    difficulty TEXT,
    marks INT,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_questions_source ON questions(source_id);
COMMIT;
