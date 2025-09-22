type NotificationType = 'inform' | 'success';

interface NotificationItemProps {
  type: NotificationType;
  badgeText: string | null;
  badgeColor: string | null;
  title: string;
  description: string;
  timestamp: string;
}