# Class Management System

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
- **List View**: Detailed list view with comprehensive student information
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
  - Provides constructive feedback for each question
  - Calculates overall grade (0-100 scale)

### 🎨 User Experience
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile
- **Optimistic UI Updates**: Instant feedback with React Query optimistic updates
- **Alert System**: Toast notifications for user feedback
- **Loading & Error States**: Graceful handling of loading and error scenarios
- **Notification System**: In-app notifications for important updates
- **Dashboard Analytics**: Statistics and summaries for quick insights
- **Empty States**: Helpful empty state components for better UX

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

## 🏗️ Architecture Patterns & Design Decisions

### **Architectures Currently Used**

#### 1. **Monolithic Next.js Application (Full-Stack)**
- **Pattern**: Single codebase containing both frontend and backend
- **Implementation**: Next.js App Router with API Routes
- **Benefits**: 
  - Simplified deployment
  - Shared TypeScript types between frontend and backend
  - Fast development iteration
  - Server-side rendering capabilities

#### 2. **Server-Side Rendering (SSR) with Client Components**
- **Pattern**: Hybrid rendering approach
- **Implementation**: 
  - Server components for initial page load (`layout.tsx`, `page.tsx`)
  - Client components for interactivity (`'use client'` directive)
- **Benefits**: 
  - Better SEO
  - Faster initial page load
  - Reduced client-side JavaScript

#### 3. **API Route Pattern (RESTful)**
- **Pattern**: RESTful API endpoints using Next.js API Routes
- **Implementation**: 
  - `/api/*` route handlers
  - Standard HTTP methods (GET, POST)
  - JSON request/response format
- **Benefits**: 
  - Clear separation of concerns
  - Easy to test and document
  - Standard HTTP semantics

#### 4. **Custom Hooks Pattern (Data Fetching)**
- **Pattern**: React Query hooks for data fetching
- **Implementation**: 
  - Custom hooks in `src/hooks/` directory
  - Each hook wraps `useQuery` or `useMutation`
  - Centralized API functions in `src/lib/api/`
- **Benefits**: 
  - Reusable data fetching logic
  - Automatic caching and refetching
  - Consistent error handling

#### 5. **Context API Pattern (State Management)**
- **Pattern**: React Context for global state
- **Implementation**: 
  - `UserContext` for current user data
  - `AlertProvider` for toast notifications
- **Benefits**: 
  - Avoids prop drilling
  - Simple global state management
  - Works well with React Query for server state

#### 6. **Provider Pattern**
- **Pattern**: Component composition with providers
- **Implementation**: 
  - `ReactQueryProvider` for React Query
  - `UserProvider` for user context
  - `AlertProvider` for notifications
- **Benefits**: 
  - Clean component tree
  - Easy to add new providers
  - Testable in isolation

#### 7. **Repository Pattern (Data Access Layer)**
- **Pattern**: Separation of data access logic
- **Implementation**: 
  - API functions in `src/lib/api/`
  - Database queries in API routes
  - Centralized axios instance
- **Benefits**: 
  - Easy to mock for testing
  - Centralized error handling
  - Reusable data access logic

#### 8. **Middleware Pattern (Route Protection)**
- **Pattern**: Request interception for authentication
- **Implementation**: 
  - Next.js middleware in `src/middleware.ts`
  - JWT token verification
  - Route-based protection
- **Benefits**: 
  - Centralized authentication logic
  - Automatic route protection
  - Performance (runs on edge)

#### 9. **Connection Pooling Pattern**
- **Pattern**: Database connection reuse
- **Implementation**: 
  - MySQL2 connection pool in `src/lib/db.ts`
  - Configurable connection limits
- **Benefits**: 
  - Efficient database resource usage
  - Better performance under load
  - Prevents connection exhaustion

#### 10. **Component Composition Pattern**
- **Pattern**: Building complex UIs from simple components
- **Implementation**: 
  - Small, focused components in `src/components/`
  - Props-based composition
  - Reusable UI components (Button, Card, Modal, etc.)
- **Benefits**: 
  - Reusability
  - Maintainability
  - Testability

### **Architectures That Can Be Applied**

#### 1. **Service Layer Pattern**
- **Current State**: Business logic mixed in API routes
- **Recommendation**: Extract business logic into service classes
- **Benefits**: 
  - Better testability
  - Reusable business logic
  - Clear separation of concerns
- **Example Structure**:
  ```
  src/services/
    - ClassService.ts
    - StudentService.ts
    - AttendanceService.ts
    - HomeworkService.ts
  ```

#### 2. **Data Transfer Object (DTO) Pattern**
- **Current State**: Direct database models used in API responses
- **Recommendation**: Create DTOs for API responses
- **Benefits**: 
  - API versioning support
  - Hide internal data structure
  - Better type safety
