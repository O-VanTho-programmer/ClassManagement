'use client';

import AddStudentIntoClassModal from "@/components/AddStudentIntoClassModal/AddStudentIntoClassModal";
import { useAlert } from "@/components/AlertProvider/AlertContext";
import CardDirection, { CardDirectionProps } from "@/components/CardDirection/CardDirection";
import ClassHeader from "@/components/ClassHeader/ClassHeader";
import NewStudentInHubModal from "@/components/NewStudentInHubModal/NewStudentInHubModal";
import OverlapAlert from "@/components/OverlapAlert/OverlapAlert";
import ErrorState from "@/components/QueryState/ErrorState";
import LoadingState from "@/components/QueryState/LoadingState";
import ViewStudentList from "@/components/ViewStudentList/ViewStudentList";
import { useGetAllStudentListByHubId } from "@/hooks/useGetAllStudentListByHubId";
import { useGetClassById } from "@/hooks/useGetClassById";
import { useGetClassesByHubIdQuery } from "@/hooks/useGetClassesByHubIdQuery";
import { useGetStudentListByClassId } from "@/hooks/useGetStudentListByClassId";
import { useGetClassInvoices } from "@/hooks/useGetClassInvoices";
import { addStudentIntoClassAPI } from "@/lib/api/addStudentIntoClassAPI";
import { newStudentInHub } from "@/lib/api/newStudentInHub";
import { useQueryClient } from "@tanstack/react-query";
import { AlbumIcon, CalendarCheck, Pen, CreditCard, Calendar, Clock, MapPin, User, Users, GraduationCap } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Class() {

    const { hub_id, class_id } = useParams();
    const { showAlert } = useAlert();
    const router = useRouter();

    const { data: classList = [], isLoading: isLoadingClassList, isError: isErrorClassList, error: errorClassList } = useGetClassesByHubIdQuery(hub_id as string);
    const { data: classData, isLoading: isLoadingClass, isError: isErrorClass, error: errorClass } = useGetClassById(class_id as string);
    const { data: studentDatas, isLoading: isLoadingStudent, isError: isErrorStudent, error: errorStudent } = useGetStudentListByClassId(class_id as string);
    const { data: allStudentList, isLoading: isLoadingAllStudentList, isError: isErrorAllStudentList, error: errorAllStudentList } = useGetAllStudentListByHubId(hub_id as string);
    const { data: invoices = [] } = useGetClassInvoices(class_id as string);


    const [overlapClasses, setOverlapClasses] = useState<FormattedOverlap | null>(null);
    const [openOverlapAlert, setOpenOverlapAlert] = useState<boolean>(false);

    const [openAddStudentIntoClassModal, setOpenAddStudentIntoClassModal] = useState(false);
    const [openNewStudentInHubModal, setOpenNewStudentInHubModal] = useState(false);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (overlapClasses && Object.keys(overlapClasses).length > 0) {
            setOpenOverlapAlert(true);
        } else {
            setOpenOverlapAlert(false);
        }
    }, [overlapClasses]);

    const addStudentIntoClass = async (selectedStudentIds: string[], classId: string, enrollDate: string) => {
        try {
            const res = await addStudentIntoClassAPI(selectedStudentIds, classId, enrollDate);

            queryClient.invalidateQueries({ queryKey: ["get_student_list_by_class_id", class_id] });
            queryClient.invalidateQueries({ queryKey: ['all_student_list_by_hub_id', hub_id] });

            showAlert("Student(s) added successfully", "success");
            setOpenAddStudentIntoClassModal(false);
        } catch (error: any) {
            if (error.response?.status === 409) {
                setOverlapClasses(error.response.data.overlap_classes);
                return;
            }
        }
    }

    const newStudent = async (newStudentForm: StudentInputDto, classEnrollments: ClassEnrollmentDto[]) => {
        try {
            const newStudentIdRes = await newStudentInHub(newStudentForm, hub_id as string);

            for (const enrollment of classEnrollments) {
                await addStudentIntoClassAPI([newStudentIdRes], enrollment.classId, enrollment.enrollDate);
            }

            queryClient.invalidateQueries({ queryKey: ['all_student_list_by_hub_id', hub_id] });

            for (const enrollment of classEnrollments) {
                queryClient.invalidateQueries({ queryKey: ['get_student_list_by_class_id', enrollment.classId] });
            }

            showAlert("New student added successfully", "success");
            setOpenNewStudentInHubModal(false);
        } catch (error) {
            console.error("Error adding new student:", error);
        }
    }

    const cardData: CardDirectionProps[] = [
        {
            icon: CalendarCheck,
            title: "Attendance",
            descr: "Log and manage session attendance.",
            bg_clr: 'green',
            onClick: () => { router.push(`/dashboard/hub/${hub_id}/attendance/${class_id}/grid`); },
        },
        {
            icon: Pen,
            title: "Homework",
            descr: "Create homework tasks & view reviews.",
            bg_clr: 'blue',
            onClick: () => {
                router.push(`${class_id}/homework`);
            },
        },
        {
            icon: AlbumIcon,
            title: "Gradebooks",
            descr: "View student academic performance gradebooks.",
            bg_clr: 'red',
            onClick: () => { 
                router.push(`../grade_book/${class_id}`);
             },
        },
        {
            icon: CreditCard,
            title: "Tuition Invoices",
            descr: "Review student billing statuses & invoices.",
            bg_clr: 'yellow',
            onClick: () => { 
                router.push(`/dashboard/hub/${hub_id}/classes/${class_id}/invoices`);
             },
        },
    ];

    if (isLoadingClass) return <LoadingState fullScreen message="Loading your class..." />;
    if (isErrorClass || !classData) return (
        <ErrorState
            fullScreen
            title="Error Loading Class"
            message={errorClass?.message || "Something went wrong while loading your class. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

    return (
        <div className="space-y-6 pb-5">
            <ClassHeader classInfo={classData} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {cardData.map((card, index) => (
                            <CardDirection
                                key={index}
                                title={card.title}
                                descr={card.descr}
                                bg_clr={card.bg_clr}
                                icon={card.icon}
                                onClick={card.onClick}
                            />
                        ))}
                    </div>

                    {/* Student List Section */}
                    <ViewStudentList
                        studentDatas={studentDatas}
                        invoices={invoices}
                        addStudentIntoClass={() => setOpenAddStudentIntoClassModal(true)}
                        newStudent={() => setOpenNewStudentInHubModal(true)}
                        isLoading={isLoadingStudent} 
                        isError={isErrorStudent} 
                        error={errorStudent} 
                    />
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Schedule Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase border-b border-slate-100 pb-2.5 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-500" />
                            Class Schedule
                        </h3>
                        <div className="space-y-2.5">
                            {classData.schedule && classData.schedule.length > 0 ? (
                                classData.schedule.map((session, index) => (
                                    <div key={index} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                        <span className="font-semibold text-slate-700 text-xs">{session.day}</span>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            <span>{session.startTime} - {session.endTime}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-xs italic">No schedule set</p>
                            )}
                        </div>
                    </div>

                    {/* Tuition Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase border-b border-slate-100 pb-2.5 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-emerald-500" />
                            Tuition & Billing
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tuition Fee</p>
                                <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                                    {classData.tuition ? `${Number(classData.tuition).toLocaleString()} VND` : "Free / Not Set"}
                                </p>
                            </div>
                            <div className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-md text-xs">
                                {classData.tuitionType}
                            </div>
                        </div>
                    </div>

                    {/* Academic Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase border-b border-slate-100 pb-2.5 flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-amber-500" />
                            Academic Period
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-400 font-medium">Start Date</p>
                                <p className="text-sm font-semibold text-slate-700 mt-1">{classData.startDate}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-medium">End Date</p>
                                <p className="text-sm font-semibold text-slate-700 mt-1">{classData.endDate}</p>
                            </div>
                        </div>
                        {classData.base && (
                            <div className="pt-3.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-slate-700 block mb-0.5">Classroom Location</span>
                                    <span className="text-slate-500">{classData.base}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Teaching Staff Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200/70 p-6 space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase border-b border-slate-100 pb-2.5 flex items-center gap-2">
                            <User className="w-4 h-4 text-sky-500" />
                            Teaching Staff
                        </h3>
                        <div className="space-y-3.5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200">
                                    {classData.teacher ? classData.teacher.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Primary Instructor</p>
                                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{classData.teacher}</p>
                                </div>
                            </div>

                            {classData.assistant && (
                                <div className="flex items-center gap-3 pt-3.5 border-t border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200">
                                        {classData.assistant.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Teaching Assistant</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-0.5">{classData.assistant}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AddStudentIntoClassModal
                allStudentList={allStudentList}
                studentsAlreadyInClass={studentDatas}
                isOpen={openAddStudentIntoClassModal}
                classId={class_id as string}
                onClose={() => setOpenAddStudentIntoClassModal(false)}
                onSubmit={addStudentIntoClass}
            />

            <NewStudentInHubModal
                availableClassDatas={classList}
                isOpen={openNewStudentInHubModal}
                onClose={() => setOpenNewStudentInHubModal(false)}
                onSubmit={newStudent}
            />

            {openOverlapAlert && (
                <OverlapAlert
                    overlapClasses={overlapClasses}
                    setOpenOverlapAlert={setOpenOverlapAlert}
                />
            )}
        </div>
    )
}
