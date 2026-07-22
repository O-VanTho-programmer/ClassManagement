import React from 'react';
import { ArrowLeft, Star, Trash2, Sparkles, Clock, Reply, RefreshCw, Send, MailOpen } from 'lucide-react';

export default function NotificationDetail({
  selectedNotification,
  isMobileDetailActive,
  setIsMobileDetailActive,
  handleToggleStar,
  handleDeleteNotification,
  getCategoryConfig,
  formatDate,
  replyText,
  setReplyText,
  isSending,
  handleSendReply,
  unreadCount,
  starredCount
}) {
  return (
    <section className={`flex-1 flex flex-col bg-white overflow-hidden ${
      isMobileDetailActive ? 'flex' : 'hidden md:flex'
    }`}>
      
      {selectedNotification ? (
        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-2 duration-200">
          
          {/* Detail View Toolbar */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 px-4 py-3 shrink-0">
            
            {/* Mobile Back Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileDetailActive(false)}
                className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-150 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => handleToggleStar(selectedNotification.id, e)}
                  className={`p-2 rounded-xl border border-gray-200 bg-white transition-colors ${
                    selectedNotification.starred ? 'text-amber-500' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={selectedNotification.starred ? 'Unstar' : 'Star'}
                >
                  <Star size={16} fill={selectedNotification.starred ? 'currentColor' : 'none'} />
                </button>
                
                <button
                  onClick={(e) => handleDeleteNotification(selectedNotification.id, e)}
                  className="p-2 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <span className="text-[10px] font-mono text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
              ID: #{selectedNotification.id}
            </span>
          </div>

          {/* Detail Body Wrapper */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
            
            {/* Message Title */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                  getCategoryConfig(selectedNotification.category).bg
                }`}>
                  {selectedNotification.category}
                </span>
                {selectedNotification.role === 'AI' ? (
                  <span className="text-[10px] font-bold bg-indigo-50 border border-indigo-150 text-indigo-600 px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <Sparkles size={10} /> AI Powered
                  </span>
                ) : null}
              </div>

              <h2 className="text-lg md:text-xl font-bold tracking-tight text-gray-900 leading-snug">
                {selectedNotification.subject}
              </h2>
            </div>

            {/* Profile & Info Header */}
            <div className="flex items-center justify-between p-4 bg-gray-55/40 border border-gray-150 rounded-2xl">
              <div className="flex items-center gap-3">
                {/* Avatar Circle */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                  {selectedNotification.sender.charAt(0)}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 leading-tight">
                    {selectedNotification.sender}
                  </span>
                  <span className="text-xs text-gray-450 font-mono">
                    &lt;{selectedNotification.email}&gt;
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[11px] font-mono text-gray-500">
                  {formatDate(selectedNotification.date)}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5 flex items-center justify-end gap-1">
                  <Clock size={10} />
                  {new Date(selectedNotification.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>

            {/* Message Rich Text HTML Content container */}
            <article 
              className="p-5 bg-white border border-gray-200 rounded-2xl text-gray-700 text-sm leading-relaxed space-y-4 shadow-sm"
              dangerouslySetInnerHTML={{ __html: selectedNotification.content }}
            />

            {/* Quick Inline Reply Area */}
            <div className="p-4 bg-gray-50/50 border border-gray-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <Reply size={14} className="text-gray-400" />
                <span>Quick reply to {selectedNotification.sender}</span>
              </div>

              <textarea
                placeholder="Type your response here..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full min-h-[90px] p-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 outline-none resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleSendReply}
                  disabled={isSending || !replyText.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSending ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Column 2 Empty State: No notification selected */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full bg-white border border-gray-200/80 flex items-center justify-center text-gray-400 shadow-sm">
              <MailOpen size={28} className="text-gray-300 animate-bounce duration-1000" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 text-[10px] font-bold text-white items-center justify-center font-mono">
                {unreadCount}
              </span>
            </span>
          </div>

          <h3 className="text-base font-bold text-gray-800">Select a notification to read</h3>
          <p className="text-xs text-gray-500 mt-2 max-w-[280px] leading-relaxed">
            Choose any alert from the left panel to inspect grading evaluations, invoice files, schedule updates, or system credentials.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm w-full">
            <div className="p-3 bg-white border border-gray-200 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <span className="text-lg font-bold text-indigo-600">{unreadCount}</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">Unread</span>
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <span className="text-lg font-bold text-amber-600">{starredCount}</span>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-1">Starred</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
