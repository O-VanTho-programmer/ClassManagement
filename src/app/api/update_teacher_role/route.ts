import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import { HubRole } from "@/types/Hub";
import { updateUserPermissionInHub } from "@/lib/api/updateUserPermissionInHub";

const ROLE_TEMPLATE = {
    'Member': [
        ''
    ],
    'Teacher': [
        // --- Hub & General ---
        'VIEW_HUB',
        'VIEW_TEACHER',

        // --- Class Management ---
        'VIEW_CLASS',
        'CREATE_CLASS',
        'EDIT_CLASS',
        // 'DELETE_CLASS', 

        // --- Student Management ---
        'VIEW_STUDENT',
        'NEW_STUDENT',
        'EDIT_STUDENT',
        'ADD_STUDENT_CLASS',
        'REMOVE_STUDENT_CLASS',

        // --- Attendance ---
        'VIEW_ATTENDANCE',
        'TAKE_ATTENDANCE',
        'EDIT_ATTENDANCE',

        // --- Homework (Full Access) ---
        'VIEW_HOMEWORK',
        'CREATE_HOMEWORK',
        'EDIT_HOMEWORK',
        'DELETE_HOMEWORK',
        'ASSIGN_HOMEWORK',
        'GRADE_HOMEWORK'
    ],

    'Assistant': [
        // --- Hub & General ---
        'VIEW_HUB',
        'VIEW_TEACHER',

        // --- Class Management (Read Only) ---
        'VIEW_CLASS',

        // --- Student Management (Read Only) ---
        'VIEW_STUDENT',

        // --- Attendance ---
        'VIEW_ATTENDANCE',
        'TAKE_ATTENDANCE',

        // --- Homework (Grading Only) ---
        'VIEW_HOMEWORK',
        'GRADE_HOMEWORK'
    ],

    'Master': [
        ''
    ],

    'Owner': ['']
}

export async function PUT(req: Request) {
    try {
        const { teacherId, hubId, role } = await req.json();

        // Check permission - need EDIT_MEMBER to update teacher roles
        const permissionCheck = await checkPermission(req, PERMISSIONS.EDIT_MEMBER, hubId, { hubId });
        if (permissionCheck instanceof NextResponse) {
            return permissionCheck;
        }

        if (!teacherId || !hubId || !role) {
            return NextResponse.json({ message: "Missing required fields: teacherId, hubId, or role" }, { status: 400 });
        }

        const queryUpdateTeacherRole = `
            UPDATE hub_role
            SET Role = ?
            WHERE HubId = ? AND UserId = ?
        `;

        const [result] = await pool.query(queryUpdateTeacherRole, [role, hubId, teacherId]);
        const newRole: HubRole = role;
        const permissions = ROLE_TEMPLATE[newRole] || [];

        if (permissions && permissions.length > 0) {
            await updateUserPermissionInHub(permissions, teacherId, hubId);
        }

        return NextResponse.json({ message: "Teacher role updated successfully", result }, { status: 200 });
    } catch (error) {
        console.error("[UPDATE_TEACHER_ROLE_ERROR]", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: "Internal Server Error", error: errorMessage }, { status: 500 });
    }
}