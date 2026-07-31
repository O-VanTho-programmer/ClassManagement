export type NotificationType = 'inform' | 'success';

export interface NotificationItemProps {
  type: NotificationType;
  badgeText: string | null;
  badgeColor: string | null;
  title: string;
  description: string;
  timestamp: string;
}

export interface NotificationSchema {
  id: number;
  sender: string;
  email: string;
  role: string;
  subject: string;
  snippet: string;
  content: string;
  category: 'homework' | 'class' | 'system';
  type: string;
  deepLink: string | null;
  date: string;
  read: boolean;
  starred: boolean;
  deleted: boolean;
}