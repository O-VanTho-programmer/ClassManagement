import React from 'react';
import { Search, Inbox, RefreshCw, CheckSquare, MailOpen, Mail, Trash2, X } from 'lucide-react';

export default function NotificationToolbar({
  searchTerm,
  setSearchTerm,
  isRefreshing,
  handleRefresh,
  filteredNotifications,
  selectedIds,
  isAllSelected,
  handleToggleSelectAll,
  handleBatchMarkRead,
  handleBatchDelete
}) {
  return (
    <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-gray-200 bg-gray-50/50 p-4 gap-4 shrink-0 z-10">
      {/* Title and Search */}
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg">
            <Inbox size={20} className="animate-pulse" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 hidden sm:block">Inbox</h1>
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search sender, subject, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-10 text-sm placeholder-gray-400 text-gray-800 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {searchTerm.trim() !== '' ? (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
      </div>

      {/* Global Toolbar Actions */}
      <div className="flex items-center justify-between md:justify-end gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center justify-center p-2 rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin text-indigo-600" : ""} />
          </button>
          
          {filteredNotifications.length > 0 ? (
            <button
              onClick={handleToggleSelectAll}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
            >
              <CheckSquare size={14} className={isAllSelected ? "text-indigo-600" : ""} />
              <span className="hidden sm:inline">{isAllSelected ? "Deselect All" : "Select All"}</span>
            </button>
          ) : null}
        </div>

        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
            <button
              onClick={() => handleBatchMarkRead(true)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              title="Mark as Read"
            >
              <MailOpen size={16} />
            </button>
            <button
              onClick={() => handleBatchMarkRead(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              title="Mark as Unread"
            >
              <Mail size={16} />
            </button>
            <div className="h-4 w-px bg-gray-200"></div>
            <button
              onClick={handleBatchDelete}
              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Selected"
            >
              <Trash2 size={16} />
            </button>
            <span className="text-[10px] font-mono text-gray-400 px-2 select-none">
              {selectedIds.length} selected
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}
