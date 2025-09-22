import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

interface SelectionProps {
    placeholder: string,
    options: string[],
    onChange: (value: string) => void;
}

export default function Selection({ placeholder, onChange, options }: SelectionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-between items-center w-full min-w-[120px] rounded-full border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate max-w-[100px] overflow-x-hidden">
                    {selectedOption || placeholder}
                </span>
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" />
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option, index) => (
                            <a
                                key={index}
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleOptionClick(option);
                                }}
                            >
                                {option}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}