import { TableClassProps } from "../TableClass/TableClass";
import ViewCardClassItem from "../ViewCardClassItem/ViewCardClassItem";
import { useParams, useRouter } from "next/navigation";

export default function ViewCardClasses({ datas }: TableClassProps) {
    const router = useRouter();
    
    if(datas == null || datas == undefined) return null;

    const directToClassDetail = (classId: string) => {
        router.push(`classes/${classId}`);
    }

    return (
        <div className="py-4 flex flex-wrap gap-2 mx-4">
            {datas.map((data) => (
                <ViewCardClassItem
                   key={data.id} 
                   onLinkToClassDetail={() => directToClassDetail(data.id)}
                   classData={data} />
            ))}
        </div>
    )
}