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
import { addStudentIntoClassAPI } from "@/lib/api/addStudentIntoClassAPI";
import { newStudentInHub } from "@/lib/api/newStudentInHub";
import { useQueryClient } from "@tanstack/react-query";
import { AlbumIcon, CalendarCheck, Pen } from "lucide-react";
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
            descr: "Take attendance",
            bg_clr: 'green',
            onClick: () => { router.push(`/dashboard/hub/${hub_id}/attendance/${class_id}/grid`); },
        },
        {
            icon: Pen,
            title: "Homework",
            descr: "Create homework",
            bg_clr: 'blue',
            onClick: () => {
                router.push(`${class_id}/homework`);
            },
        },
        {
            icon: AlbumIcon,
            title: "Lesson Plan",
            descr: "In Proccess",
            bg_clr: 'red',
            onClick: () => { return null },
        },
    ];

    if (isLoadingClass) return <LoadingState fullScreen message="Loading your class..." />;
    if (isErrorClass) return (
        <ErrorState
            fullScreen
            title="Error Loading Class"
            message={errorClass?.message || "Something went wrong while loading your class. Please try again."}
            onRetry={() => window.location.reload()}
        />
    );

    return (
        <>
            <ClassHeader classInfo={classData} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

            <ViewStudentList
                studentDatas={studentDatas}
                addStudentIntoClass={() => setOpenAddStudentIntoClassModal(true)}
                newStudent={() => setOpenNewStudentInHubModal(true)}
                isLoading={isLoadingStudent} isError={isErrorStudent} error={errorStudent} />

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
        </>
    )
}