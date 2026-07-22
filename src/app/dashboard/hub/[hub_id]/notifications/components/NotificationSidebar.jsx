import React from 'react';
import { Inbox, Star, Trash2 } from 'lucide-react';

export default function NotificationSidebar({
  currentFolder,
  setCurrentFolder,
  categoryFilter,
  setCategoryFilter,
  unreadCount,
  starredCount,
  trashCount,
  setSelectedId
}) {
  const folders = [
    { id: 'inbox', label: 'Inbox', icon: Inbox, count: unreadCount, badgeColor: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { id: 'starred', label: 'Starred', icon: Star, count: starredCount, badgeColor: 'bg-gray-100 text-gray-500 border-gray-200' },
    { id: 'trash', label: 'Trash', icon: Trash2, count: trashCount, badgeColor: 'bg-gray-100 text-gray-500 border-gray-200' }
  ];

  const handleFolderChange = (folderId) => {
    setCurrentFolder(folderId);
    setSelectedId(null);
  };

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-gray-200 bg-white p-4 gap-2 shrink-0">
      <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase px-3 mb-1">Folders</div>
      
      {folders.map(({ id, label, icon: Icon, count, badgeColor }) => (
        <button
          key={id}
          onClick={() => handleFolderChange(id)}
          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            currentFolder === id 
              ? 'bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Icon size={18} />
            <span>{label}</span>
          </div>
          {count > 0 ? (
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {count}
            </span>
          ) : null}
        </button>
      ))}

      <div className="h-px bg-gray-150 my-2"></div>
      
      <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase px-3 mb-1">Filter Categories</div>
      
      {['all', 'tuition', 'homework', 'class', 'system'].map((cat) => {
        const isActive = categoryFilter === cat;
        return (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all capitalize border ${
              isActive
                ? 'bg-gray-100 text-gray-900 border-gray-200 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-transparent'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              cat === 'tuition' ? 'bg-emerald-500' :
              cat === 'homework' ? 'bg-amber-500' :
              cat === 'class' ? 'bg-violet-500' :
              cat === 'system' ? 'bg-blue-500' : 'bg-gray-400'
            }`} />
            <span>{cat === 'all' ? 'All Messages' : cat}</span>
          </button>
        );
      })}
    </aside>
  );
}
