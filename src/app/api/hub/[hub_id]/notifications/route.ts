import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { checkPermission, PERMISSIONS } from "@/lib/permissions";
import type { PoolConnection } from "mysql2/promise";

export async function GET(
  req: Request,
  { params }: { params: { hub_id: string } }
) {
  const { hub_id } = params;

  // Verify basic permissions for dashboard access
  const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HUB, hub_id);
  if (permissionCheck instanceof NextResponse) {
    return permissionCheck;
  }

  const { user } = permissionCheck;

  let connection: PoolConnection | undefined;
  try {
    connection = await pool.getConnection();

    const query = `
      SELECT 
        n.NotificationId AS id,
        IFNULL(u.Name, 'System') AS sender,
        IFNULL(u.Email, 'system@tutordesk.com') AS email,
        IF(n.SenderUserId IS NULL, 'System', 'Teacher') AS role,
        n.Title AS subject,
        n.Snippet AS snippet,
        n.Content AS content,
        n.Category AS category,
        n.Type AS type,
        n.DeepLink AS deepLink,
        n.CreatedDate AS date,
        CAST(nr.IsRead AS UNSIGNED) AS \`read\`,
        CAST(nr.IsStarred AS UNSIGNED) AS starred,
        CAST(nr.IsDeleted AS UNSIGNED) AS deleted
      FROM notification n
      INNER JOIN notification_recipient nr ON n.NotificationId = nr.NotificationId
      LEFT JOIN user u ON n.SenderUserId = u.UserId
      LEFT JOIN class c ON n.ClassId = c.ClassId
      WHERE nr.RecipientUserId = ? 
        AND n.HubId = ?
        AND (n.ClassId IS NULL OR (c.TeacherUserId = ? OR c.AssistantUserId = ?))
      ORDER BY n.CreatedDate DESC
    `;

    const queryParams: any[] = [user.userId, hub_id, user.userId, user.userId];

    const [rows] = await connection.query(query, queryParams);

    // Convert numeric flags to booleans for the UI
    const formattedRows = (rows as any[]).map(row => ({
      ...row,
      read: !!row.read,
      starred: !!row.starred,
      deleted: !!row.deleted
    }));

    return NextResponse.json(formattedRows, { status: 200 });

  } catch (error: any) {
    console.error("GET Notifications Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { hub_id: string } }
) {
  const { hub_id } = params;

  const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HUB, hub_id);
  if (permissionCheck instanceof NextResponse) {
    return permissionCheck;
  }

  const { user } = permissionCheck;

  let connection: PoolConnection | undefined;
  try {
    const { ids, action } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: "Notification IDs are required" }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    let query = "";
    const queryParams: any[] = [];

    switch (action) {
      case "read":
        query = `
          UPDATE notification_recipient 
          SET IsRead = 1, ReadDate = NOW() 
          WHERE RecipientUserId = ? AND NotificationId IN (?)
        `;
        break;
      case "unread":
        query = `
          UPDATE notification_recipient 
          SET IsRead = 0, ReadDate = NULL 
          WHERE RecipientUserId = ? AND NotificationId IN (?)
        `;
        break;
      case "star":
        query = `
          UPDATE notification_recipient 
          SET IsStarred = 1 
          WHERE RecipientUserId = ? AND NotificationId IN (?)
        `;
        break;
      case "unstar":
        query = `
          UPDATE notification_recipient 
          SET IsStarred = 0 
          WHERE RecipientUserId = ? AND NotificationId IN (?)
        `;
        break;
      case "trash":
        query = `
          UPDATE notification_recipient 
          SET IsDeleted = 1, DeletedDate = NOW() 
          WHERE RecipientUserId = ? AND NotificationId IN (?)
        `;
        break;
      case "restore":
        query = `
          UPDATE notification_recipient 
          SET IsDeleted = 0, DeletedDate = NULL 
          WHERE RecipientUserId = ? AND NotificationId IN (?)
        `;
        break;
      default:
        await connection.rollback();
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await connection.query(query, [user.userId, ids]);
    await connection.commit();

    return NextResponse.json({ message: "Success" }, { status: 200 });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error("PATCH Notifications Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { hub_id: string } }
) {
  const { hub_id } = params;

  const permissionCheck = await checkPermission(req, PERMISSIONS.VIEW_HUB, hub_id);
  if (permissionCheck instanceof NextResponse) {
    return permissionCheck;
  }

  const { user } = permissionCheck;

  let connection: PoolConnection | undefined;
  try {
    const { action } = await req.json();

    if (action !== "empty_trash") {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const query = `
      DELETE FROM notification_recipient 
      WHERE RecipientUserId = ? AND IsDeleted = 1
    `;

    await connection.query(query, [user.userId]);
    await connection.commit();

    return NextResponse.json({ message: "Success" }, { status: 200 });

  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error("DELETE Notifications Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
