import formatDisplayDate from "@/utils/Format/formatDisplayDate";
import getDayNameFromDate from "@/utils/Format/getDateNameFromDate";
import generateDateRange from "@/utils/generateDateRange";
import HeaderAvatar from "../HeaderAvatar/HeaderAvatar";
import AttendanceCell from "../AttendanceCell/AttendanceCell";
import { useEffect, useMemo, useRef, useState } from "react";
import { ModalEditAttendance } from "../ModalEditAttendance/ModalEditAttendance";
import { useGetStudentAttendanceRecordsQuery } from "@/hooks/useGetStudentAttendanceRecordsQuery";
// import { newAttendanceRecordsApi } from "@/lib/api/newAttendanceRecord";
import { useAlert } from "../AlertProvider/AlertContext";
import { Schedule } from "@/types/Schedule";
import LoadingState from "../QueryState/LoadingState";
import ErrorState from "../QueryState/ErrorState";
import { useQueryClient } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import { useGetDateHasHomeworkQuery } from "@/hooks/useGetDateHasHomework";
import { BookPlus, ClipboardCheck } from "lucide-react";
import QuickAttendanceModal from "../QuickAttendanceModal/QuickAttendanceModal";
import QuickAssignHomeworkModal from "../QuickAssignHomeworkModal/QuickAssignHomeworkModal";
import { useGetClassHomeworkByClassId } from "@/hooks/useGetClassHomeworkByClassId";
import formatDateForCompare from "@/utils/Format/formatDateForCompare";
import { useHasPermission } from "@/hooks/useHasPermission";
import { newAttendanceRecordsList } from "@/lib/api/newAttendanceRecordsList";

interface AttendanceGridStudentTableProps {
    class_id: string,
    hub_id: string,
    schedule: Schedule[];
    startDate: string,
    endDate: string,
}

