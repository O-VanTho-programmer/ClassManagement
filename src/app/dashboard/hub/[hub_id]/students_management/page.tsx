'use client';

import Badge from '@/components/Badge/Badge';
import HeaderAvatar from '@/components/HeaderAvatar/HeaderAvatar';
import SearchBar from '@/components/SearchBar/SearchBar';
import Selection, { Option } from '@/components/Selection/Selection';
import { useGetClassSimpleByHubId } from '@/hooks/useGetClassSimpleByHubId';
import { useGetStudentsListWithClassByHubId } from '@/hooks/useGetStudentsListWithClassByHubId';
import { usePagination } from '@/hooks/usePagination';
import { ClassDataSimple } from '@/types/ClassData';
import { AlertCircle, CheckCircle2, Download, Filter, GraduationCap, Loader2, MoreVertical, Phone, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useMemo, useState } from 'react'

export default function StudentsManagement() {

    const { hub_id } = useParams();
    const [filterClass, setFilterClass] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    const {
        page, setPage, limit, offset, search, setSearch, debouncedSearch
    } = usePagination([filterStatus, filterClass]);

    const { data: students = [], isLoading, isError, error }
        = useGetStudentsListWithClassByHubId(hub_id as string, offset, limit, debouncedSearch, filterStatus, filterClass);
    const { data: classes = [] } = useGetClassSimpleByHubId(hub_id as string);

    const classOptions: Option[] = useMemo(() => {
        let options: Option[] = [{
            label: 'All',
            value: 'All'
        }];

        classes.forEach((cls: ClassDataSimple) => {
            options.push({
                label: cls.name,
                value: cls.id
            });
        });

        return options;

    }, [classes]);

    const getStatusStyle = (status: StudentStatus) => {
        switch (status) {
            case 'Studying': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Finished': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: StudentStatus) => {
        switch (status) {
            case 'Studying': return <CheckCircle2 className="w-3 h-3 mr-1" />;
            case 'Finished': return <AlertCircle className="w-3 h-3 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            {/* ERP Header Section */}
            <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="text-indigo-600" />
                        Student Directory
                    </h1>
                    <p className="text-slate-500 text-sm">Manage student profiles, enrollments, and academic status.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                        <UserPlus className="w-4 h-4" />
                        Add Student
                    </button>
                </div>
            </div>

            {/* Stats Overview Bar */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Students</p>
                    <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Enrollment</p>
                    <p className="text-2xl font-bold text-emerald-600">{students.filter(s => s.status === 'Studying').length}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Avg. Attendance</p>
                    <p className="text-2xl font-bold text-indigo-600">92.4%</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="max-w-7xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
                    <SearchBar
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        search_width_style="medium"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">Filter by class</span>
                        <Selection
                            value={filterClass}
                            placeholder="Filter by class"
                            options={classOptions}
                            onChange={(value) => setFilterClass(value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter className="text-slate-400 w-4 h-4 mr-1" />
                        <select
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 transition-all"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="Studying">Studying</option>
                            <option value="Finished">Finished</option>
                            <option value="All">All</option>
                        </select>
                    </div>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto min-h-[300px] relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        </div>
                    )}

                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase">
                                <th className="px-6 py-4 border-b border-slate-100">Student Info</th>
                                <th className="px-6 py-4 border-b border-slate-100">Classes</th>
                                <th className="px-6 py-4 border-b border-slate-100">Status</th>
                                <th className="px-6 py-4 border-b border-slate-100">Contact</th>
                                <th className="px-6 py-4 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.length > 0 ? students.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <HeaderAvatar name={student.name} key={student.id} />
                                            <div className="text-sm font-semibold text-slate-900">{student.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap min-w-[100px] items-center gap-3">
                                            {student.classes?.map((cls: any) => (
                                                <Badge key={cls.class_id} bg_clr="bg-blue-500" title={cls.class_name} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(student.status)}`}>
                                            {getStatusIcon(student.status)}
                                            {student.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-600">00000000</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            )) : !isLoading && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <div className="text-sm text-slate-500">
                        Page <span className="font-semibold text-slate-700">{page}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1 || isLoading}
                            className="px-4 py-1.5 text-sm font-medium border border-slate-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={students.length < limit || isLoading}
                            className="px-4 py-1.5 text-sm font-medium border border-slate-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}