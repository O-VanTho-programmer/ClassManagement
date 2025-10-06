'use client';
import { useAlert } from '@/components/AlertProvider/AlertContext';
import ClassesInfoCard from '@/components/ClassesInfoCard/ClassesInfoCard';
import CreateClassModal from '@/components/CreateClassModal/CreateClassModal';
import api from '@/lib/axios';
import React, { useState, useMemo } from 'react';

interface ClassData {
    id: number;
    name: string;
    schedule: { day: string; time: string; }[];
    studentCount: number;
    teacher: string;
    assistant?: string;
    subject: string;
    tuition?: string;
    tuitionType: "Monthly" | "Quarter" | "Course" | "Flexible";
    base?: string;
    status: 'active' | 'finished';
    startDate: string;
    endDate: string;
}

// Mock data
const mockClassData: ClassData[] = [
    {
        id: 1,
        name: "Advanced Mathematics",
        schedule: [
            { day: "Monday", time: "14:00 - 16:00" },
            { day: "Wednesday", time: "14:00 - 16:00" }
        ],
        studentCount: 15,
        teacher: "Dr. Smith",
        assistant: "Jane Doe",
        subject: "Mathematics",
        tuition: "$200/month",
        tuitionType: "Monthly",
        base: "Main Campus",
        status: 'active',
        startDate: "2024-01-15",
        endDate: "2024-06-15"
    },
    {
        id: 2,
        name: "Physics Fundamentals",
        schedule: [
            { day: "Tuesday", time: "10:00 - 12:00" },
            { day: "Thursday", time: "10:00 - 12:00" }
        ],
        studentCount: 12,
        teacher: "Prof. Johnson",
        subject: "Physics",
        tuition: "$450",
        tuitionType: "Course",
        status: 'active',
        startDate: "2024-02-01",
        endDate: "2024-05-30"
    },
    {
        id: 3,
        name: "Chemistry Workshop",
        schedule: [
            { day: "Friday", time: "09:00 - 11:00" }
        ],
        studentCount: 8,
        teacher: "Dr. Wilson",
        assistant: "Mike Brown",
        subject: "Chemistry",
        tuition: "$150/quarter",
        tuitionType: "Quarter",
        base: "Science Building",
        status: 'finished',
        startDate: "2024-01-10",
        endDate: "2024-03-20"
    },
];

export default function HubPage() {

    const { showAlert } = useAlert();

    const [filter, setFilter] = useState<'all' | 'active' | 'finished'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [classes, setClasses] = useState<ClassData[]>(mockClassData);

    const filteredClasses = useMemo(() => {
        return classes.filter(classItem => {
            const matchesFilter = filter === 'all' || classItem.status === filter;
            const matchesSearch =
                classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, searchTerm, classes]);

    const handleClassClick = (classData: ClassData) => {
        console.log('Class clicked:', classData);
        // Add your navigation or modal logic here
    };

    const handleCreateClass = async (newClassData: Omit<ClassData, 'id'>) => {
        try {
            const res = await api.post('new_class', newClassData);

            const newClass: ClassData = {
                ...newClassData,
                id: res.data.id,
            };

            setClasses(prev => [newClass, ...prev]);
            setIsCreateModalOpen(false);

            if (res.status === 200) {
                showAlert(res.data.message, 'success');
            }else{
                showAlert(res.data.message, 'error');
            }
        } catch (error) {
            console.error("Failed to create class:", error);
        }
    };

    const stats = {
        total: classes.length,
        active: classes.filter(c => c.status === 'active').length,
        students: classes.reduce((sum, c) => sum + c.studentCount, 0)
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Class Hub</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Manage and view all your classes in one centralized location
                    </p>
                </div>

                {/* Statistics and Create Button */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 justify-center">
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
                            <div className="text-gray-600 font-medium">Total Classes</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">{stats.active}</div>
                            <div className="text-gray-600 font-medium">Active Classes</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">{stats.students}</div>
                            <div className="text-gray-600 font-medium">Total Students</div>
                        </div>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Class
                    </button>
                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-8">
                    {/* Search */}
                    <div className="w-full lg:max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search classes, subjects, teachers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        {(['all', 'active', 'finished'] as const).map((filterType) => (
                            <button
                                key={filterType}
                                onClick={() => setFilter(filterType)}
                                className={`
                  cursor-pointer px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${filter === filterType
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    }
                `}
                            >
                                {filterType === 'all' && 'All Classes'}
                                {filterType === 'active' && 'Active'}
                                {filterType === 'finished' && 'Finished'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Classes Grid */}
                {filteredClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredClasses.map((classItem) => (
                            <ClassesInfoCard
                                key={classItem.id}
                                classData={classItem}
                                onClick={handleClassClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                        >
                            Create Your First Class
                        </button>
                    </div>
                )}
            </div>

            {/* Create Class Modal */}
            <CreateClassModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateClass}
            />
        </div>
    );
}