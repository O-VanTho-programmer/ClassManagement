import { useState } from "react";
import { Option } from "../Selection/Selection";
import { Check, ChevronDown } from "lucide-react";

interface SelectionWithLabelProps {
    label: string, 
    options: Option[], 
    initialValue: string
    onChange? : (value: string) => void
}

export default function SelectionWithLabel ({ label, options, initialValue, onChange } : SelectionWithLabelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(
        options.find(opt => opt.value === initialValue) || options[0]
    );

    const handleSelect = (option: Option) => {
        setSelectedOption(option);
        onChange && onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-64 md:w-48 text-gray-700">
            <div className="absolute -top-6 left-0 text-sm font-medium text-gray-500">
                {label}
            </div>
            <button
                type="button"
                className="flex justify-between items-center w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>{selectedOption.label}</span>
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <ul
                    className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                    role="listbox"
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`cursor-pointer select-none relative py-2 pl-10 pr-4 transition duration-150 ease-in-out hover:bg-gray-100 ${selectedOption.value === option.value ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => handleSelect(option)}
                            role="option"
                            aria-selected={selectedOption.value === option.value}
                        >
                            <span className="block truncate">{option.label}</span>
                            {selectedOption.value === option.value && (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <Check className="w-4 h-4" />
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};