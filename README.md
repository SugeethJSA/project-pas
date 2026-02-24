# Pitch: VIT Student Paper Archive Platform
The project to create a unified materials portal for VIT Chennai, as a student-based community initiative.

## 1. Executive Summary

Students at VIT generate a **huge volume of academic material** every semester—CATs, FATs, PATs, assignments, and internal assessments. Today, most of this material is shared **informally via WhatsApp groups**, where it quickly becomes disorganized, duplicated, lost, or inaccessible to future batches.
This proposal outlines a **student‑run, transparent, and scalable platform** that acts as a **central archive for exam papers and questions**, built *by students, for students*. The system is designed to be **legally safe, technically sound, and community‑driven**, with optional personalization and strong moderation.
The long‑term vision is not just storage, but a **searchable, topic‑wise question bank** that helps students prepare smarter, not harder.

## 2. The Core Problem

### 2.1 Current State

- Papers are shared randomly in multiple WhatsApp groups
- Files get buried under chat messages
- Same paper is resent multiple times
- No standardized naming or categorization
- No long‑term preservation for future batches

### 2.2 Why Existing Solutions Are Insufficient

- Existing VIT resources are:
   - Fragmented
   - Not student‑maintained
   - Often limited in scope or outdated
- Informal archives lack:
   - Quality control
   - Accountability
   - Searchability

## 3. The Proposed Solution

A **centralized student paper archive platform** that:

- Allows **easy uploads** with proper metadata
- Prevents **duplicate submissions**
- Enables **open access for viewing**
- Scales across schools, courses, and years
- Evolves into a **question‑bank‑style learning tool: AI would be integrated to extract data from the question papers and turn it into fun question-based quiz.**

This platform is not intended to replace official university systems, but to **complement them** in a student‑friendly way.

## 4. What Content Will Be Stored

### 4.1 Exam Papers

- CAT (all slots)
- FAT
- PAT (memory‑based where official papers don’t exist)

### 4.2 Assignment & Practice Material

- VITCOLAB assignment questions
- Screenshots or copied questions (where PDFs aren’t available)

## 5. Upload Process (Student Perspective)

1. Student uploads a PDF / image / text
2. Student fills a simple form:
   - Course Code
   - Exam Type (CAT/FAT/PAT/etc.)
   - Date
   - Slot / Shift
   - School / Department
3. System checks for duplicates
4. Paper enters the archive (or review queue)

This ensures **organization without friction**.

## 6. Access & Authentication Philosophy

### 6.1 Viewing Papers

- **No login required**
- Anyone can browse and download
- Ensures maximum accessibility

### 6.2 Uploading Papers

Two models are proposed:

**Option A – Anonymous Uploads**

- Low barrier to entry
- Moderation required

**Option B – Optional VTOP Authentication**

- Used *only* for uploads or personalization
- Never required for viewing
- No credential storage
- Fully open‑source authentication flow

This hybrid approach respects **privacy concerns** raised in discussion while still enabling verification where useful.

## 7. Personalization Features (Optional)

For users who choose to log in:

- Highlight enrolled courses
- Show relevant papers first
- Track personal contribution history
- Add papers

Non‑logged‑in users receive the full archive without restrictions.

## 8. Preventing Duplicates & Errors

- Metadata comparison (course + date + slot)
- File hash matching
- Manual reviewer intervention for conflicts

This avoids archive pollution and repeated uploads.

## 9. Community‑Driven Roles

### 9.1 Contributors

- Upload papers
- Provide memory‑based questions

### 9.2 School / Department Representatives

- Coordinate uploads for a school
- Ensure coverage
- Reduce reliance on random participation

### 9.3 Reviewers / Maintainers

- Verify metadata
- Remove duplicates
- Maintain archive quality

## 10. Incentives & Motivation

### 10.1 What We Will Do

- Public contributor profiles
- Recognition pages
- Leaderboards

### 10.2 What We Will NOT Do

- Access‑restricted incentives
- NeoPass‑style systems

Reason: These raise **TOS and disciplinary risks**, as discussed in the group.

## 11. Temporary Phase (Before Full Build)

Until the platform is ready:

- A **shared Google Drive** will act as the interim archive
- Standard folder structure
- Acts as a data source for migration later

## This ensures **immediate impact**.

## 12. Question Bank Extension (Major Future Feature)

Beyond PDFs, the platform evolves into a **question bank**:

- Filter by:
   - Subject
   - Topic
   - Exam
- Output:
   - Relevant past questions
   - Year & source

This directly addresses how students actually study.

## 13. Memory‑Based & AI‑Assisted Expansion

### 13.1 Memory‑Based Inputs

- Dedicated interface to:
   - Type questions
   - Upload screenshots

### 13.2 AI‑Assisted Processing (Exploratory)

- Clean up incomplete inputs
- Reconstruct likely questions
- Identify repeated concepts
- Generate **clearly marked** ideal solutions

AI is an *assistive tool*, not a replacement for verification.

## 14. Legal & Ethical Guardrails