- **Example**: `ClassDTO`, `StudentDTO`, `AttendanceDTO`

#### 3. **Repository Pattern Enhancement**
- **Current State**: Raw SQL queries in API routes
- **Recommendation**: Abstract database access into repositories
- **Benefits**: 
  - Easier to switch databases
  - Better testability
  - Centralized query logic
- **Example Structure**:
  ```
  src/repositories/
    - ClassRepository.ts
    - StudentRepository.ts
    - AttendanceRepository.ts
  ```

#### 4. **Command Query Responsibility Segregation (CQRS)**
- **Current State**: Same models for reads and writes
- **Recommendation**: Separate read and write models
- **Benefits**: 
  - Optimize reads independently
  - Better scalability
  - Clearer intent
- **Use Case**: Complex queries for attendance reports vs. simple writes

#### 5. **Event-Driven Architecture**
- **Current State**: Synchronous operations
- **Recommendation**: Add event bus for decoupled operations
- **Benefits**: 
  - Loose coupling
  - Better scalability
  - Audit trail
- **Use Cases**: 
  - Student enrollment events
  - Attendance record creation
  - Homework submission notifications

#### 6. **Factory Pattern**
- **Current State**: Direct object creation
- **Recommendation**: Use factories for complex object creation
- **Benefits**: 
  - Centralized creation logic
  - Easier testing
  - Consistent object creation
- **Use Cases**: 
  - Creating attendance records
  - Building complex queries
  - Generating reports

#### 7. **Strategy Pattern**
- **Current State**: Conditional logic for different behaviors
- **Recommendation**: Extract strategies for varying algorithms
- **Benefits**: 
  - Easy to add new strategies
  - Better testability
  - Clear intent
- **Use Cases**: 
  - Different grading strategies (AI vs. Manual)
  - Different permission checking strategies
  - Different export formats (PDF, Excel, CSV)

#### 8. **Observer Pattern**
- **Current State**: Direct function calls for notifications
- **Recommendation**: Implement observer pattern for notifications
- **Benefits**: 
  - Decoupled notification system
  - Easy to add new observers
  - Better extensibility
- **Use Cases**: 
  - Notification system
  - Real-time updates
  - Audit logging

#### 9. **Facade Pattern**
- **Current State**: Complex API interactions
- **Recommendation**: Create facades for complex operations
- **Benefits**: 
  - Simplified API
  - Hide complexity
  - Better maintainability
- **Use Cases**: 
  - Complex homework assignment flow
  - Multi-step class creation
  - Batch operations

#### 10. **Dependency Injection**
- **Current State**: Direct imports and instantiation
- **Recommendation**: Use DI container for dependencies
- **Benefits**: 
  - Better testability
  - Loose coupling
  - Easier to swap implementations
- **Use Cases**: 
  - Database connections
  - External services (Cloudinary, Gemini AI)
  - Logging services

#### 11. **Microservices Architecture (Future Consideration)**
- **Current State**: Monolithic application
- **Recommendation**: Consider microservices if scaling
- **Benefits**: 
  - Independent scaling
  - Technology diversity
  - Team autonomy
- **Potential Services**: 
  - Authentication Service
  - Class Management Service
  - Attendance Service
  - Homework Service
  - AI Grading Service
  - Notification Service

#### 12. **API Gateway Pattern**
- **Current State**: Direct API routes
- **Recommendation**: Add API gateway for routing and aggregation
- **Benefits**: 
  - Single entry point
  - Request aggregation
  - Rate limiting
  - Authentication centralization

#### 13. **Caching Strategy (Redis)**
- **Current State**: React Query client-side caching only
- **Recommendation**: Add server-side Redis caching
- **Benefits**: 
  - Reduced database load
  - Faster response times
  - Better scalability
- **Use Cases**: 
  - Frequently accessed data (classes, students)
  - Permission checks
  - Statistics and reports

#### 14. **Database Sharding (Future)**
- **Current State**: Single database
- **Recommendation**: Consider sharding for large scale
- **Benefits**: 
  - Horizontal scaling
  - Better performance
  - Isolation
- **Sharding Strategy**: By hub or by region

## ⚠️ Limitations

### 1. **Security Limitations**
- **Hardcoded Database Password Fallback**: The database configuration has a fallback password in code (should be removed)
- **No Input Validation**: API routes lack comprehensive input validation (recommend using Zod or Yup)
- **No Rate Limiting**: Authentication and API endpoints are not rate-limited
- **No Refresh Tokens**: JWT tokens expire after 1 day with no refresh mechanism
- **SQL Injection Risk**: Using raw SQL queries without parameterized queries in all cases (though most use prepared statements)
- **No XSS Protection**: User inputs are not sanitized for XSS attacks
- **Limited Authorization Checks**: Not all API routes verify user permissions

