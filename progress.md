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

### 6. Gradebook Performance Weighting
- [x] Custom grade weight database schema (`class_grade_weight`).
- [x] CRUD API routes for fetching and saving grade weights (`get_class_grade_weights` and `save_class_grade_weights`).
- [x] Custom React Query query/mutation hooks (`useGetClassGradeWeights` and `useSaveClassGradeWeightsMutation`).
- [x] Settings button and interactive `SetGradeWeightsModal` component in the gradebook page to customize Attendance and Homework grade weights, validating that the allocation totals 100%.

### 7. Class Creation & Billing Configuration
- [x] Refactored `CreateClassModal` form to support tuition-based end date calculations (auto-calculating and disabling End Date for Quarter/Monthly tuitions).
- [x] Documented the new `invoice` database schema and architectural versioning rules.
- [x] Created `rule.md` to establish coding guidelines and styling standards for future development.

### 8. Class-Scoped Notification System
- [x] Designed database schemas (`notification`, `notification_recipient`) restricting visibility to class teachers and assistants.
- [x] Created `src/lib/notifications.ts` helper with automatic teaching staff lookup.
- [x] Added `GET`, `PATCH`, `DELETE` routes for fetching, marking status (read/star/trash), and cleaning trash.
- [x] Wired triggers into homework submission endpoints (public and private).
- [x] Wired triggers into student class enrollment endpoint.
- [x] Hooked daily cron check (`cron/check_homework`) to issue upcoming deadline warnings (2 days out) and final alerts when deadlines are met.
- [x] Updated UI in `page.jsx` to load and mutate notifications dynamically from the database.
- [x] Extracted fetching and status mutation logic into custom React Query hooks (`useGetNotifications` and `useUpdateNotifications`).
- [x] Resolved parsing/compiler issues in `page.jsx` by removing TypeScript type assertions from Javascript files.

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