- No scraping or automation on VTOP
- No credential harvesting
- No monetization or access gating
- Fully transparent, open‑source code

These guardrails were explicitly emphasized in discussion.

## 15. Development Roadmap

### Phase 0 – Ideation (Now)

- Open idea board
- Team formation

### Phase 1 – Interim Archive

- Google Drive

### Phase 2 – MVP Platform

- Upload
- Metadata
- Search & filter

### Phase 3 – Expansion

- Question bank
- Recognition systems
- AI tools

---

## 16. Why This Will Work

- Solves a **real, recurring pain point**
- Driven by motivated students
- Low‑risk, legal‑first approach
- Designed to scale naturally
- Flexible enough to evolve

---

## 17. Closing Note

This project is not just a website—it is a **student‑maintained academic memory** for VIT. With careful execution and community involvement, it can outlive batches and become a trusted resource for years.


-----------------------------------------------


THIS PROJECT IS NOT OFFICIALLY ASSOCIATED WITH VIT CHENNAI.

## Backend Setup (MVP)

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/project_pas
```

### 3. Run schema migrations

```bash
npm run migrate
```

This applies all SQL files in `db/schema` in filename order.

### 4. Start the backend

```bash
npm run dev
```

Server base URL: `http://localhost:4000`

## API Endpoints

### Health

- `GET /health`

### Sources

- `GET /api/sources`
  - Query filters: `course_code`, `source_type`, `semester`, `academic_year`, `exam_year`, `slot`, `approval_status`, `limit`, `offset`
  - Default: returns only `APPROVED` sources unless `approval_status` is specified.
- `GET /api/sources/:sourceId`
- `POST /api/sources`
  - Duplicate-protection on metadata: `course_code + source_type + semester + academic_year + exam_year + slot`

Sample payload:

```json
{
  "course_code": "CSE2001",
  "title": "Data Structures CAT-1",
  "source_type": "CAT",
  "semester": "Winter",
  "academic_year": "2025-26",
  "exam_year": 2025,
  "slot": "A1",
  "file_url": "https://example.com/file.pdf"
}
```

### Topics

- `GET /api/topics`
  - Optional query: `course_code`
- `POST /api/topics`

Sample payload:

```json
{
  "topic_name": "Binary Trees",
  "course_code": "CSE2001"
}
```

### Questions

- `GET /api/questions`
  - Query filters: `source_id`, `limit`, `offset`
  - Returns each question with attached topics.
- `POST /api/questions`
- `POST /api/questions/:questionId/topics`

Sample create payload:

```json
{
  "source_id": 1,
  "question_number": "Q1(a)",
  "question_type": "MCQ",
  "difficulty": "MEDIUM",
  "marks": 2,
  "topic_ids": [1, 2]
}
```

---

## Database Schema Overview (MVP)

The database is designed using a three-layer relational model:

```
sources → questions → topics
```

This structure enables efficient filtering, duplicate prevention, and future question-bank expansion.

---

### 1. Sources

Represents a paper, assignment, quiz, or memory-based submission.

Each row corresponds to one uploaded academic source.

**Key fields:**

- `source_id` – Primary key  
- `course_code` – Subject identifier (e.g., BACSE103)  
- `title` – Human-readable course title  
- `source_type` – CAT1 / CAT2 / FAT / PAT / ASSIGNMENT / MEMORY  
- `semester` – Fall / Winter / etc.  
- `academic_year` – Example: 2025-26  
- `exam_year` – Calendar year the exam occurred  
- `slot` – Slot of the subject  
- `file_url` – Location of stored file  
- `approval_status` – PENDING / APPROVED  
- `created_at` – Timestamp of entry  

**Duplicate protection is enforced on:**

```
course_code + source_type + semester + academic_year + exam_year + slot
```

This prevents repeated uploads of the same paper.

---

### 2. Questions

Represents individual questions extracted from a source.

Each question belongs to exactly one source.

**Key fields:**

- `question_id` – Primary key  
- `source_id` – Foreign key referencing `sources`  
- `question_number` – Label from original paper (e.g., Q1(a))  
- `question_type` – MCQ / NUMERICAL / DESCRIPTIVE  
- `difficulty` – EASY / MEDIUM / HARD  
- `marks` – Marks allocated  
- `created_at` – Timestamp  

This table enables the future transition from a PDF archive to a searchable question bank.

---

### 3. Topics

Represents conceptual tags used for filtering and organization.

**Key fields:**

- `topic_id` – Primary key  
- `topic_name` – Topic label (e.g., Binary Trees)  
- `course_code` – Associated course  

A many-to-many relationship exists between questions and topics:

```
questions ↔ question_topics ↔ topics
```

This allows a single question to belong to multiple topics and enables topic-wise filtering across years and exams.

---

### Migration System

All schema files are located in:

```bash
db/schema/
```

They are executed in filename order (e.g., `001_`, `002_`, `003_`).

**Important Rule:**

- Existing migration files should not be modified after being committed.
- New schema changes must be introduced as new migration files.

This ensures database consistency across all contributors and environments.

---
