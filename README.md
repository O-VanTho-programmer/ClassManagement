# TutorDesk - Class Management System

A comprehensive, full-stack class management application built with Next.js 15, TypeScript, and MySQL. This system enables educational institutions and teachers to efficiently manage teaching hubs, classes, students, attendance, homework, and teacher workloads with AI-powered automated grading capabilities.

## 🎯 Problems Solved

### 1. **Centralized Educational Management**
- **Problem**: Educational institutions struggle with managing multiple classes, students, and teachers across different locations or departments.
- **Solution**: Hub-based architecture allows organizing teaching activities into dedicated hubs, enabling multi-hub collaboration while maintaining clear separation of concerns.

### 2. **Complex Permission Management**
- **Problem**: Different roles (Owners, Masters, Members) need granular access control across various features.
- **Solution**: Implemented a three-tier role-based access control (RBAC) system with granular permissions for Class Management, Student Management, Homework & Assignments, Attendance, and Admin & Settings.

### 3. **Manual Attendance Tracking**
- **Problem**: Traditional paper-based or spreadsheet attendance tracking is time-consuming and error-prone.
- **Solution**: Digital attendance system with dual views (Grid and List) for efficient tracking, supporting multiple status types (Present, Late, Excused, Absent) with comments and score recording.

### 4. **Homework Grading Workload**
- **Problem**: Teachers spend excessive time manually grading homework submissions.
- **Solution**: AI-powered automated grading using Google Gemini AI that analyzes student submissions against answer keys, providing detailed feedback and scores per question, with batch grading capabilities.

### 5. **Student Data Fragmentation**
- **Problem**: Student information scattered across multiple classes and systems.
- **Solution**: Hub-wide student registry with centralized management, allowing students to be enrolled in multiple classes while maintaining a single source of truth.

### 6. **Teacher Workload Visibility**
- **Problem**: Difficulty tracking teacher assignments and workload distribution.
- **Solution**: Teacher workload dashboard showing assigned classes, student counts, and workload statistics for better resource allocation.

### 7. **Schedule Management Complexity**
- **Problem**: Managing multiple class schedules with different days and times is complex.
- **Solution**: Flexible scheduling system supporting multiple schedules per class with customizable days and times, integrated with a visual timetable view.

## ✨ Highlighted Features

### 🏢 Hub Management
- **Multi-Hub Organization**: Create and manage multiple teaching hubs
- **Role-Based Access Control**: Three-tier permission system (Owner, Master, Member)
- **Hub Statistics**: Real-time tracking of classes, teachers, and students
- **Permission Management**: Granular permission editing for each hub member
- **Multi-Hub Collaboration**: Join multiple hubs as owner or guest member

### 📚 Class Management
- **Complete Class Lifecycle**: Create, view, update, and manage classes
- **Flexible Scheduling**: Multiple schedules per class with customizable days and times
- **Advanced Filtering**: Filter by status (Active/Finished), tuition type (Monthly/Quarter/Course/Flexible), and search
- **Dual View Modes**: Switch between table and card views for better visualization
- **Class Statistics**: Real-time student count and class status tracking
- **Time Table View**: Visual calendar representation of all class schedules

### 👥 Student Management
- **Student Enrollment**: Add students to classes with enrollment dates
- **Student Profiles**: Track student information including name, birthday, and status
- **Hub-Wide Student Registry**: Manage all students within a hub from a central location
- **Student Search and Filtering**: Quickly find students across classes
- **Student Attendance History**: View complete attendance records for individual students

### ✅ Attendance Tracking
- **Grid View**: Calendar-style attendance tracking for easy date selection
- **Multiple Status Types**: Track Present, Late, Excused, Absent, and Unchecked statuses
- **Homework Integration**: Record homework assignments and completion status within attendance
- **Score Recording**: Assign scores to student work directly in attendance records
- **Comments System**: Add detailed comments for each attendance record
- **Attendance History**: View complete attendance records for individual students

