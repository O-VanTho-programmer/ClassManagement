import { TableClassProps } from "../TableClass/TableClass";
import ViewCardClassItem from "../ViewCardClassItem/ViewCardClassItem";

export default function ViewCardClasses({ datas }: TableClassProps) {
    return (
        <div className="py-4 flex flex-wrap gap-2 mx-4">
            {datas.map((data) => (
                <ViewCardClassItem key={data.id} classData={data} />
            ))}
        </div>
    )
}