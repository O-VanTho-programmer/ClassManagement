import pool from "@/lib/db";
import type { PoolConnection } from "mysql2/promise";

export interface CreateNotificationInput {
  hubId: number;
  classId?: number | null;
  senderUserId?: number | null;
  title: string;
  snippet: string;
  content: string;
  category: 'homework' | 'class' | 'system';
  type: string;
  deepLink?: string | null;
  recipientUserIds?: number[];
}

/**
 * Dispatches a notification to the system database.
 * If recipientUserIds is omitted and classId is provided, the function automatically
 * resolves the Class's Teacher and Assistant as the target recipients.
 */
export async function dispatchNotification(input: CreateNotificationInput) {
  let connection: PoolConnection | undefined;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let finalRecipients = input.recipientUserIds || [];

    // Automatically resolve recipients if classId is provided and no explicit list is supplied
    if (finalRecipients.length === 0 && input.classId) {
      const [classStaff]: any[] = await connection.query(
        "SELECT TeacherUserId, AssistantUserId FROM class WHERE ClassId = ?",
        [input.classId]
      );

      if (classStaff && classStaff.length > 0) {
        const { TeacherUserId, AssistantUserId } = classStaff[0];
        const staffIds = [TeacherUserId, AssistantUserId].filter(id => id !== null && id !== undefined);
        finalRecipients = Array.from(new Set(staffIds));
      }
    }

    // If no recipients, there's no one to notify, but we still write the notification log
    const [notifResult] = await connection.query(
      `INSERT INTO notification (HubId, ClassId, SenderUserId, Title, Snippet, Content, Category, Type, DeepLink)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.hubId,
        input.classId || null,
        input.senderUserId || null,
        input.title,
        input.snippet,
        input.content,
        input.category,
        input.type,
        input.deepLink || null
      ]
    );

    const notificationId = (notifResult as any).insertId;

    if (finalRecipients.length > 0) {
      const recipientValues = finalRecipients.map(userId => [notificationId, userId]);
      await connection.query(
        `INSERT INTO notification_recipient (NotificationId, RecipientUserId) VALUES ?`,
        [recipientValues]
      );
    }

    await connection.commit();
    return { success: true, notificationId };

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error in dispatchNotification:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
