import { useEffect, useState } from "react";
import { X, Percent } from "lucide-react";
import IconButton from "../IconButton/IconButton";
import Button from "../Button/Button";
import { useGetClassGradeWeights } from "@/hooks/useGetClassGradeWeights";
import { useSaveClassGradeWeightsMutation } from "@/hooks/useSaveClassGradeWeightsMutation";
import { useAlert } from "../AlertProvider/AlertContext";

interface SetGradeWeightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  hubId: string;
}

export default function SetGradeWeightsModal({
  isOpen,
  onClose,
  classId,
  hubId,
}: SetGradeWeightsModalProps) {
  if (!isOpen) {
    return null;
  }

  const { showAlert } = useAlert();
  const [attendanceWeight, setAttendanceWeight] = useState<number>(20);
  const [homeworkWeight, setHomeworkWeight] = useState<number>(80);

  const { data: existingWeights, isLoading } = useGetClassGradeWeights(classId, hubId);
  const { mutate: saveWeights, isPending } = useSaveClassGradeWeightsMutation(hubId);

  useEffect(() => {
    if (existingWeights && existingWeights.length > 0) {
      const att = existingWeights.find((w) => w.category === "Attendance")?.weight ?? 20;
      const hw = existingWeights.find((w) => w.category === "Homework")?.weight ?? 80;
      setAttendanceWeight(Number(att));
      setHomeworkWeight(Number(hw));
    } else {
      setAttendanceWeight(20);
      setHomeworkWeight(80);
    }
  }, [existingWeights, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (attendanceWeight + homeworkWeight !== 100) {
      showAlert("Total weight sum must equal 100%. Please check your inputs.", "error");
      return;
    }

    saveWeights(
      {
        hubId,
        classId,
        weights: [
          { category: "Attendance", weight: attendanceWeight },
          { category: "Homework", weight: homeworkWeight },
        ],
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 overlay bg-opacity-50" onClick={onClose}></div>

      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full z-10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Set Grade Weights</h2>
          </div>
          <IconButton onClick={onClose} icon={X} size={20} />
        </div>

        {isLoading ? (
          <div className="p-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Body */}
            <div className="p-6 space-y-6">
              <p className="text-sm text-slate-500">
                Configure the final grade percentage allocation for Attendance and Homework metrics. The total sum must equal 100%.
              </p>

              {/* Attendance Weight */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Attendance Weight (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={attendanceWeight}
                    onChange={(e) => setAttendanceWeight(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 pr-10 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">%</span>
                </div>
              </div>

              {/* Homework Weight */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Homework Weight (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={homeworkWeight}
                    onChange={(e) => setHomeworkWeight(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg p-2.5 pr-10 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-gray-900"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">%</span>
                </div>
              </div>

              {/* Total Check Indicator */}
              <div className={`p-3 rounded-lg border text-sm flex justify-between items-center font-medium ${
                attendanceWeight + homeworkWeight === 100 
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                  : "bg-rose-50 border-rose-100 text-rose-700"
              }`}>
                <span>Total Allocation:</span>
                <span>{attendanceWeight + homeworkWeight}% / 100%</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
              <Button title="Cancel" onClick={onClose} color="white" />
              <button
                type="submit"
                disabled={isPending || attendanceWeight + homeworkWeight !== 100}
                className="cursor-pointer px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all font-semibold shadow-sm text-sm"
              >
                {isPending ? "Saving..." : "Save Weights"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
