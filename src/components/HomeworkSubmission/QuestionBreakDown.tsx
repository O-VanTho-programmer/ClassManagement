import React from 'react'

type QuestionBreakDownProps = {
    gradeBooks: StudentHomeworkQuestionsInputDTO[]
    updateQuestionGrade: (index: number, grade: number) => void
}

export default function QuestionBreakDown({ gradeBooks, updateQuestionGrade }: QuestionBreakDownProps) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Question Breakdown</label>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2 w-16 text-center">Q#</th>
                            <th className="px-4 py-2 w-24 text-center">Score</th>
                            <th className="px-4 py-2">AI Comment / Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {gradeBooks.map((q, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-center font-medium text-gray-900">
                                    {q.question_number}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <input
                                            type="number"
                                            className="w-12 p-1 text-center font-bold border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                            value={q.grade}
                                            onChange={(e) => updateQuestionGrade(idx, Number(e.target.value))}
                                        />
                                        <span className="text-gray-400 text-xs">/ {q.max_grade}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600 italic">
                                    {q.feed_back || "No comment."}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}