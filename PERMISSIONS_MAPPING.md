# Permissions Mapping

This document maps all API routes and dashboard pages to their required permissions.

## Permission Codes

### Class Management
- `CREATE_CLASS` - Create new classes
- `EDIT_CLASS` - Edit existing classes
- `VIEW_CLASS` - View classes
- `DELETE_CLASS` - Delete classes

### Student Management
- `CREATE_STUDENT` - Create new students in hub
- `ADD_STUDENT_CLASS` - Add students to classes
- `REMOVE_STUDENT_CLASS` - Remove students from classes
- `REMOVE_STUDENT` - Remove students from hub
- `VIEW_STUDENT` - View student information
- `EDIT_STUDENT` - Edit student information

### Attendance
- `TAKE_ATTENDANCE` - Record attendance
- `VIEW_ATTENDANCE` - View attendance records
- `EDIT_ATTENDANCE` - Edit attendance records

### Homework
- `CREATE_HOMEWORK` - Create homework assignments
- `ASSIGN_HOMEWORK` - Assign homework to classes
- `EDIT_HOMEWORK` - Edit homework assignments
- `DELETE_HOMEWORK` - Delete homework assignments
- `VIEW_HOMEWORK` - View homework assignments
- `GRADE_HOMEWORK` - Grade student homework submissions

### Teacher/Member Management
- `EDIT_MEMBER` - Edit teacher permissions and roles
- `VIEW_TEACHER` - View teacher information
- `ADD_TEACHER` - Add teachers to hub

### Hub Management
- `VIEW_HUB` - Basic access to hub (required for all hub pages)
- `MANAGE_HUB` - Full hub management (future use)

## API Routes Permission Mapping

### Class Management Routes
| Route | Method | Required Permission |
|-------|--------|---------------------|
| `/api/new_class` | POST | `CREATE_CLASS` |
| `/api/get_classes` | GET | `VIEW_CLASS` |
| `/api/get_class_by_id` | GET | `VIEW_CLASS` |
| `/api/get_class_by_user_id` | GET | User can only view their own classes |

### Student Management Routes
| Route | Method | Required Permission |
|-------|--------|---------------------|
| `/api/new_student_in_hub` | POST | `CREATE_STUDENT` |
| `/api/get_all_student_list_by_hub_id` | GET | `VIEW_STUDENT` |
| `/api/get_student_list_by_class_id` | GET | `VIEW_STUDENT` |
| `/api/add_student_into_class` | POST | `ADD_STUDENT_CLASS` |
| `/api/remove_student_from_class` | DELETE | `REMOVE_STUDENT_CLASS` |

### Attendance Routes
| Route | Method | Required Permission |
|-------|--------|---------------------|
| `/api/new_attendance_record` | POST | `TAKE_ATTENDANCE` |
| `/api/get_attendance_records` | GET | `VIEW_ATTENDANCE` |
| `/api/get_student_attendance_record` | GET | `VIEW_ATTENDANCE` |

### Homework Routes
| Route | Method | Required Permission |
|-------|--------|---------------------|
| `/api/new_homework` | POST | `CREATE_HOMEWORK` |
| `/api/get_homework_by_id` | GET | `VIEW_HOMEWORK` |
| `/api/get_homework_list_by_hub_id` | GET | `VIEW_HOMEWORK` |
| `/api/get_homework_list_by_class_id` | GET | `VIEW_HOMEWORK` |
| `/api/update_homework` | PUT | `EDIT_HOMEWORK` |
| `/api/delete_homework` | DELETE | `DELETE_HOMEWORK` |
| `/api/assign_homework` | POST | `ASSIGN_HOMEWORK` |
| `/api/update_class_homework_date` | PUT | `ASSIGN_HOMEWORK` |
| `/api/delete_class_homework` | DELETE | `ASSIGN_HOMEWORK` |
| `/api/get_class_homework_by_id` | GET | `VIEW_HOMEWORK` |
| `/api/get_class_homework_by_homework_id` | GET | `VIEW_HOMEWORK` |
| `/api/get_student_homework_by_id` | GET | `VIEW_HOMEWORK` |
| `/api/get_student_by_assignment_id` | GET | `VIEW_HOMEWORK` |
| `/api/get_student_homework_question_by_student_homework_id` | GET | `VIEW_HOMEWORK` |
| `/api/save_answer_key_homework` | POST | `EDIT_HOMEWORK` |
| `/api/save_student_submission` | POST | `VIEW_HOMEWORK` (students can submit) |
| `/api/save_grade_feedback_homework` | POST | `GRADE_HOMEWORK` |
| `/api/add_student_homework_question` | POST | `GRADE_HOMEWORK` |
| `/api/get_date_has_homework` | GET | `VIEW_HOMEWORK` |
| `/api/ai/grade` | POST | `GRADE_HOMEWORK` |

### Teacher Management Routes
| Route | Method | Required Permission |
|-------|--------|---------------------|
| `/api/get_teacher_list_by_hub_id` | GET | `VIEW_TEACHER` |
| `/api/get_teachers_workload` | GET | `VIEW_TEACHER` |
| `/api/add_teacher_to_hub` | POST | `EDIT_MEMBER` |
| `/api/update_teacher` | PUT | `EDIT_MEMBER` |
| `/api/update_teacher_role` | PUT | `EDIT_MEMBER` |
| `/api/update_user_permission_in_hub` | PUT | `EDIT_MEMBER` |

### Hub Management Routes
| Route | Method | Required Permission |
|-------|--------|---------------------|
| `/api/new_hub` | POST | Authenticated user (any user can create hub) |
| `/api/get_hubs` | GET | User can only view their own hubs |

### Other Routes
| Route | Method | Required Permission |
|-------|--------|---------------------|
| `/api/search_users_by_email` | GET | Authenticated user |
| `/api/upload_to_cloudinary` | POST | Authenticated user |
| `/api/get_permissions` | GET | No permission check (public) |
| `/api/get_user_hub_permission_by_user_id` | POST | No permission check (used for permission checking) |

## Dashboard Pages Permission Mapping

All dashboard pages under `/dashboard/hub/[hub_id]` require `VIEW_HUB` permission at the layout level.

### Specific Page Permissions
| Page | Required Permission |
|------|---------------------|
| `/dashboard/hub/[hub_id]/classes` | `VIEW_CLASS` |
| `/dashboard/hub/[hub_id]/classes/[class_id]` | `VIEW_CLASS` |
| `/dashboard/hub/[hub_id]/attendance` | `VIEW_ATTENDANCE` or `TAKE_ATTENDANCE` |
| `/dashboard/hub/[hub_id]/homework_list` | `VIEW_HOMEWORK` |
| `/dashboard/hub/[hub_id]/homework_list/create` | `CREATE_HOMEWORK` |
| `/dashboard/hub/[hub_id]/teacher` | `VIEW_TEACHER` |
| `/dashboard/hub/[hub_id]/teacher/add_and_permisson` | `EDIT_MEMBER` |

## Special Permissions

### Owner/Master Role
Users with `Owner` or `Master` role in a hub automatically have all permissions for that hub. The permission check returns `["Owner"]` which grants access to all operations.

### Permission Checking Logic
1. Check if user is authenticated
2. Check if user is Owner/Master (grants all permissions)
3. Check if user has the specific required permission
4. Return 403 Forbidden if permission check fails

## Implementation Notes

- All API routes use the `checkPermission` utility function
- Dashboard pages use server-side permission checks in the layout
- Permission checks are performed before any business logic
- Hub ID is extracted from request body, query params, or route params
- For routes that work with classes/homework/students, hubId is derived from the related entity

