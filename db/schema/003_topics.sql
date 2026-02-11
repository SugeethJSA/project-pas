BEGIN;
CREATE TABLE topics (
    topic_id BIGSERIAL PRIMARY KEY,
    topic_name TEXT NOT NULL,
    course_code TEXT
);
CREATE TABLE question_topics (
    question_id BIGINT REFERENCES questions(question_id) ON DELETE CASCADE,
    topic_id BIGINT REFERENCES topics(topic_id) ON DELETE CASCADE,
    PRIMARY KEY(question_id, topic_id)
);
--junction table
COMMIT;