### 2. **Database Limitations**
- **No Migration System**: Database schema changes are not version-controlled
- **Missing Indexes**: Frequently queried columns lack database indexes
- **No Database Transactions**: Multi-step operations don't use transactions
- **No Soft Deletes**: Hard deletes may cause data loss
- **Limited Constraints**: Missing foreign key constraints and unique constraints
- **No Backup Strategy**: No automated backup system

### 3. **Performance Limitations**
- **No Pagination**: Large data sets are loaded entirely (students, classes, attendance records)
- **No Virtual Scrolling**: Long lists render all items at once
- **Limited Caching**: Only client-side caching with React Query, no server-side caching
- **No Code Splitting**: All code is bundled together
- **No Lazy Loading**: Heavy components load immediately
- **N+1 Query Problem**: Potential for inefficient database queries

### 4. **Testing Limitations**
- **No Unit Tests**: No test coverage for components or utilities
- **No Integration Tests**: API routes are not tested
- **No E2E Tests**: No end-to-end testing setup
- **No Test Database**: No separate test environment

### 5. **Feature Limitations**
- **No Password Reset**: Users cannot reset forgotten passwords
- **No Email Notifications**: No email alerts for important events
- **No Export Functionality**: Cannot export data to CSV, Excel, or PDF
- **No Reporting System**: No advanced reporting or analytics
- **No Calendar View**: No full calendar view for classes and events
- **No Bulk Operations**: Cannot perform batch actions on multiple items
- **No Search Functionality**: Limited search capabilities across entities
- **No Real-time Updates**: No WebSocket or Server-Sent Events for real-time collaboration
- **No Mobile App**: Web-only, no native mobile application
- **No Offline Support**: Requires constant internet connection

### 6. **Code Quality Limitations**
- **Type Safety**: Some `any` types used instead of proper TypeScript types
- **No Prettier**: No code formatting tool
- **Limited ESLint Rules**: Could use stricter linting rules
- **No Pre-commit Hooks**: No automated quality checks before commits
- **Inconsistent Error Handling**: Error handling patterns vary across the codebase
- **Limited Documentation**: Missing JSDoc comments and API documentation

### 7. **Scalability Limitations**
- **Single Database**: No read replicas or database clustering
- **No Load Balancing**: Application not designed for horizontal scaling
- **No CDN**: Static assets not served from CDN
- **Connection Pool Limits**: Fixed connection pool size may not scale
- **Synchronous Operations**: No async job processing for heavy operations

### 8. **User Experience Limitations**
- **No Loading Skeletons**: Uses spinners instead of skeleton screens
- **Limited Keyboard Navigation**: Not fully keyboard accessible
- **No Accessibility Features**: Missing ARIA labels and screen reader support
- **No Dark Mode**: Only light theme available
- **No Internationalization**: English only, no multi-language support
- **No Timezone Handling**: Date/time handling may not account for timezones

### 9. **AI Grading Limitations**
- **API Dependency**: Requires Google Gemini API key and internet connection
- **Cost Considerations**: AI API calls may incur costs at scale
- **Accuracy**: AI grading may not be 100% accurate for all question types
- **Image Quality Dependency**: Grading quality depends on submission image quality
- **No Offline Grading**: Cannot grade without API access

### 10. **Deployment Limitations**
- **No CI/CD Pipeline**: No automated testing and deployment
- **No Docker**: Application not containerized
- **No Environment-Specific Configs**: Limited environment configuration
- **No Monitoring**: No application performance monitoring or error tracking
- **No Logging System**: Limited structured logging

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

## 🔒 Security Considerations

- **Never commit `.env.local`** - Keep sensitive credentials out of version control
- **Use strong JWT secrets** - Generate a secure random string for production
- **Secure database credentials** - Use strong passwords and limit database user permissions
- **Enable HTTPS in production** - Always use SSL/TLS in production environments
- **Validate all inputs** - API routes should validate and sanitize user inputs (currently limited)
- **Remove hardcoded passwords** - Remove any fallback database passwords from code
- **Implement rate limiting** - Add rate limiting to prevent abuse
- **Use refresh tokens** - Implement refresh token mechanism for better security
- **Sanitize user inputs** - Prevent XSS attacks by sanitizing all user inputs

## 📝 Development Roadmap

See `DEVELOPMENT_SUGGESTIONS.md` for detailed recommendations on:
- Security enhancements
- Database optimizations
- Frontend improvements
- Testing strategies
- Feature additions
- Performance optimizations

## 🤝 Contributing

This is an active development project. Features and APIs may change in future versions.

## 📄 License

[Add your license here]

---

**Note**: This project is actively being developed. Some features may be incomplete or subject to change. Please refer to the limitations section for known issues and areas for improvement.