### 👨‍🏫 Teacher Management
- **Teacher Workload Dashboard**: View assigned classes and student counts per teacher
- **Teacher Assignment**: Assign teachers and assistants to classes
- **Role Management**: Manage teacher roles within hubs (Owner, Master, Member)
- **Teacher Search**: Search and add teachers to hubs via email
- **Permission Customization**: Fine-grained permission control per teacher

### 📝 Homework Management
- **Homework Library**: Create and manage homework in a hub-wide library
- **Rich Text Editor**: Create homework with rich text formatting using React Quill
- **Assignment System**: Assign homework to classes with assigned date and due date
- **Student Submissions**: Students can submit homework with image uploads via Cloudinary
- **AI-Powered Grading**: Automated grading using Google Gemini AI
  - Analyzes student submission images against answer keys
  - Provides detailed feedback per question
  - Calculates scores automatically
  - Supports batch grading for multiple students
- **Manual Grading Override**: Teachers can manually adjust AI grades
- **Grade Breakdown**: Per-question grade tracking with feedback
- **Submission Tracking**: Track submission status and due dates

### 🤖 AI Features
- **Automated Homework Grading**: 
  - Uses Google Gemini 2.5 Flash model
  - Structured JSON output with per-question breakdown
  - Supports multiple image submissions per homework

### 🎨 User Experience
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile
- **Optimistic UI Updates**: Instant feedback with React Query optimistic updates
- **Alert System**: Toast notifications for user feedback
- **Loading & Error States**: Graceful handling of loading and error scenarios
- **Dashboard Analytics**: Statistics and summaries for quick insights

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure token-based authentication using JOSE
- **Password Hashing**: Bcrypt password encryption
- **Protected Routes**: Middleware-based route protection
- **Secure Cookies**: HTTP-only cookies for token storage
- **Server-Side Authentication**: Token verification on both client and server

### ☁️ Cloud Integration
- **Cloudinary Integration**: Image upload and storage for homework submissions
- **Secure File Management**: Automatic file organization in Cloudinary folders
- **Image Deletion**: Cleanup of unused images from cloud storage

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **TanStack Query (React Query) v5** - Data fetching and caching
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Quill** - Rich text editor for homework

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MySQL2** - Relational database with connection pooling
- **JOSE** - JWT token handling (signing and verification)
- **Bcryptjs** - Password hashing

