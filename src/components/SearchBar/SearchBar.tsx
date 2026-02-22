interface SearchBarProps {
    value?: string;
    search_width_style?: "header-dashboard" | "small" | "medium"
    onChange?: (value: any) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSearchClick?: () => void;
}

export default function SearchBar({ search_width_style, onChange, onKeyDown, value, onSearchClick}: SearchBarProps) {
    let width_style = "w-sm md:w-md";

    switch (search_width_style) {
        case "header-dashboard":
            width_style = "w-sm md:w-md";
            break;
        case "medium":
            width_style = "w-[250px]";
            break;
        case "small":
            width_style = "w-[150px]";
            break;
    }

    return (
        <div className={`${width_style} text-black focus:ring-blue-500 focus:border-blue-500`}>
            <div className="relative">
                <div onClick={onSearchClick} className="absolute inset-y-0 start-0 flex items-center ps-3 cursor-pointer">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>

                <input value={value} onKeyDown={onKeyDown} onChange={onChange} id="default-search" className="block w-full min-w-[150px] p-2 ps-10 text-sm text-black! border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
            </div>
        </div>
    )
}