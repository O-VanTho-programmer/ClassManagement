import { BookOpen, Loader2 } from "lucide-react";
import HomeworkCard from "../HomeworkCard/HomeworkCard";

 

interface ViewClassHomeworkListProps {
    assignments:  ClassHomeworkWithClassName[];
    isLoading: boolean;
    isError: boolean;
    handleViewDetails: (assignment: ClassHomework) => void;
    handleEdit: (assignment: ClassHomework) => void;
    handleViewSubmissions: (assignment: ClassHomework) => void;
}

export default function ViewClassHomeworkList ({ assignments, isLoading, isError, handleViewDetails, handleEdit, handleViewSubmissions }: ViewClassHomeworkListProps) {
    if (isLoading) {
        return (
            <div className="p-10 flex justify-center items-center">
                <Loader2 size={32} className="animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading homework...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-10 text-center text-red-600 bg-red-50 rounded-lg">
                Error loading homework. Please try again.
            </div>
        );
    }

    if (!assignments || assignments.length === 0) {
        return (
            <div className="p-10 text-center text-gray-500">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold">No Homework Assigned</h3>
                <p>This class does not have any homework assignments yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {assignments.map((assignment: ClassHomeworkWithClassName) => (
                <HomeworkCard
                    key={assignment.homework_id}
                    assignment={assignment}
                    onViewDetails={handleViewDetails}
                    onEdit={handleEdit}
                    onViewSubmissions={handleViewSubmissions}
                />
            ))}
        </div>
    );
};