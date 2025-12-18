import { useEffect, useRef } from "react";
import NotificationItem from "../NotificationItem/NotificationItem";
import { BellOff, ListChecks } from "lucide-react";
import Button from "../Button/Button";

interface NotificationListProps {
    title: string,
    notificationsData?: NotificationItemProps[]
    isOpen: boolean,
    onClose: () => void
}

const NotificationList = ({ title = "Thông báo", notificationsData, isOpen, onClose }: NotificationListProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref && !ref.current?.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null;
    }

    const ReadAll = () => {

    }

    return (
        <div ref={ref} className="absolute min-w-3xs md:min-w-sm rounded-lg shadow-lg overflow-hidden bg-white right-0">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800">{title}</h3>
                <button className="cursor-pointer text-blue-500 hover:text-blue-700 text-sm">
                    Read All
                </button>
            </div>

            {notificationsData ? (
                <div className="overflow-y-auto max-h-[400px]">
                    {notificationsData.map((notification, index) => (
                        <NotificationItem
                            key={index}
                            type={notification.type}
                            badgeText={notification.badgeText}
                            badgeColor={notification.badgeColor}
                            title={notification.title}
                            description={notification.description}
                            timestamp={notification.timestamp}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-between text-gray-500 py-4">
                    <BellOff size={18}/>
                    <p className="text-base font-medium mt-1">No notification</p>
                </div>
            )}

            <div className="p-4 border-t border-gray-200 text-center">
                <Button onClick={ReadAll} color="blue" icon={ListChecks} title="Xem tất cả"/>
            </div>
        </div>
    );
};

export default NotificationList;