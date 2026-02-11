BEGIN;
CREATE TABLE sources (
    source_id BIGSERIAL PRIMARY KEY,
    --primary key
    course_code TEXT,
    --course code
    title TEXT NOT NULL,
    --course title
    source_type TEXT NOT NULL,
    --cat or fat or whatever
    semester TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    --like 2025-26
    exam_year INT NOT NULL,
    --the actual year of exam like 2025 or 2026
    slot TEXT,
    campus TEXT DEFAULT 'CHENNAI',
    curriculum TEXT DEFAULT 'ACE',
    file_url TEXT,
    --link to cloud
    approval_status TEXT DEFAULT 'PENDING',
    --to prevent trolls
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_sources_filter ON sources(course_code, semester, academic_year, exam_year);
COMMIT;
