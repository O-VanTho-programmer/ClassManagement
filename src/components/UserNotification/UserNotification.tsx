import { useState } from "react";
import SquareButton from "../SquareButton/SquareButton";
import NotificationList from "../NotificationList/NotificationList";
import { Bell } from "lucide-react";
import { useGetNotifications } from "@/hooks/useGetNotifications";
import { useParams } from "next/navigation";

export default function UserNotification() {
    const [dropMenu, setDropMenu] = useState(false);

    const { hub_id } = useParams<{ hub_id: string }>();
    const { data: notificationRaw } = useGetNotifications(hub_id);

    const notificationsData = notificationRaw?.map((data) => {
        let badgeColor = 'bg-gray-100 text-gray-800';
        if (data.category === 'homework') {
            badgeColor = 'bg-blue-50 text-blue-700 border border-blue-200';
        } else if (data.category === 'class') {
            badgeColor = 'bg-green-50 text-green-700 border border-green-200';
        } else if (data.category === 'system') {
            badgeColor = 'bg-purple-50 text-purple-700 border border-purple-200';
        }

        return {
            type: 'inform' as const,
            badgeText: data.category.toUpperCase(),
            badgeColor,
            title: data.subject,
            description: data.snippet,
            timestamp: new Date(data.date).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    }) || [];

    return (
        <div className="relative">
            <SquareButton onClick={() => setDropMenu(true)} color="gray" icon={Bell} />
            <NotificationList isOpen={dropMenu} onClose={() => setDropMenu(false)} title="Notification" notificationsData={notificationsData} />
        </div>
    )
}