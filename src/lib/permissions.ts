import pool from "@/lib/db";
import { getCurrentUser } from "./curentUser";
import { NextResponse } from "next/server";

/**
 * Permission codes used in the system
 */
export const PERMISSIONS = {
  // Class Management
  CREATE_CLASS: "CREATE_CLASS",
  EDIT_CLASS: "EDIT_CLASS",
  VIEW_CLASS: "VIEW_CLASS",
  DELETE_CLASS: "DELETE_CLASS",
  
  // Student Management
  CREATE_STUDENT: "CREATE_STUDENT",
  ADD_STUDENT_CLASS: "ADD_STUDENT_CLASS",
  REMOVE_STUDENT_CLASS: "REMOVE_STUDENT_CLASS",
  REMOVE_STUDENT: "REMOVE_STUDENT",
  VIEW_STUDENT: "VIEW_STUDENT",
  EDIT_STUDENT: "EDIT_STUDENT",
  
  // Attendance
  TAKE_ATTENDANCE: "TAKE_ATTENDANCE",
  VIEW_ATTENDANCE: "VIEW_ATTENDANCE",
  EDIT_ATTENDANCE: "EDIT_ATTENDANCE",
  
  // Homework
  CREATE_HOMEWORK: "CREATE_HOMEWORK",
  ASSIGN_HOMEWORK: "ASSIGN_HOMEWORK",
  EDIT_HOMEWORK: "EDIT_HOMEWORK",
  DELETE_HOMEWORK: "DELETE_HOMEWORK",
  VIEW_HOMEWORK: "VIEW_HOMEWORK",
  GRADE_HOMEWORK: "GRADE_HOMEWORK",
  
  // Teacher/Member Management
  EDIT_MEMBER: "EDIT_MEMBER",
  VIEW_TEACHER: "VIEW_TEACHER",
  ADD_TEACHER: "ADD_TEACHER",
  
  // Hub Management
  VIEW_HUB: "VIEW_HUB",
  MANAGE_HUB: "MANAGE_HUB",
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Check if user is owner/master of a hub (has all permissions)
 */
async function isHubOwnerOrMaster(userId: string, hubId: string): Promise<boolean> {
  try {
    const [result]: any[] = await pool.query(`
      SELECT 1 FROM hub_role
      WHERE UserId = ? AND HubId = ? AND (Role = 'Master' OR IsOwner = 1)
      LIMIT 1
    `, [userId, hubId]);
    
    return result.length > 0;
  } catch (error) {
    console.error('Error checking hub owner/master:', error);
    return false;
  }
}

/**
 * Get user permissions for a specific hub
 */
export async function getUserHubPermissions(userId: string, hubId: string): Promise<string[]> {
  try {
    // Check if user is owner/master (has all permissions)
    if (await isHubOwnerOrMaster(userId, hubId)) {
      return ["Owner"]; // Special permission that grants all access
    }

    // Get specific permissions
    const [permissions]: any[] = await pool.query(`
      SELECT p.Code
      FROM hub_role hr
      JOIN hub_permissions hp ON hr.HubRoleId = hp.HubRoleId
      JOIN permissions p ON hp.PermissionId = p.PermissionId
      WHERE hr.UserId = ? AND hr.HubId = ?
    `, [userId, hubId]);

    return permissions.map((p: any) => p.Code);
  } catch (error) {
    console.error('Error getting user hub permissions:', error);
    return [];
  }
}

/**
 * Check if user has a specific permission in a hub
 */
export async function hasPermission(
  userId: string,
  hubId: string,
  requiredPermission: PermissionCode | PermissionCode[]
): Promise<boolean> {
  const permissions = await getUserHubPermissions(userId, hubId);
  
  // Owner has all permissions
  if (permissions.includes("Owner")) {
    return true;
  }

  // Check if user has required permission(s)
  const requiredPermissions = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission];

  return requiredPermissions.some(perm => permissions.includes(perm));
}

/**
 * Middleware function to check permissions in API routes
 * Returns user and hubId if permission check passes, or NextResponse with error if it fails
 * 
 * @param req - The request object
 * @param requiredPermission - Single permission or array of permissions (user needs at least one)
 * @param hubId - Optional hubId. If not provided, will try to extract from request
 * @param requestBody - Optional pre-parsed request body to avoid reading twice
 */
export async function checkPermission(
  req: Request,
  requiredPermission: PermissionCode | PermissionCode[],
  hubId?: string | null,
  requestBody?: any
): Promise<{ user: any; hubId: string } | NextResponse> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    // Extract hubId from request if not provided
    let finalHubId = hubId;
    if (!finalHubId) {
      // Try to get from pre-parsed body first
      if (requestBody) {
        finalHubId = requestBody.hubId || requestBody.hub_id;
      }
      
      // If still not found, try URL search params
      if (!finalHubId) {
        const searchParams = new URL(req.url).searchParams;
        finalHubId = searchParams.get("hubId") || searchParams.get("hub_id");
      }
    }

    if (!finalHubId) {
      return NextResponse.json(
        { message: "Bad Request: hubId is required" },
        { status: 400 }
      );
    }

    // Check permission
    const hasAccess = await hasPermission(user.userId, finalHubId, requiredPermission);
    
    if (!hasAccess) {
      return NextResponse.json(
        { 
          message: "Forbidden: You don't have permission to perform this action",
          requiredPermission: Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]
        },
        { status: 403 }
      );
    }

    return { user, hubId: finalHubId };
  } catch (error) {
    console.error('Error in permission check:', error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Helper to extract hubId from classId
 */
export async function getHubIdFromClassId(classId: string): Promise<string | null> {
  try {
    const [result]: any[] = await pool.query(`
      SELECT HubId FROM class WHERE ClassId = ?
    `, [classId]);
    
    return result.length > 0 ? result[0].HubId : null;
  } catch (error) {
    console.error('Error getting hubId from classId:', error);
    return null;
  }
}

/**
 * Helper to extract hubId from homeworkId
 */
export async function getHubIdFromHomeworkId(homeworkId: string): Promise<string | null> {
  try {
    const [result]: any[] = await pool.query(`
      SELECT HubId FROM homework WHERE HomeworkId = ?
    `, [homeworkId]);
    
    return result.length > 0 ? result[0].HubId : null;
  } catch (error) {
    console.error('Error getting hubId from homeworkId:', error);
    return null;
  }
}

/**
 * Helper to extract hubId from studentId
 */
export async function getHubIdFromStudentId(studentId: string): Promise<string | null> {
  try {
    const [result]: any[] = await pool.query(`
      SELECT HubId FROM student WHERE StudentId = ?
    `, [studentId]);
    
    return result.length > 0 ? result[0].HubId : null;
  } catch (error) {
    console.error('Error getting hubId from studentId:', error);
    return null;
  }
}

