import { deleteHomework } from "@/lib/api/deleteHomeworkAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useAlert } from "../AlertProvider/AlertContext";
import Button from "../Button/Button";
import SquareButton from "../SquareButton/SquareButton";

interface DeleteHomeworkModalProps {
    isOpen: boolean;
    onClose: () => void;
    curHomework: Homework | null;
    hubId: string;
}

export default function DeleteHomeworkModal({
    isOpen,
    onClose,
    curHomework,
    hubId
}: DeleteHomeworkModalProps) {

    const { showAlert } = useAlert();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (homeworkId: string) => deleteHomework(homeworkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homeworkList', hubId] });
            showAlert('Homework deleted successfully.', 'success');
            onClose();
        },
        onError: (error: Error) => {
            showAlert(`Error: ${error.message}`, 'error');
        }
    });

    const handleDelete = () => {
        if (!curHomework) return;
        mutation.mutate(curHomework.id);
    };

    if (!isOpen || !curHomework) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overlay transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 transform transition-all duration-300 scale-100 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Delete Homework</h2>
                    <SquareButton onClick={onClose} color="gray" icon={X} />
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="ml-4 text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Are you sure?
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    You are about to permanently delete the homework:
                                    <br />
                                    <strong className="text-gray-800 break-words">"{curHomework.title}"</strong>
                                </p>
                                <p className="mt-2 text-sm font-bold text-red-700">
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <Button title="Cancel" onClick={onClose} color="white" icon={X} />
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={mutation.isPending}
                        className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-red-300 disabled:cursor-not-allowed flex items-center"
                    >
                        {mutation.isPending ? (
                            <Loader2 size={18} className="animate-spin mr-2" />
                        ) : (
                            <Trash2 size={16} className="mr-2" />
                        )}
                        {mutation.isPending ? 'Deleting...' : 'Delete Homework'}
                    </button>
                </div>
            </div>
        </div>
    );
}
