import React, { useState } from 'react';
import {
    BookOpen,
    ChevronDown,
    Save,
    Download,
    Search,
    MoreHorizontal,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Filter,
    FileSpreadsheet
} from 'lucide-react';
import { useGetClassSimpleByHubId } from '@/hooks/useGetClassSimpleByHubId';
import { useParams } from 'next/navigation';

export default function GradeBookStudents() {

    const { hub_id } = useParams();
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

    const { data: classes = [] } = useGetClassSimpleByHubId(hub_id as string);
    const { data: students =[], isLoading, isError, error } = useGetStudentGradeBookByClassId(selectedClassId || '');

    const [gradeColumns] = useState([
        { id: 'g1', label: 'Quiz 1', date: 'Oct 10', maxScore: 10, weight: '10%' },
        { id: 'g2', label: 'Midterm', date: 'Oct 25', maxScore: 100, weight: '30%' },
        { id: 'g3', label: 'Project', date: 'Nov 05', maxScore: 20, weight: '20%' },
        { id: 'g4', label: 'Finals', date: 'Pending', maxScore: 100, weight: '40%' },
    ]);

    

    const renderAttendanceSummary = (attendance: { rate: number, present: number, absent: number, late: number }) => {
        let color = 'bg-emerald-500';
        let textColor = 'text-emerald-700';

        if (attendance.rate < 80) {
            color = 'bg-rose-500';
            textColor = 'text-rose-700';
        } else if (attendance.rate < 90) {
            color = 'bg-amber-500';
            textColor = 'text-amber-700';
        }

        return (
            <div className="w-full max-w-[140px]">
                <div className="flex justify-between items-end mb-1">
                    <span className={`text-xs font-bold ${textColor}`}>{attendance.rate}%</span>
                    <span className="text-[10px] text-slate-400">
                        {attendance.absent > 0 ? `${attendance.absent} Absent` : 'Perfect'}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${color}`} style={{ width: `${attendance.rate}%` }}></div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 font-sans text-slate-900">

            <div className="bg-white border-b border-slate-200 px-8 py-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            Academic Performance
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="appearance-none bg-transparent text-2xl font-bold text-slate-800 pr-8 border-none focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors p-0"
                                >
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 pointer-events-none group-hover:text-indigo-600" />
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                {currentClass.semester}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-all shadow-sm">
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                            Export Report
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm shadow-indigo-200">
                            <Save className="w-4 h-4" />
                            Save Grades
                        </button>
                    </div>
                </div>

                <div className="flex gap-8 mt-6 border-t border-slate-100 pt-4">
                    <div>
                        <p className="text-slate-400 text-xs font-medium">Enrolled Students</p>
                        <p className="text-lg font-bold text-slate-700">{currentClass.students}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-medium">Class GPA</p>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-indigo-600">8.2</p>
                            <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 rounded flex items-center">+0.4 <TrendingUp className="w-3 h-3 ml-0.5" /></span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-medium">Low Attendance Risk</p>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-rose-600">3</p>
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 flex-1 overflow-hidden flex flex-col">

                <div className="flex justify-between items-center mb-4 shrink-0">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search student name or ID..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Filter: All Status</span>
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                    <div className="overflow-auto flex-1">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm">
                                <tr>
                                    <th className="sticky left-0 bg-slate-50 z-30 w-[280px] text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-r border-slate-200">
                                        Student Information
                                    </th>

                                    <th className="w-[200px] text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                        Attendance Rate
                                    </th>

                                    {gradeColumns.map((col) => (
                                        <th key={col.id} className="min-w-[150px] text-center px-4 py-4 border-b border-l border-slate-200">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{col.label}</span>
                                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                    {col.date} • {col.weight}
                                                </span>
                                            </div>
                                        </th>
                                    ))}

                                    <th className="w-[120px] text-center px-6 py-4 text-xs font-bold text-indigo-600 uppercase tracking-wider border-b border-l border-slate-200 bg-indigo-50/30">
                                        Current GPA
                                    </th>
                                    <th className="w-[60px] border-b border-slate-200"></th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">

                                        <td className="sticky left-0 bg-white group-hover:bg-slate-50 px-6 py-4 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200">
                                                    {student.avatar}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-slate-900">{student.name}</div>
                                                    <div className="text-xs text-slate-500">{student.id}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            {renderAttendanceSummary(student.attendance)}
                                        </td>

                                        {gradeColumns.map((col) => (
                                            <td key={col.id} className="px-4 py-4 text-center border-l border-slate-100">
                                                {col.id === 'g4' && student.grades[col.id as keyof typeof student.grades] === null ? (
                                                    <span className="text-xs text-slate-400 italic">--</span>
                                                ) : (
                                                    <div className="relative inline-block w-20 group/input">
                                                        <input
                                                            type="number"
                                                            defaultValue={student.grades[col.id as keyof typeof student.grades] || 0}
                                                            placeholder="-"
                                                            className={`w-full text-center py-1.5 rounded border border-transparent group-hover/input:border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono text-sm bg-transparent
                                  ${(student.grades[col.id as keyof typeof student.grades] || 0) < 5 ? 'text-rose-600 font-bold bg-rose-50/30' : 'text-slate-700 font-medium'}
                              `}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                        ))}

                                        <td className="px-6 py-4 text-center border-l border-slate-100 bg-indigo-50/10">
                                            <div className={`inline-flex flex-col items-center justify-center w-10 h-10 rounded-lg ${student.average < 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                <span className="text-sm font-bold">{student.average}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            <button className="text-slate-300 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};