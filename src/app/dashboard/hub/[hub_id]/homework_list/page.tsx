'use client';

import AssignHomeworkToClassModal from '@/components/AssignHomeworkToClassModal/AssignHomeworkToClassModal';
import Button from '@/components/Button/Button';
import HomeworkListTable from '@/components/HomeworkListTable/HomeworkListTable';
import SearchBar from '@/components/SearchBar/SearchBar';
import { useGetHomeworkListQuery } from '@/hooks/useGetHomeworkListQuery';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { use, useMemo, useState } from 'react'

export default function HomeworkListPage() {
  const { hub_id } = useParams();
  const router = useRouter();

  const onCreateHomework = () => {
    router.push(`/dashboard/hub/${hub_id}/homework_list/create`);
  }

  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data: homeworkList = [], isLoading: isLoadingHomeworkList, isError: isErrorHomeworkList, error: errorHomeworkList } = useGetHomeworkListQuery(hub_id as string);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [isAssignHomeworkToClassModalOpen, setIsAssignHomeworkToClassModalOpen] = useState(false);

  const filteredHomeworkList = useMemo(() => {
    return homeworkList.filter((hw) => {
      return hw.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [homeworkList, searchTerm]);

  const handleSelectAssignHomeworkToClass = (homework: Homework) => {
    setSelectedHomework(homework);
    setIsAssignHomeworkToClassModalOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Homework Library</h1>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <SearchBar
          search_width_style="medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button color='blue' icon={Plus} title='Create Homework' onClick={onCreateHomework}/>
      </div>

      <div className="bg-white rounded-xl shadow-lg">
        <HomeworkListTable
          isLoading={isLoadingHomeworkList}
          isError={isErrorHomeworkList}
          error={errorHomeworkList}
          homeworkList={filteredHomeworkList as Homework[]} 
          onSelectAssignHomeworkToClass={handleSelectAssignHomeworkToClass}/>
      </div>

      {selectedHomework && (
        <AssignHomeworkToClassModal
          curHomework={selectedHomework}
          hubId={hub_id as string}
          isOpen={isAssignHomeworkToClassModalOpen}
          onClose={() => {
            setSelectedHomework(null);
            setIsAssignHomeworkToClassModalOpen(false);
          }}
        />
      )}
    </div>
  );
}