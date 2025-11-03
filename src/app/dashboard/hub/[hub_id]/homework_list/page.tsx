'use client';

import HomeworkListTable from '@/components/HomeworkListTable/HomeworkListTable';
import SearchBar from '@/components/SearchBar/SearchBar';
import { useGetHomeworkListQuery } from '@/hooks/useGetHomeworkListQuery';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'

export default function HomeworkListPage() {
  const {hub_id} = useParams();
  const router = useRouter();

  const onCreateHomework = () => {
    router.push(`/dashboard/hub/${hub_id}/homework_list/create`);
  }

  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: homeworkList = [], isLoading: isLoadingHomeworkList, isError: isErrorHomeworkList, error: errorHomeworkList } = useGetHomeworkListQuery(hub_id as string);

  const filteredHomeworkList = useMemo(()=> {
    return homeworkList.filter((hw)=> {
      return hw.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [homeworkList, searchTerm]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Homework Library</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          search_width_style="medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={onCreateHomework}
          className="w-full cursor-pointer md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Create Homework
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <HomeworkListTable
          isLoading={isLoadingHomeworkList}
          isError={isErrorHomeworkList}
          error={errorHomeworkList}
          homeworkList={filteredHomeworkList as Homework[]} />
      </div>
    </div>
  );
}