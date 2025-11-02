# Class Management System

A comprehensive, full-stack class management application built with Next.js 15, TypeScript, and MySQL. This system enables educational institutions and teachers to efficiently manage teaching hubs, classes, students, attendance, and teacher workloads.

## 🚀 Features

### Hub Management
- **Create and Manage Teaching Hubs**: Organize your teaching activities into dedicated hubs
- **Role-Based Access Control**: Three-tier permission system (Owner, Master, Member)
- **Hub Statistics**: Track total classes, teachers, and students across all hubs
- **Multi-Hub Collaboration**: Join multiple hubs as either owner or guest member

### Class Management
- **Complete Class Lifecycle**: Create, view, update, and manage classes
- **Flexible Scheduling**: Multiple schedules per class with customizable days and times
- **Class Filtering**: Filter by status (Active/Finished), tuition type (Monthly/Quarter/Course/Flexible), and search
- **Dual View Modes**: Switch between table and card views for better visualization
- **Class Statistics**: Real-time student count and class status tracking

### Student Management
- **Student Enrollment**: Add students to classes with enrollment dates
- **Student Profiles**: Track student information including name, birthday, and status
- **Hub-Wide Student Registry**: Manage all students within a hub
- **Student Search and Filtering**: Quickly find students across classes

### Attendance Tracking
- **Grid View**: Calendar-style attendance tracking for easy date selection
- **List View**: Detailed list view with comprehensive student information
- **Attendance Status**: Track Present, Late, Excused, Absent, and Unchecked statuses
- **Homework Management**: Record homework assignments and completion status
- **Score Recording**: Assign scores to student work
- **Comments System**: Add detailed comments for each attendance record
- **Attendance History**: View complete attendance records for individual students

### Teacher Management
- **Teacher Workload Dashboard**: View assigned classes and student counts per teacher
- **Teacher Assignment**: Assign teachers and assistants to classes
- **Role Management**: Manage teacher roles within hubs (Owner, Master, Member)
- **Teacher Search**: Search and add teachers to hubs via email

### User Experience
- **Responsive Design**: Fully responsive UI that works on desktop, tablet, and mobile
- **Real-time Updates**: Optimistic UI updates with React Query
- **Alert System**: Toast notifications for user feedback
- **Loading & Error States**: Graceful handling of loading and error scenarios
- **Notification System**: In-app notifications for important updates
- **Dashboard Analytics**: Statistics and summaries for quick insights

### Security & Authentication
- **JWT-based Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Protected Routes**: Middleware-based route protection
- **Secure Cookies**: HTTP-only cookies for token storage

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **TanStack Query (React Query)** - Data fetching and caching
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MySQL2** - Relational database
- **JOSE** - JWT token handling
- **Bcryptjs** - Password hashing

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
   - `teacher_hub` - Teacher-hub relationships

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
class-management/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API route handlers
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── new_class/     # Class creation
│   │   │   ├── get_classes/   # Fetch classes
│   │   │   └── ...            # Other API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   │   └── hub/          # Hub management pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/            # React components
│   │   ├── Attendance*       # Attendance-related components
│   │   ├── Create*           # Modal components
│   │   ├── Layout*           # Layout components
│   │   └── ...               # Other reusable components
│   ├── context/              # React contexts
│   │   └── UserContext.tsx   # User context provider
│   ├── hooks/                # Custom React hooks
│   │   ├── useGetUserHubsQuery.ts
│   │   ├── useGetUserClassesQuery.ts
│   │   └── ...               # Other hooks
│   ├── lib/                  # Utility libraries
│   │   ├── api/              # API client functions
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── db.ts             # Database connection
│   │   └── axios.ts          # Axios configuration
│   ├── types/                # TypeScript type definitions
│   │   ├── Student.ts
│   │   ├── Teacher.ts
│   │   ├── ClassData.ts
│   │   └── Hub.ts
│   ├── utils/                # Utility functions
│   └── providers/            # React providers
│       └── ReactQueryProvider.tsx
├── public/                    # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

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

### Classes
- `GET /api/get_classes` - Get classes by hub ID
- `GET /api/get_class_by_id` - Get class details
- `POST /api/new_class` - Create a new class

### Students
- `GET /api/get_student_list_by_class_id` - Get students in a class
- `GET /api/get_all_student_list_by_hub_id` - Get all students in a hub
- `POST /api/new_student_in_hub` - Add new student to hub
- `POST /api/add_student_into_class` - Enroll student in class

### Attendance
- `GET /api/get_attendance_records` - Get attendance records
- `GET /api/get_student_attendance_record` - Get student's attendance history
- `POST /api/new_attendance_record` - Create attendance record

### Teachers
- `GET /api/get_teacher_by_id` - Get teacher details
- `GET /api/get_teachers_workload` - Get teacher workload statistics
- `POST /api/update_teacher` - Update teacher information

### Utilities
- `GET /api/search_users_by_email` - Search users by email
- `GET /api/get_date_has_homework` - Get dates with homework assignments

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

## 🔒 Security Considerations

- **Never commit `.env.local`** - Keep sensitive credentials out of version control
- **Use strong JWT secrets** - Generate a secure random string for production
- **Secure database credentials** - Use strong passwords and limit database user permissions
- **Enable HTTPS in production** - Always use SSL/TLS in production environments
- **Validate all inputs** - API routes should validate and sanitize user inputs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. When contributing:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ for efficient class management

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Note**: This is an active development project. Features and APIs may change in future versions.
