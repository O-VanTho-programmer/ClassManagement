'use client'

import React, { useMemo, useState } from 'react';
import {
    BookOpen,
    ChevronDown,
    Save,
    Search,
    MoreHorizontal,
    AlertTriangle,
    TrendingUp,
    Filter,
    FileSpreadsheet,
    Inbox
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useGetClassSimpleByHubId } from '@/hooks/useGetClassSimpleByHubId';
import { useGetStudentGradeBookByClassId } from '@/hooks/useGetStudentGradeBookByClassId';
import HeaderAvatar from '@/components/HeaderAvatar/HeaderAvatar';
import SearchBar from '@/components/SearchBar/SearchBar';
import Button from '@/components/Button/Button';
import { exportToExcel } from '@/utils/exportToExcel';

export default function GradeBookStudents() {
    const { hub_id } = useParams();
    const [selectedClassId, setSelectedClassId] = useState("none");
    const [searchTerm, setSearchTerm] = useState("");

    const { data: classes = [] } = useGetClassSimpleByHubId(hub_id as string);
    const { data: gradeBookResponse, isLoading } = useGetStudentGradeBookByClassId(selectedClassId, hub_id as string);

    const columnsType = gradeBookResponse?.columns || {};
    const studentsData = gradeBookResponse?.data || [];

    const currentClass = useMemo(() => {
        return classes.find(c => c.id === selectedClassId)
    }, [classes, selectedClassId]);

    const classStats = useMemo(() => {
        if (!studentsData.length) return { gpa: "0.0", studentsCount: 0, lowPerformers: 0 };

        let totalGpa = 0;
        let lowPerformers = 0;

        studentsData.forEach(s => {
            totalGpa += s.final_grade;
            if (s.final_grade < 50) lowPerformers++;
        });

        return {
            gpa: (totalGpa / studentsData.length).toFixed(1),
            studentsCount: studentsData.length,
            lowPerformers
        };
    }, [studentsData]);

    const filteredStudents = useMemo(() => {
        if (!searchTerm) return studentsData;
        return studentsData.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.id.toString().includes(searchTerm)
        );
    }, [studentsData, searchTerm]);

    const hasData = Object.keys(columnsType).length > 0;

    const handleExportExcel = () => {
        if (!hasData || filteredStudents.length === 0) {
            alert("No data available to export.");
            return;
        }
        
        const excelData = filteredStudents.map(student => {
            const row: any = {
                "Student ID": student.id,
                "Full Name": student.name,
            };

            Object.entries(columnsType).forEach(([type, assignments]) => {
                assignments.forEach((assignment: any) => {
                    const gradeRecord = student.assignments[assignment.class_homework_id];
                    row[`${type}: ${assignment.title}`] = gradeRecord?.grade ?? '-';
                });

                row[`${type} Average`] = student.averages[type] ?? '-';
            });

            row["Final Grade"] = student.final_grade ?? '-';

            return row;
        });

        const className = currentClass?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Class';
        const dateStr = new Date().toISOString().split('T')[0];
        const fileName = `Gradebook_${className}_${dateStr}`;

        exportToExcel(excelData, fileName, 'Grades');
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 font-sans text-slate-900">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 shrink-0">
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
                                    className="appearance-none bg-transparent text-2xl border-b border-gray-300 font-bold text-slate-800 pr-8 ring-0 outline-0 cursor-pointer transition-colors hover:border-indigo-600 focus:border-indigo-600"
                                >
                                    <option value="none">Select a Class...</option>
                                    {classes.map(c => (
                                        <option className='cursor-pointer' key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 pointer-events-none group-hover:text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <Button
                        icon={FileSpreadsheet}
                        color='white'
                        title='Export Report'
                        style='color-emerald-600'
                        onClick={handleExportExcel}
                    />
                </div>

                {/* Stats Row */}
                <div className="flex gap-8 mt-6 border-t border-slate-100 pt-4">
                    <div>
                        <p className="text-slate-400 text-xs font-medium">Enrolled Students</p>
                        <p className="text-lg font-bold text-slate-700">{classStats.studentsCount}</p>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-medium">Class GPA</p>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-indigo-600">{classStats.gpa}</p>
                            {Number(classStats.gpa) >= 5 && (
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 rounded flex items-center">
                                    Good <TrendingUp className="w-3 h-3 ml-0.5" />
                                </span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-medium">Risk of Failing</p>
                        <div className="flex items-center gap-2">
                            <p className={`text-lg font-bold ${classStats.lowPerformers > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                                {classStats.lowPerformers}
                            </p>
                            {classStats.lowPerformers > 0 && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="p-6 md:p-8 flex-1 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4 shrink-0">
                    <SearchBar
                        search_width_style='medium'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />

                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                            <ChevronDown className="w-3 h-3 opacity-50" />
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                    {selectedClassId === "none" ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-5">
                            <BookOpen className="w-12 h-12 mb-4 text-slate-200" />
                            <p className="text-lg font-medium text-slate-600">No Class Selected</p>
                            <p className="text-sm">Please select a class from the dropdown above to view the gradebook.</p>
                        </div>
                    ) : isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : !hasData ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <Inbox className="w-12 h-12 mb-4 text-slate-200" />
                            <p className="text-lg font-medium text-slate-600">No Assignments Found</p>
                            <p className="text-sm">This class doesn't have any assignments or students yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-auto flex-1">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm">
                                    {/* Categories (Quiz, Homework, etc.) */}
                                    <tr>
                                        <th rowSpan={2} className="sticky left-0 bg-slate-50 z-30 min-w-[280px] text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-r border-slate-200 align-bottom">
                                            Student Information
                                        </th>

                                        {Object.entries(columnsType).map(([type, assignments]) => (
                                            <th
                                                key={type}
                                                colSpan={assignments.length + 1}
                                                className="text-center px-4 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-l border-slate-200 bg-slate-100/50"
                                            >
                                                {type}
                                            </th>
                                        ))}

                                        <th rowSpan={2} className="w-[120px] text-center px-6 py-4 text-xs font-bold text-indigo-700 uppercase tracking-wider border-b border-l border-slate-200 bg-indigo-50/50 align-bottom">
                                            Final Grade
                                        </th>
                                        <th rowSpan={2} className="w-[60px] border-b border-slate-200 bg-slate-50"></th>
                                    </tr>

                                    {/* Assignments */}
                                    <tr>
                                        {Object.entries(columnsType).map(([type, assignments]) => (
                                            <React.Fragment key={`${type}-sub`}>
                                                {assignments.map((assignment) => (
                                                    <th key={assignment.class_homework_id} className="min-w-[120px] text-center px-4 py-3 text-xs font-semibold text-slate-500 border-b border-l border-slate-200">
                                                        <div className="truncate max-w-[120px]" title={assignment.title}>
                                                            {assignment.title}
                                                        </div>
                                                    </th>
                                                ))}
                                                {/* Category Average Column */}
                                                <th className="min-w-[80px] text-center px-4 py-3 text-xs font-bold text-slate-600 border-b border-l border-slate-200 bg-slate-50">
                                                    Avg
                                                </th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">

                                            {/* Student Info */}
                                            <td className="sticky left-0 bg-white group-hover:bg-slate-50 px-6 py-4 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10">
                                                <div className="flex items-center gap-3">
                                                    <HeaderAvatar name={student.name} />
                                                    <div className="text-sm font-semibold text-slate-900 truncate max-w-[180px]" title={student.name}>
                                                        {student.name}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Assignment Grades */}
                                            {Object.entries(columnsType).map(([type, assignments]) => (
                                                <React.Fragment key={`${student.id}-${type}`}>

                                                    {/* Individual Grades */}
                                                    {assignments.map((assignment) => {
                                                        const gradeRecord = student.assignments[assignment.class_homework_id];
                                                        const gradeValue = gradeRecord?.grade;
                                                        const hasGrade = gradeValue !== undefined && gradeValue !== null;

                                                        return (
                                                            <td key={assignment.class_homework_id} className="px-4 py-4 text-center border-l border-slate-100">
                                                                <div className="relative inline-block w-16 group/input">
                                                                    <input
                                                                        type="number"
                                                                        defaultValue={hasGrade ? gradeValue : ''}
                                                                        placeholder="-"
                                                                        className={`w-full text-center py-1.5 rounded border border-transparent group-hover/input:border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-mono text-sm bg-transparent
                                                                            ${hasGrade && gradeValue < 50 ? 'text-rose-600 font-bold bg-rose-50/30' : 'text-slate-700 font-medium'}
                                                                        `}
                                                                        readOnly
                                                                    />
                                                                </div>
                                                            </td>
                                                        );
                                                    })}

                                                    {/* Category Average */}
                                                    <td className="px-4 py-4 text-center border-l border-slate-100 bg-slate-50/50">
                                                        <span className={`text-sm font-bold ${student.averages[type] < 50 ? 'text-rose-600' : 'text-slate-600'}`}>
                                                            {student.averages[type] || '-'}
                                                        </span>
                                                    </td>

                                                </React.Fragment>
                                            ))}

                                            {/* Final Total Grade */}
                                            <td className="px-6 py-4 text-center border-l border-slate-100 bg-indigo-50/10">
                                                <div className={`inline-flex flex-col items-center justify-center w-10 h-10 rounded-lg ${student.final_grade < 5 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                    <span className="text-sm font-bold">{student.final_grade || '-'}</span>
                                                </div>
                                            </td>

                                            {/* Actions
                                            <td className="px-4 py-4 text-right">
                                                <button className="text-slate-300 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-100 rounded-full">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}