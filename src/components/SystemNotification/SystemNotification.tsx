import { useState } from "react";
import SquareButton from "../SquareButton/SquareButton";
import { Info } from "lucide-react";
import NotificationList from "../NotificationList/NotificationList";
import { notificationsData } from "@/data_sample/notificationSample";

export default function SystemNotification() {
    const [dropMenu, setDropMenu] = useState(false);

    return (
        <div className="relative">
            <SquareButton onClick={() => setDropMenu(true)} color="gray" icon={Info} />
            <NotificationList isOpen={dropMenu} onClose={() => setDropMenu(false)} title="Notification from system" notificationsData={notificationsData} />
        </div>
    )
}