### AI & Cloud Services
- **Google Generative AI (Gemini)** - AI-powered homework grading
- **Cloudinary** - Image upload and storage for homework submissions

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Turbopack** - Fast bundler for development

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ and npm
- **MySQL** 8.0+
- **Git**

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/class-management.git
   cd class-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=class_management
   DB_PORT=3306

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Node Environment
   NODE_ENV=development

   # Cloudinary Configuration (for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Google Gemini AI (for automated grading)
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up the database**
   
   Create a MySQL database named `class_management` (or your preferred name) and run your database schema migrations. The application expects the following core tables:
   - `user` - User accounts (teachers/admins)
   - `hub` - Teaching hubs
   - `class` - Classes
   - `schedule` - Class schedules
   - `student` - Students
   - `class_student` - Student-class enrollments
   - `record_attendance` - Attendance records
   - `teacher_hub` - Teacher-hub relationships with permissions
   - `homework` - Homework library
   - `class_homework` - Homework assignments to classes
   - `student_homework` - Student homework submissions
   - `student_homework_question` - Per-question grades
   - `permission` - Permission definitions

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/sign_up` - User registration
- `POST /api/auth/logout` - User logout

### Hubs
- `GET /api/get_hubs` - Get user's hubs
- `POST /api/new_hub` - Create a new hub
- `POST /api/add_teacher_to_hub` - Add teacher to hub
- `POST /api/update_teacher_role` - Update teacher role in hub
- `POST /api/get_user_hub_permission_by_user_id` - Get user permissions in hub
- `POST /api/update_user_permission_in_hub` - Update user permissions

### Classes
- `GET /api/get_classes` - Get classes by hub ID
- `GET /api/get_class_by_id` - Get class details
- `GET /api/get_class_by_user_id` - Get classes by user ID
- `POST /api/new_class` - Create a new class

### Students
- `GET /api/get_student_list_by_class_id` - Get students in a class
- `GET /api/get_all_student_list_by_hub_id` - Get all students in a hub
- `POST /api/new_student_in_hub` - Add new student to hub
- `POST /api/add_student_into_class` - Enroll student in class
- `POST /api/remove_student_from_class` - Remove student from class

### Attendance
- `GET /api/get_attendance_records` - Get attendance records
- `GET /api/get_student_attendance_record` - Get student's attendance history
- `POST /api/new_attendance_record` - Create attendance record

### Teachers
- `GET /api/get_teacher_by_id` - Get teacher details
- `GET /api/get_teachers_workload` - Get teacher workload statistics
- `GET /api/get_teacher_list_by_hub_id` - Get teachers in a hub
- `POST /api/update_teacher` - Update teacher information
- `GET /api/search_users_by_email` - Search users by email

### Homework
- `GET /api/get_homework_list_by_hub_id` - Get homework list by hub
- `GET /api/get_homework_by_id` - Get homework details
- `POST /api/new_homework` - Create new homework
- `POST /api/update_homework` - Update homework
- `POST /api/delete_homework` - Delete homework
- `GET /api/get_homework_list_by_class_id` - Get homework assignments for a class
- `POST /api/assign_homework` - Assign homework to class
- `GET /api/get_class_homework_by_id` - Get class homework assignment details
- `GET /api/get_class_homework_by_homework_id` - Get all assignments of a homework
- `GET /api/get_date_has_homework` - Get dates with homework assignments
- `POST /api/update_class_homework_date` - Update assignment dates
- `POST /api/delete_class_homework` - Delete homework assignment

### Homework Submissions
- `GET /api/get_student_homework_by_id` - Get student homework submission
- `GET /api/get_student_by_assignment_id` - Get students with submissions for an assignment
- `POST /api/save_student_submission` - Save student submission
- `POST /api/save_grade_feedback_homework` - Save grade and feedback
- `POST /api/add_student_homework_question` - Save per-question grades
- `GET /api/get_student_homework_question_by_student_homework_id` - Get question breakdown

### AI & Utilities
- `POST /api/ai/grade` - AI-powered homework grading
- `POST /api/upload_to_cloudinary` - Upload images to Cloudinary
- `GET /api/get_permissions` - Get all available permissions

## 🚦 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🎯 Usage

### Getting Started

1. **Sign Up / Login**
   - Navigate to `/auth` to create an account or log in
   - You'll be redirected to the dashboard after authentication

2. **Create a Hub**
   - Click "Create New Hub" on the dashboard
   - Fill in hub details and add initial teachers
   - Your hub will appear in "My Teaching Hubs"

3. **Create Classes**
   - Navigate to a hub
   - Click "Create Class" to set up a new class
   - Configure schedule, teacher, subject, and tuition information

4. **Manage Students**
   - Add students to your hub
   - Enroll students in specific classes
   - View student lists and attendance history

5. **Track Attendance**
   - Navigate to attendance section
   - Choose grid or list view
   - Record attendance, scores, and homework status

6. **Create and Assign Homework**
   - Create new homework in a hub using the rich text editor
   - Go to Homework List to see all homeworks of a hub
   - Assign a homework to a class with assigned date and due date
   - Students can submit homework with image uploads

7. **Grade Homework with AI**
   - Set an answer key for the homework
   - Use the "Grade All" button to automatically grade all submissions
   - Review and adjust AI-generated grades if needed
   - Provide feedback per question
