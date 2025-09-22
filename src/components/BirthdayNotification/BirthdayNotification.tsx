import { Cake, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SquareButton from "../SquareButton/SquareButton";

export default function BirthdayNotification() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef && !modalRef.current?.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        }

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isModalOpen])

    return (
        <div className="">
            <SquareButton color="blue" onClick={() => setIsModalOpen(!isModalOpen)} icon={Cake} description="Students's Birthday is 7 days coming" />

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center p-4">
                    <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-slate-800">
                                Học sinh sinh nhật trong 7 ngày tới
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors duration-200">
                                <XIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="bg-slate-100 p-4 rounded-lg text-center text-slate-600 mb-6">
                            Có lỗi xảy ra khi tải danh sách học sinh
                        </div>

                        <div className="flex justify-center">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}