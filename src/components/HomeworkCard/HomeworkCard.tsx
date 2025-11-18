import getStatusByHomeworkDueDate from "@/utils/getStatusByHomeworkDueDate";
import { Calendar, Clock, Edit, FileText, Send, View } from "lucide-react";
import Button from "../Button/Button";

interface HomeworkCardProps {
    assignment: ClassHomework;
    onViewDetails: (assignment: ClassHomework) => void;
    onEdit: (assignment: ClassHomework) => void;
    onViewSubmissions: (assignment: ClassHomework) => void;
}

export default function HomeworkCard({
    assignment,
    onViewDetails,
    onEdit,
    onViewSubmissions
}: HomeworkCardProps) {

    const status = getStatusByHomeworkDueDate(assignment.due_date);

    return (
        <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-xl" >
            <div className="p-6" >
                <div className="flex justify-between items-start mb-3" >
                    < h3 className="text-xl font-bold text-gray-900 pr-4" >
                        {assignment.title}
                    </h3>
                    <span
                        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${status.color}`}
                    >
                        {status.text}
                    </span>
                </div>

                <div
                    className="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: assignment.content }
                    }
                />

                <div className="grid grid-cols-2 gap-4 mt-6" >
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200" >
                        <h4 className="flex items-center text-xs font-semibold text-gray-500 uppercase mb-1" >
                            <Calendar size={14} className="mr-1.5" />
                            Assigned
                        </h4>
                        < p className="text-sm font-medium text-gray-900" >
                            {assignment.assigned_date}
                        </p>
                    </div>
                    < div className="bg-gray-50 p-3 rounded-lg border border-gray-200" >
                        <h4 className="flex items-center text-xs font-semibold text-gray-500 uppercase mb-1" >
                            <Clock size={14} className="mr-1.5" />
                            Due
                        </h4>
                        < p className="text-sm font-medium text-gray-900" >
                            {assignment.due_date}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-3 space-y-2 sm:space-y-0" >
                <Button color="orange" icon={Send} title="Submissions" onClick={() => onViewSubmissions(assignment)}/>
                <div className="flex items-center space-x-3 sm:space-x-1">
                    <Button color="blue" icon={FileText} title="View" onClick={() => onViewDetails(assignment)} />
                    <Button color="blue_off" icon={View} title="Edit" onClick={() => onEdit(assignment)} />
                </div>
            </div>
        </div>
    );
}