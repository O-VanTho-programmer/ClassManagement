import React from 'react';
import { Mail, Star, Trash2 } from 'lucide-react';

export default function NotificationList({
  filteredNotifications,
  selectedId,
  handleSelectNotification,
  selectedIds,
  handleToggleSelectOne,
  currentFolder,
  setCurrentFolder,
  categoryFilter,
  setCategoryFilter,
  unreadCount,
  starredCount,
  trashCount,
  setNotifications,
  setSelectedId,
  triggerToast,
  handleToggleStar,
  handleDeleteNotification,
  getCategoryConfig,
  formatDate,
  isMobileDetailActive
}) {
  return (
    <section className={`w-full md:w-[400px] lg:w-[420px] shrink-0 border-r border-gray-200 flex flex-col bg-gray-55/30 ${
      isMobileDetailActive ? 'hidden md:flex' : 'flex'
    }`}>
      
      {/* Category selection row for Mobile / Tablet view */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto p-3 bg-gray-50 border-b border-gray-200 scrollbar-none">
        {/* Folder Selector Pills */}
        <select 
          value={currentFolder} 
          onChange={(e) => { setCurrentFolder(e.target.value); setSelectedId(null); }}
          className="bg-white border border-gray-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none text-gray-700 focus:border-indigo-500"
        >
          <option value="inbox">Inbox ({unreadCount})</option>
          <option value="starred">Starred ({starredCount})</option>
          <option value="trash">Trash ({trashCount})</option>
        </select>

        <div className="h-4 w-px bg-gray-200 shrink-0 mx-1"></div>

        {/* Category Pills */}
        {['all', 'tuition', 'homework', 'class', 'system'].map((cat) => {
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 capitalize border transition-all ${
                isActive 
                  ? 'bg-gray-200 border-gray-300 text-gray-800 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* List Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 border-b border-gray-200 shrink-0">
        <span className="text-xs font-semibold text-gray-400 select-none">
          Showing {filteredNotifications.length} notification{filteredNotifications.length === 1 ? '' : 's'}
        </span>
        {currentFolder === 'trash' && filteredNotifications.length > 0 ? (
          <button
            onClick={() => {
              setNotifications(prev => prev.filter(n => !n.deleted));
              setSelectedId(null);
              triggerToast("Trash folder emptied.");
            }}
            className="text-[10px] text-red-500 hover:text-red-600 font-bold tracking-wide uppercase transition-colors"
          >
            Empty Trash
          </button>
        ) : null}
      </div>

      {/* Cards List Scroller */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-150 custom-scrollbar p-2 space-y-1">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => {
            const isSelected = selectedId === item.id;
            const isUnread = !item.read;
            const catConfig = getCategoryConfig(item.category);
            const CatIcon = catConfig.icon;

            return (
              <article
                key={item.id}
                onClick={() => handleSelectNotification(item.id)}
                className={`group relative flex flex-col p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-indigo-50/45 border-indigo-200 shadow-sm' 
                    : 'bg-white hover:bg-gray-50/40 border-gray-200/60'
                }`}
              >
                {/* Highlight border on selected */}
                {isSelected ? (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-indigo-600 rounded-r-full" />
                ) : null}

                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onClick={(e) => handleToggleSelectOne(item.id, e)}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded border-gray-300 bg-white text-indigo-600 focus:ring-0 focus:ring-offset-0 transition-opacity opacity-0 group-hover:opacity-100 checked:opacity-100 cursor-pointer"
                    />
                    
                    {/* Category Badge Icon */}
                    <span className={`p-1 rounded-md border ${catConfig.bg}`}>
                      <CatIcon size={12} />
                    </span>

                    <span className={`text-xs font-semibold truncate max-w-[130px] ${
                      isUnread ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {item.sender}
                    </span>

                    {/* Role tag */}
                    <span className="text-[9px] font-semibold px-1.5 py-0.25 bg-gray-50 border border-gray-200 text-gray-500 rounded">
                      {item.role}
                    </span>
                  </div>

                  {/* Date badge */}
                  <span className="text-[10px] font-mono text-gray-400">
                    {formatDate(item.date).split(',')[0]}
                  </span>
                </div>

                {/* Subject Row */}
                <h4 className={`text-sm tracking-tight truncate leading-snug mb-1 ${
                  isUnread ? 'text-gray-900 font-bold' : 'text-gray-600 font-normal'
                }`}>
                  {item.subject}
                </h4>

                {/* Snippet Row */}
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>

                {/* Foot Action Badges */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  {/* Status Dots */}
                  <div className="flex items-center gap-2">
                    {isUnread ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-sm shadow-indigo-600" title="Unread" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                    )}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${catConfig.bg}`}>
                      {catConfig.label}
                    </span>
                  </div>

                  {/* Hover Quick Actions */}
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleToggleStar(item.id, e)}
                      className={`p-1.5 rounded-lg border border-transparent hover:bg-gray-100 transition-colors ${
                        item.starred ? 'text-amber-500' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={item.starred ? 'Unstar' : 'Star'}
                    >
                      <Star size={13} fill={item.starred ? 'currentColor' : 'none'} />
                    </button>
                    
                    <button
                      onClick={(e) => handleDeleteNotification(item.id, e)}
                      className="p-1.5 rounded-lg border border-transparent hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 animate-in fade-in duration-300">
            <div className="p-4 bg-gray-100 rounded-full border border-gray-200 text-gray-400 mb-4">
              <Mail size={32} />
            </div>
            <h3 className="text-sm font-semibold text-gray-700">No notifications found</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-[240px]">
              No messages match your selected filters or folder criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
