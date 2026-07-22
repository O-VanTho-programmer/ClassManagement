"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Tag, Wallet, BookOpen, Inbox, Settings, Info, X } from 'lucide-react';

import { useGetNotifications } from '@/hooks/useGetNotifications';
import { useUpdateNotifications } from '@/hooks/useUpdateNotifications';
import NotificationSidebar from './components/NotificationSidebar';
import NotificationToolbar from './components/NotificationToolbar';
import NotificationList from './components/NotificationList';
import NotificationDetail from './components/NotificationDetail';

export default function ClassNotificationPage() {
  const params = useParams();
  const hubId = params?.hub_id;

  const [notifications, setNotifications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [currentFolder, setCurrentFolder] = useState('inbox'); // 'inbox', 'starred', 'trash'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'tuition', 'homework', 'class', 'system'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [isMobileDetailActive, setIsMobileDetailActive] = useState(false);

  const triggerToast = (message, action = null, actionLabel = '') => {
    setToast({ message, action, actionLabel });
  };

  const { data: initialNotifications, refetch } = useGetNotifications(hubId);
  const updateMutation = useUpdateNotifications();

  useEffect(() => {
    if (initialNotifications) {
      setNotifications(initialNotifications);
    }
  }, [initialNotifications]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    setSelectedIds([]);
  }, [currentFolder, categoryFilter]);

  const selectedNotification = useMemo(() => {
    return notifications.find(n => n.id === selectedId) || null;
  }, [notifications, selectedId]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      // Folder
      if (currentFolder === 'inbox' && item.deleted) return false;
      if (currentFolder === 'starred' && (item.deleted || !item.starred)) return false;
      if (currentFolder === 'trash' && !item.deleted) return false;

      // Category
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

      // Search
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          item.sender.toLowerCase().includes(term) ||
          item.subject.toLowerCase().includes(term) ||
          item.snippet.toLowerCase().includes(term)
        );
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notifications, currentFolder, categoryFilter, searchTerm]);

  // Calculate unread statistics
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read && !n.deleted).length;
  }, [notifications]);

  const starredCount = useMemo(() => {
    return notifications.filter(n => n.starred && !n.deleted).length;
  }, [notifications]);

  const trashCount = useMemo(() => {
    return notifications.filter(n => n.deleted).length;
  }, [notifications]);

  // Category Styling config
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'tuition':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          label: 'Tuition',
          icon: Wallet
        };
      case 'homework':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          label: 'Homework',
          icon: BookOpen
        };
      case 'class':
        return {
          bg: 'bg-violet-50 text-violet-700 border-violet-200',
          label: 'Class',
          icon: Inbox
        };
      case 'system':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          label: 'System',
          icon: Settings
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-700 border-gray-200',
          label: 'Info',
          icon: Tag
        };
    }
  };

  const handleSelectNotification = async (id) => {
    setSelectedId(id);
    setIsMobileDetailActive(true);
    
    const target = notifications.find(n => n.id === id);
    if (target && !target.read) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      updateMutation.mutate({ hubId, ids: [id], action: 'read' });
    }
  };

  const handleToggleStar = async (id, e) => {
    if (e) e.stopPropagation();
    const target = notifications.find(n => n.id === id);
    if (!target) return;
    
    const nextStarredState = !target.starred;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, starred: nextStarredState } : n));
    updateMutation.mutate({ hubId, ids: [id], action: nextStarredState ? 'star' : 'unstar' });
  };

  // Delete notification (moves to trash or deletes permanently)
  const handleDeleteNotification = async (id, e) => {
    if (e) e.stopPropagation();
    const target = notifications.find(n => n.id === id);
    if (!target) return;

    if (currentFolder === 'trash') {
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setIsMobileDetailActive(false);
      }
      triggerToast("Notification permanently deleted.");
    } else {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, deleted: true } : n));
      if (selectedId === id) {
        setSelectedId(null);
        setIsMobileDetailActive(false);
      }

      const undoAction = () => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, deleted: false } : n));
        updateMutation.mutate({ hubId, ids: [id], action: 'restore' });
        triggerToast("Restored notification.");
      };

      updateMutation.mutate({ hubId, ids: [id], action: 'trash' });
      triggerToast("Moved notification to trash.", undoAction, "Undo");
    }
  };

  const isAllSelected = useMemo(() => {
    return filteredNotifications.length > 0 && selectedIds.length === filteredNotifications.length;
  }, [filteredNotifications, selectedIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const handleToggleSelectOne = (id, e) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  // Batch actions
  const handleBatchMarkRead = async (readStatus) => {
    if (selectedIds.length === 0) return;
    const idsToUpdate = [...selectedIds];

    setNotifications(prev => prev.map(n => {
      if (idsToUpdate.includes(n.id)) {
        return { ...n, read: readStatus };
      }
      return n;
    }));
    setSelectedIds([]);

    updateMutation.mutate({ hubId, ids: idsToUpdate, action: readStatus ? 'read' : 'unread' });
    triggerToast(`Marked ${idsToUpdate.length} items as ${readStatus ? 'read' : 'unread'}.`);
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    
    const idsToDelete = [...selectedIds];

    if (currentFolder === 'trash') {
      setNotifications(prev => prev.filter(n => !idsToDelete.includes(n.id)));
      if (idsToDelete.includes(selectedId)) {
        setSelectedId(null);
        setIsMobileDetailActive(false);
      }
      setSelectedIds([]);
      triggerToast(`Permanently deleted ${idsToDelete.length} items.`);
    } else {
      setNotifications(prev => prev.map(n => {
        if (idsToDelete.includes(n.id)) {
          return { ...n, deleted: true };
        }
        return n;
      }));

      if (idsToDelete.includes(selectedId)) {
        setSelectedId(null);
        setIsMobileDetailActive(false);
      }
      setSelectedIds([]);

      const undoBatchAction = () => {
        setNotifications(prev => prev.map(n => {
          if (idsToDelete.includes(n.id)) {
            return { ...n, deleted: false };
          }
          return n;
        }));
        updateMutation.mutate({ hubId, ids: idsToDelete, action: 'restore' });
        triggerToast(`Restored ${idsToDelete.length} items.`);
      };

      updateMutation.mutate({ hubId, ids: idsToDelete, action: 'trash' });
      triggerToast(`Moved ${idsToDelete.length} items to trash.`, undoBatchAction, "Undo");
    }
  };

  // Refresh animation trigger
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
    triggerToast("Inbox updated.");
  };

  // Reply simulation
  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setReplyText('');
      triggerToast("Reply sent successfully.");
    }, 1000);
  };

  // Date formatter
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="absolute top-[72px] bottom-0 left-0 right-0 flex flex-col bg-white text-gray-900 overflow-hidden border-t border-gray-200">
      
      {/* Top Banner Toolbar */}
      <NotificationToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        filteredNotifications={filteredNotifications}
        selectedIds={selectedIds}
        isAllSelected={isAllSelected}
        handleToggleSelectAll={handleToggleSelectAll}
        handleBatchMarkRead={handleBatchMarkRead}
        handleBatchDelete={handleBatchDelete}
      />

      {/* Main Container */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        {/* Left Folder Side Menu */}
        <NotificationSidebar
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          unreadCount={unreadCount}
          starredCount={starredCount}
          trashCount={trashCount}
          setSelectedId={setSelectedId}
        />

        {/* 2-Column Split View Body */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Column 1: Notification Cards List */}
          <NotificationList
            filteredNotifications={filteredNotifications}
            selectedId={selectedId}
            handleSelectNotification={handleSelectNotification}
            selectedIds={selectedIds}
            handleToggleSelectOne={handleToggleSelectOne}
            currentFolder={currentFolder}
            setCurrentFolder={setCurrentFolder}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            unreadCount={unreadCount}
            starredCount={starredCount}
            trashCount={trashCount}
            setNotifications={setNotifications}
            setSelectedId={setSelectedId}
            triggerToast={triggerToast}
            handleToggleStar={handleToggleStar}
            handleDeleteNotification={handleDeleteNotification}
            getCategoryConfig={getCategoryConfig}
            formatDate={formatDate}
            isMobileDetailActive={isMobileDetailActive}
          />

          {/* Column 2: Notification Message Detail */}
          <NotificationDetail
            selectedNotification={selectedNotification}
            isMobileDetailActive={isMobileDetailActive}
            setIsMobileDetailActive={setIsMobileDetailActive}
            handleToggleStar={handleToggleStar}
            handleDeleteNotification={handleDeleteNotification}
            getCategoryConfig={getCategoryConfig}
            formatDate={formatDate}
            replyText={replyText}
            setReplyText={setReplyText}
            isSending={isSending}
            handleSendReply={handleSendReply}
            unreadCount={unreadCount}
            starredCount={starredCount}
          />

        </div>

      </div>

      {/* Floating Animated Toast Container */}
      {toast ? (
        <div className="fixed bottom-4 right-4 flex items-center gap-3 bg-white border border-gray-200 text-gray-800 text-xs px-4 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-bottom-4 duration-300">
          <Info size={14} className="text-indigo-600" />
          <span>{toast.message}</span>
          {toast.action ? (
            <button
              onClick={() => {
                toast.action();
                setToast(null);
              }}
              className="ml-2 text-indigo-600 hover:text-indigo-500 font-bold underline cursor-pointer"
            >
              {toast.actionLabel || 'Action'}
            </button>
          ) : null}
          <button 
            onClick={() => setToast(null)}
            className="text-gray-400 hover:text-gray-600 ml-1"
          >
            <X size={14} />
          </button>
        </div>
      ) : null}

    </div>
  );
}