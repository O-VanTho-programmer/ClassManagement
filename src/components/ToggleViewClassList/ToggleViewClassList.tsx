import { GridIcon, ListIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface ToggleViewClassListProps {
    isTableView: boolean,
    setIsTableView: Dispatch<SetStateAction<boolean>>
}

const ToggleViewClassList = ({ isTableView, setIsTableView }: ToggleViewClassListProps) => {

    return (
        <div className="flex items-center space-x-2 bg-gray-200 rounded-full p-1 transition-all duration-300">
            <button
                onClick={() => setIsTableView(true)}
                className={`p-2 rounded-full transition-all duration-300 ${isTableView ? 'bg-blue-500 text-white shadow' : 'text-gray-500 hover:bg-white'
                    }`}
            >
                <ListIcon className="w-5 h-5" />
            </button>
            <button
                onClick={() => setIsTableView(false)}
                className={`p-2 rounded-full transition-all duration-300 ${!isTableView ? 'bg-blue-500 text-white shadow' : 'text-gray-500 hover:bg-white'
                    }`}
            >
                <GridIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ToggleViewClassList;