export default function AttendanceGridStudentTable({ hub_id, class_id, schedule, startDate, endDate }: AttendanceGridStudentTableProps) {

    const { hasPermission: canAssignHomework } = useHasPermission(hub_id, "ASSIGN_HOMEWORK");
    const { hasPermission: canTakeAttendance } = useHasPermission(hub_id, "TAKE_ATTENDANCE");
    const { hasPermission: canEditAttendance } = useHasPermission(hub_id, "EDIT_ATTENDANCE");

    const { data: fetchedStudentAttendanceRecords, isLoading, isError, error } = useGetStudentAttendanceRecordsQuery(class_id, schedule);
    const { data: assignmentList, isLoading: isAssignmentListLoading, isError: isAssignmentListError, error: assignmentListError } = useGetClassHomeworkByClassId(class_id);

    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');

    const processedStudentDatas = useMemo(() => {
        if (!fetchedStudentAttendanceRecords) return [];

        let filteredStudents = fetchedStudentAttendanceRecords;

        if (filter !== '') {
            filteredStudents = filteredStudents.filter(student => {
                if (!filter) return true;

                return student.name.toLowerCase().includes(filter.toLowerCase());
            })
        }

        return filteredStudents.map(student => {
            const recordsMap = new Map<string, AttendanceRecord>();

            for (const record of student.records) {
                recordsMap.set(record.date, record);
            }

            return { id: student.id, name: student.name, birthday: student.birthday, status: student.status, total_present: student.total_present, recordsMap };
        });
    }, [fetchedStudentAttendanceRecords, filter]);

    // console.log(processedStudentDatas);

    const [isSaving, setIsSaving] = useState(false);
    const { showAlert } = useAlert();
    const dateRange = useMemo(() => generateDateRange(startDate, endDate, schedule), [startDate, endDate]);

    const [editingRecord, setEditingRecord] = useState<StudentAttendance | null>(null);

    const handleEditClick = (record: AttendanceRecord, studentId: string, studentName: string) => {
        if (!canTakeAttendance) {
            showAlert("You don't have permission to take attendance", "error");
            return;
        }

        setEditingRecord({
            id: studentId,
            name: studentName,
            date: record.date,
            present: record.present,
            comment: record.comment,
            assignments: record.assignments,
            is_homework: record.is_homework,
            score: record.score
        });
    };

    const handleCloseModal = () => {
        setEditingRecord(null);
    };

    const [openQuickAction, setOpenQuickAction] = useState<boolean>(false);
    const [selectedDate, setSelectDate] = useState<string | null>(null);
    const [openAssignHomework, setOpenAssignHomework] = useState<boolean>(false);
    const [openTakeAttendance, setOpenTakeAttendance] = useState<boolean>(false);

    const handleQuickAssignHomework = () => {
        if (!canAssignHomework) {
            showAlert("You don't have permission to assign homework", "error");
            return;
        }

        setOpenAssignHomework(true);
    }

    const handleQuickTakeAttendance = () => {
        if (!canTakeAttendance) {
            showAlert("You don't have permission to assign homework", "error");
            return;
        }

        setOpenTakeAttendance(true);
    }

    const handleSaveAttendance = async (updatedRecord: StudentAttendance) => {
        if (!canTakeAttendance) {
            showAlert("You don't have permission to take attendance", "error");
            return;
        }

        if (!editingRecord) return;
        const targetStudentId = editingRecord.id;
        setIsSaving(true);

        try {
            const res = await newAttendanceRecordsList([updatedRecord], class_id);

            if (res?.status === 200) {
                queryClient.invalidateQueries({ queryKey: ["studentAttendanceRecords", class_id] });
                showAlert("Attendance saved successfully!", "success");
                console.log(`Record saved for ${editingRecord.name} on ${updatedRecord.date}:`, updatedRecord);
                handleCloseModal();
            } else {
                showAlert("Failed to save attendance. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error saving attendance:", error);
            showAlert("An unexpected error occurred while saving.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const menuQuickActionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuQuickActionRef.current && !menuQuickActionRef.current.contains(event.target as Node)) {
                setOpenQuickAction(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isLoading) return <LoadingState fullScreen message="Loading your students attendance records..." />;
    if (isError) return (
        <ErrorState
            fullScreen
            title="Error Loading Attendance Records"
            message={error?.message || "Something went wrong while loading your attendance records. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

    if (fetchedStudentAttendanceRecords === undefined || fetchedStudentAttendanceRecords === null) {
        return;
    }

    return (
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setFilter(searchTerm);
                    }
                }}
                search_width_style="medium"
            />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
            `}</style>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto w-full mt-6 max-h-[400px] custom-scrollbar">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-indigo-700 text-white shadow-lg">
                            {/* Fixed Columns */}
                            <th className="py-3 px-2 w-[50px] text-center text-xs font-medium uppercase border-r border-indigo-600 sticky left-0 z-20 bg-indigo-700 shadow-[2px_0_2px_-2px_rgba(0,0,0,0.4)]">
                                STT
                            </th>
                            <th className="py-3 px-2 w-[125px] text-left text-xs font-medium uppercase border-r border-indigo-600 sticky left-[50px] z-20 bg-indigo-700 shadow-[2px_0_2px_-2px_rgba(0,0,0,0.4)]">
                                <p className="text-xs font-normal opacity-80 mt-0.5">Name Of Student</p>
                            </th>
                            <th className="py-3 px-2 w-[100px] text-center text-xs font-medium uppercase border-r border-indigo-600 sticky left-[175px] z-20 bg-indigo-700 shadow-[2px_0_2px_-2px_rgba(0,0,0,0.4)]">
                                Studied Days
                                <span title="Total Studied Days" className="text-xs font-normal opacity-80 mt-0.5 ml-1 bg-indigo-500 rounded-full w-4 h-4 inline-flex items-center justify-center">?</span>
                            </th>

                            {/* Dynamic Date Columns */}
                            {dateRange.map(dateString => (
                                <th key={dateString} className="py-3 px-2 text-center text-xs font-medium uppercase border-l border-indigo-600 min-w-[60px] relative">
                                    {formatDisplayDate(dateString)}
                                    <p className="text-xs font-normal opacity-80 mt-0.5">{getDayNameFromDate(dateString)}</p>
                                    <button
                                        onClick={() => { setOpenQuickAction(!openQuickAction); setSelectDate(dateString); }}
                                        className="mt-1 p-1.5 rounded-full text-indigo-200 hover:bg-indigo-500 hover:text-white transition-all duration-200 cursor-pointer"
                                        title={`Open Quick Actions`}
                                    >
                                        <BookPlus size={16} />
                                    </button>

                                    {openQuickAction && selectedDate === dateString && (
                                        <div
                                            ref={menuQuickActionRef}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                        >
                                            {/* Header of Menu */}
                                            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="p-1">
                                                <button
                                                    onClick={() => {
                                                        handleQuickAssignHomework();
                                                        setOpenQuickAction(false);
                                                    }}
                                                    className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors group/item"
                                                >
                                                    <div className="p-1.5 rounded bg-gray-100 text-gray-500 group-hover/item:bg-indigo-100 group-hover/item:text-indigo-600 transition-colors">
                                                        <BookPlus size={14} />
                                                    </div>
                                                    Assign Homework
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        handleQuickTakeAttendance();
                                                        setOpenQuickAction(false);
                                                    }}
                                                    className="cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors group/item mt-1"
                                                >
                                                    <div className="p-1.5 rounded bg-gray-100 text-gray-500 group-hover/item:bg-emerald-100 group-hover/item:text-emerald-600 transition-colors">
                                                        <ClipboardCheck size={14} />
                                                    </div>
                                                    Quick Attendance
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {processedStudentDatas.map((student, studentIndex) => {
                            return (
                                <tr key={student.id} className="hover:bg-gray-50 transition duration-150 relative">
                                    <td className="py-4 px-2 text-center text-sm font-bold text-blue-600 border-r border-gray-200 sticky left-0 bg-white min-w-[50px]">
                                        {studentIndex + 1}
                                    </td>

                                    <td className="py-4 px-2 text-sm text-gray-900 border-r border-gray-200 sticky left-[50px] bg-white min-w-[125px] shadow-[2px_0_2px_-2px_rgba(0,0,0,0.1)]">
                                        <div className="flex items-start space-x-3">
                                            <HeaderAvatar name={student.name.charAt(0)} size="smaller" />
                                            <div className="flex flex-col">
                                                {student.name.split(' ').map((part, i) => (
                                                    <p key={i} className={`font-semibold leading-tight ${i === 0 ? 'text-base' : 'text-sm'}`}>
                                                        {part}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-2 text-center text-sm font-semibold text-indigo-600 border-r border-gray-200 sticky left-[175px] bg-white min-w-[100px] shadow-[2px_0_2px_-2px_rgba(0,0,0,0.1)]">
                                        {student.total_present}
                                    </td>

                                    {/* Attendance Cells for each date - SCROLLABLE */}
                                    {dateRange.map(dateString => {

                                        const record = student.recordsMap.get(formatDateForCompare(dateString)) || {
                                            present: 'Pending',
                                            score: null,
                                            assignments: [],
                                            comment: 'Not Checked Yet',
                                            date: dateString,
                                            is_homework: undefined
                                        };

                                        return (
                                            <AttendanceCell
                                                key={dateString}
                                                record={record as any}
                                                onEdit={(rec) => handleEditClick(rec, student.id, student.name)}
                                            />
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Attendance Edit Modal */}
            {editingRecord && (
                <ModalEditAttendance
                    studentAttendance={editingRecord}
                    isOpen={!!editingRecord}
                    onClose={handleCloseModal}
                    onSave={handleSaveAttendance}
                    isSaving={isSaving}
                    classHomeworkList={assignmentList || []}
                />
            )}

            {/* Quick Assign Homework */}
            {openAssignHomework && selectedDate && (
                <QuickAssignHomeworkModal
                    isOpen={openAssignHomework}
                    onClose={() => setOpenAssignHomework(false)}
                    hubId={hub_id}
                    classId={class_id}
                    assignedDate={selectedDate}
                />
            )}

            {/* Quick Take Attendance */}
            {openTakeAttendance && selectedDate && (
                <QuickAttendanceModal
                    classId={class_id}
                    processedStudentDatas={processedStudentDatas}
                    selectedDate={selectedDate}
                    isOpen={openTakeAttendance}
                    onClose={() => setOpenTakeAttendance(false)}
                />
            )}
        </div>
    )
}