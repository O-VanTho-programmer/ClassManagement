import ClassesCard from "@/components/ClassesCard/ClassesCard";
import LayoutDashboard from "@/components/LayoutDashboard/LayoutDashboard";
import ViewClass from "@/components/ViewClass/ViewClass";

export default function ClassesPage() {
    return (
        <LayoutDashboard>
            <ClassesCard/>
            <ViewClass/>
        </LayoutDashboard>
    )
}