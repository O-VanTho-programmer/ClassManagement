# TutorDesk - Project Progress

This document tracks the historical development milestones, active feature implementations, and future roadmap goals for the TutorDesk system.

---

## 📈 Status Overview

TutorDesk is currently in active development, with core features (User Authentication, Hub and Class Management, Attendance Logging, and basic AI grading) completed and verified. We are now working on integrating file importing and optimizing the AI generation workflows for teachers.

---

## 🏁 Completed Milestones

### 1. Core Platform Foundations
- [x] JWT authentication middleware security (`JOSE`).
- [x] Secure password hashing using `bcrypt`.
- [x] Database configuration pool and query handlers via `mysql2`.
- [x] Toast notification alerts context (`AlertProvider`).

### 2. Hub & Membership Control
- [x] Multi-hub creation and dashboard routing.
- [x] Invite teachers via email search.
- [x] Configurable Hub Role permissions (Owner, Master, Member).

### 3. Academic Structure
- [x] Class scheduler supporting multiple class times and days.
- [x] Visual schedule timetables.
- [x] Enrollment system with student onboarding dates.

### 4. Classroom Utilities
- [x] Flexible attendance logger supporting Present, Late, Excused, Absent, and Unchecked statuses.
- [x] Scoring and comments system per attendance.
- [x] Student registry for searching and editing records.

### 5. Automated AI Homework Workflows
- [x] Rich-text editing with React Quill.
- [x] Student image submissions and hosting integration via Cloudinary.
- [x] AI-assisted grading using Gemini Flash APIs comparing image buffers against the homework answer key.
- [x] Single-student and batch grading with full feedback per question.

---

## 🛠️ Current Work (In Progress)

### Homework Creation Upgrades
- [ ] **DOCX File Import**:
  - Add API endpoint (`/api/homework/parse-doc`) to convert `.docx` documents to HTML via Mammoth.
  - Integrate an import button in the frontend `CreateHomework` component.
  - Automatically populate the homework instructions editor with the converted document HTML.
- [ ] **Streamlined AI Answer Key Generation**:
  - Add API endpoint (`/api/ai/generate-answer-key-from-content`) to generate keys using Gemini directly from the current editor content.
  - Remove redundant step-by-step file uploads in the answer key section.
  - Set generated HTML directly to the draft answer key editor for teachers to refine.

---

## 📋 Future Roadmap

- [ ] Add support for offline caching of attendance records.
- [ ] Export grade books to Excel format.
- [ ] Push notifications for upcoming due dates.
- [ ] Enhanced statistical analytical charts for student performance over time.
- [ ] Teacher workload heatmaps.
