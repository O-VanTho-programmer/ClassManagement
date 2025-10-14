import { Hub } from "@/types/Hub";

interface HubCardProps {
    hub: Hub;
    isOwner: boolean;
    onClick: (hub: Hub) => void;
}

export default function HubCard({ hub, isOwner, onClick }: HubCardProps) {
    
    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md hover:border-gray-300 cursor-pointer group"
            onClick={() => onClick(hub)}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {hub.name}
                </h3>
                {isOwner && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                        Owner
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 line-clamp-2">
                {hub.description}
            </p>

            {/* Stats */}
            <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{hub.numberOfClasses}</div>
                    <div className="text-sm text-gray-500">Classes</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{hub.numberOfTeachers}</div>
                    <div className="text-sm text-gray-500">Teachers</div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">By {hub.owner}</span>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
