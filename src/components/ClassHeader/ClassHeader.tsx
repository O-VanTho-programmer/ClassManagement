import { ArrowLeft, BookOpen, Users, GraduationCap } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Badge from "../Badge/Badge";
import { ClassData } from "@/types/ClassData";

interface ClassHeaderProps {
    classInfo: ClassData | undefined | null;
}

export default function ClassHeader({ classInfo }: ClassHeaderProps) {
    const router = useRouter();
    const { hub_id } = useParams();

    if (classInfo === null || classInfo === undefined) {
        return null;
    }

    const handleBack = () => {
        router.push(`/dashboard/hub/${hub_id}/class_management`);
    };

    return (
        <div className="flex flex-col w-full pb-6 border-b border-slate-200">
            {/* Breadcrumbs & Back Navigation */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-1 hover:text-gray-900 transition-colors duration-150 cursor-pointer font-medium"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Classes</span>
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-gray-600 font-medium">Class Details</span>
            </div>

            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                            {classInfo.name}
                        </h1>
                        {classInfo.status === "Finished" ? (
                            <Badge bg_clr="bg-slate-500" title="Finished" />
                        ) : (
                            <Badge bg_clr="bg-emerald-500" title="Active" />
                        )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                            <BookOpen className="w-4 h-4 text-slate-500" />
                            <span className="font-medium text-slate-700">{classInfo.subject}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="font-medium text-slate-700">{classInfo.studentCount} Students</span>
                        </div>
                        {classInfo.base && (
                            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                                <GraduationCap className="w-4 h-4 text-slate-500" />
                                <span className="font-medium text-slate-700">{classInfo.base}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}