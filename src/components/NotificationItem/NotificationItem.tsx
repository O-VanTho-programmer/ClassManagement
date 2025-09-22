import { CheckCircleIcon, InfoIcon } from "lucide-react";

const NotificationItem = ({
  type,
  badgeText,
  badgeColor,
  title,
  description,
  timestamp,
} : NotificationItemProps ) => {
  const typeMap = {
    inform: {
      icon: InfoIcon,
      iconColor: 'bg-blue-500',
    },
    success: {
      icon: CheckCircleIcon,
      iconColor: 'bg-green-500',
    },
  };

  const { icon: Icon, iconColor } = typeMap[type];

  return (
    <div className="flex items-start p-4 bg-white border-b border-gray-200">
      <div className={`p-2 rounded-full ${iconColor}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="ml-3 flex-grow">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-semibold text-gray-800">{title}</h4>
          {badgeText && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor}`}>
              {badgeText}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-1">{description}</p>
        <span className="text-xs text-gray-400">{timestamp}</span>
      </div>
    </div>
  );
};

export default NotificationItem;