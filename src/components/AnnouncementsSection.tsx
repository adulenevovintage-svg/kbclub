import React, { useState, useEffect, useMemo } from 'react';
import { Announcement } from '../types';
import { 
  Megaphone, 
  Flame, 
  Trophy, 
  Sparkles, 
  Building2, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Plus, 
  Edit3, 
  Trash2, 
  Pin, 
  Check, 
  X, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Radio, 
  Bell, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  onUpdateAnnouncements: (announcements: Announcement[]) => void;
  canLiveEdit: boolean;
  onAddToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
  onOpenStudentAuth?: (mode?: 'register' | 'login') => void;
  onExploreClubs?: () => void;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements,
  onUpdateAnnouncements,
  canLiveEdit,
  onAddToast,
  onOpenStudentAuth,
  onExploreClubs
}) => {
  const [selectedAnnouncementForDetail, setSelectedAnnouncementForDetail] = useState<Announcement | null>(null);

  // Admin Edit / Create State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Announcement> | null>(null);

  // Preset background images for quick creation
  const presetImages = [
    { label: 'Campus & Scholars', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80' },
    { label: 'Robotics & STEM', url: 'https://cdn.phototourl.com/free/2026-09-20-27a9f26b-61b4-4adf-8ed5-16e5600b89d1.jpg' },
    { label: 'Science & Labs', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80' },
    { label: 'Debate & Chamber', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80' },
    { label: 'Fine Arts Studio', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80' },
  ];

  // Hero featured announcement (pinned or highest priority)
  const heroAnnouncement = useMemo(() => {
    const pinned = announcements.find(a => a.isPinned);
    if (pinned) return pinned;
    const breaking = announcements.find(a => a.priority === 'breaking');
    if (breaking) return breaking;
    return announcements[0] || null;
  }, [announcements]);

  // Secondary announcements list (other 2+ announcements below)
  const otherAnnouncements = useMemo(() => {
    return announcements.filter(a => a.id !== heroAnnouncement?.id);
  }, [announcements, heroAnnouncement]);

  // Handle Action Button click from announcement
  const handleActionClick = (item: Announcement) => {
    if (item.actionType === 'register' && onOpenStudentAuth) {
      onOpenStudentAuth('register');
    } else if (item.actionType === 'login' && onOpenStudentAuth) {
      onOpenStudentAuth('login');
    } else if (onExploreClubs) {
      onExploreClubs();
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingItem({
      id: `ann-${Date.now()}`,
      title: '',
      summary: '',
      content: '',
      category: 'Breaking News',
      priority: 'breaking',
      date: 'Today • Just Now',
      authorName: 'Office of the Highschool Director',
      authorRole: 'Highschool Director',
      badgeText: '🔥 FLASH BULLETIN',
      coverImage: presetImages[0].url,
      actionText: 'Explore & Register',
      actionType: 'register',
      isPinned: false,
      isPublished: true,
      readTime: '2 min read'
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: Announcement, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  // Save Announcement
  const handleSaveAnnouncement = () => {
    if (!editingItem || !editingItem.title?.trim()) {
      onAddToast('warning', 'Title Required', 'Please enter a title for the announcement.');
      return;
    }

    const itemToSave: Announcement = {
      id: editingItem.id || `ann-${Date.now()}`,
      title: editingItem.title.trim(),
      summary: editingItem.summary?.trim() || editingItem.content?.slice(0, 120) || '',
      content: editingItem.content?.trim() || editingItem.summary || '',
      date: editingItem.date || 'Today • Active',
      priority: editingItem.priority || 'normal',
      category: editingItem.category || 'Breaking News',
      badgeText: editingItem.badgeText || (editingItem.priority === 'breaking' ? '🔥 FLASH BULLETIN' : '📢 NOTICE'),
      coverImage: editingItem.coverImage || presetImages[0].url,
      actionText: editingItem.actionText || 'Read Details',
      actionType: editingItem.actionType || 'register',
      authorName: editingItem.authorName || 'Student Life Director',
      authorRole: editingItem.authorRole || 'Executive Administration',
      isPinned: !!editingItem.isPinned,
      isPublished: true,
      readTime: editingItem.readTime || '2 min read'
    };

    const exists = announcements.some(a => a.id === itemToSave.id);
    let updatedList: Announcement[];

    if (exists) {
      updatedList = announcements.map(a => a.id === itemToSave.id ? itemToSave : a);
      onAddToast('success', 'Announcement Updated', `"${itemToSave.title}" has been saved.`);
    } else {
      updatedList = [itemToSave, ...announcements];
      onAddToast('success', 'Announcement Published', `New bulletin "${itemToSave.title}" is now broadcasting.`);
    }

    onUpdateAnnouncements(updatedList);
    try {
      localStorage.setItem('kb_academy_v2_announcements', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Delete Announcement
  const handleDeleteAnnouncement = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = announcements.filter(a => a.id !== id);
    onUpdateAnnouncements(updatedList);
    try {
      localStorage.setItem('kb_academy_v2_announcements', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    onAddToast('info', 'Announcement Removed', 'The bulletin was deleted.');
  };

  // Toggle Pin
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = announcements.map(a => 
      a.id === id ? { ...a, isPinned: !a.isPinned } : { ...a, isPinned: false }
    );
    onUpdateAnnouncements(updatedList);
    try {
      localStorage.setItem('kb_academy_v2_announcements', JSON.stringify(updatedList));
    } catch {
      // ignore
    }
    onAddToast('info', 'Pin Status Changed', 'Hero featured bulletin has been updated.');
  };

  const getPriorityBadgeClass = (priority?: string) => {
    switch (priority) {
      case 'breaking':
        return 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-sm shadow-red-500/20 animate-pulse';
      case 'urgent':
        return 'bg-amber-600 text-white shadow-sm';
      case 'high':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="announcements-news-section">
      {/* Dynamic Background Glow Layer */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-[#a06014] text-xs font-bold uppercase tracking-wider mb-2">
            <Megaphone className="w-3.5 h-3.5 text-[#b46d1c]" />
            <span>Academy Announcements & News</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            Official Scholastic Dispatches & Bulletins
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm mt-1 max-w-2xl">
            Real-time notifications on co-curricular enrollment deadlines, championship honors, facility expansions, and leadership updates.
          </p>
        </div>

        {/* Admin Broadcast Button (Only in Admin Mode) */}
        {canLiveEdit && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-[#c5832b] hover:from-amber-700 hover:to-[#a96721] text-white text-xs font-bold shadow-md shadow-amber-900/20 transition-all cursor-pointer flex-shrink-0"
            id="btn-admin-add-announcement"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast New Announcement</span>
          </button>
        )}
      </div>

      {/* 1. Minimized Top Featured Dispatch Card */}
      {heroAnnouncement && (
        <div 
          onClick={() => setSelectedAnnouncementForDetail(heroAnnouncement)}
          className={`group relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#12141c] via-[#171a26] to-[#0e1017] border transition-all duration-300 shadow-lg cursor-pointer ${
            canLiveEdit 
              ? 'border-2 border-dashed border-amber-400' 
              : 'border-zinc-800 hover:border-amber-500/70 hover:shadow-xl hover:shadow-amber-500/10'
          }`}
          id={`hero-announcement-${heroAnnouncement.id}`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
            {/* Compact Thumbnail Container */}
            <div className="relative w-full sm:w-56 md:w-64 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-zinc-900">
              <img 
                src={heroAnnouncement.coverImage || presetImages[0].url} 
                alt={heroAnnouncement.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#0e1017]/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getPriorityBadgeClass(heroAnnouncement.priority)}`}>
                  {heroAnnouncement.badgeText || 'FEATURED'}
                </span>
              </div>
            </div>

            {/* Minimized Content Body */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between min-w-0 w-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <span className="text-amber-400 font-semibold">{heroAnnouncement.category || 'Lab Dispatch'}</span>
                    <span>&bull;</span>
                    <span>{heroAnnouncement.date}</span>
                    {heroAnnouncement.readTime && (
                      <>
                        <span>&bull;</span>
                        <span>{heroAnnouncement.readTime}</span>
                      </>
                    )}
                  </div>

                  {heroAnnouncement.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Pin className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span>PINNED</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug tracking-tight line-clamp-2">
                  {heroAnnouncement.title}
                </h3>

                <p className="text-xs text-zinc-300 mt-1.5 line-clamp-2 leading-relaxed">
                  {heroAnnouncement.summary || heroAnnouncement.content}
                </p>
              </div>

              {/* Author & Action Row */}
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3 flex-wrap">
                <div className="text-[11px] text-zinc-400 truncate max-w-[240px]">
                  <span className="font-semibold text-zinc-200">{heroAnnouncement.authorName}</span>
                  <span className="hidden sm:inline text-zinc-500"> &bull; {heroAnnouncement.authorRole}</span>
                </div>

                <div className="flex items-center gap-2">
                  {canLiveEdit && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditModal(heroAnnouncement, e)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-amber-600 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Bulletin"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteAnnouncement(heroAnnouncement.id, e)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Delete Bulletin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionClick(heroAnnouncement);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold transition-all shadow-sm cursor-pointer group/btn"
                  >
                    <span>{heroAnnouncement.actionText || 'Read Details'}</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Grid Below Accommodating Other 2+ Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        {otherAnnouncements.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedAnnouncementForDetail(item)}
            className={`group relative p-5 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
              canLiveEdit
                ? 'border-2 border-dashed border-amber-300 shadow-sm'
                : 'border-zinc-200/90 hover:border-[#c5832b] hover:shadow-lg hover:-translate-y-0.5'
            }`}
            id={`news-card-${item.id}`}
          >
            {/* Admin quick controls */}
            {canLiveEdit && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={(e) => handleTogglePin(item.id, e)}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    item.isPinned ? 'bg-amber-100 text-amber-800' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                  title="Pin to Hero Feature"
                >
                  <Pin className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleOpenEditModal(item, e)}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-amber-100 text-zinc-600 hover:text-amber-800 transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteAnnouncement(item.id, e)}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-red-100 text-zinc-600 hover:text-red-700 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            )}

            <div>
              {/* Category & Date */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-[#a06014] border border-amber-200">
                  {item.category || 'Academy News'}
                </span>
                <span className="text-[11px] text-zinc-400">&bull;</span>
                <span className="text-[11px] text-zinc-500">{item.date}</span>
              </div>

              {/* Title */}
              <h4 className="text-sm sm:text-base font-bold text-zinc-900 group-hover:text-[#b46d1c] transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h4>

              {/* Summary */}
              <p className="text-xs text-zinc-600 mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {item.summary || item.content}
              </p>
            </div>

            {/* Footer with Author & Action link */}
            <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-zinc-400 font-medium truncate max-w-[150px]">
                {item.authorName}
              </span>
              
              <span className="font-bold text-[#b46d1c] group-hover:text-[#8b500e] inline-flex items-center gap-1 transition-colors">
                <span>Read Details</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        ))}

        {/* If Live Edit Mode is Active: Add Card Placeholder */}
        {canLiveEdit && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="p-6 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/30 hover:bg-amber-50/80 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[160px]"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-amber-900">Add News / Dispatch Item</span>
            <span className="text-[11px] text-amber-700/80 mt-0.5">Post a new urgent bulletin or student article</span>
          </button>
        )}
      </div>

      {/* 4. Full Read Detail Modal */}
      {selectedAnnouncementForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-zinc-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header Image */}
            {selectedAnnouncementForDetail.coverImage && (
              <div className="relative h-48 sm:h-56 w-full bg-zinc-900 overflow-hidden flex-shrink-0">
                <img 
                  src={selectedAnnouncementForDetail.coverImage} 
                  alt={selectedAnnouncementForDetail.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <button
                  type="button"
                  onClick={() => setSelectedAnnouncementForDetail(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-6 right-6">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${getPriorityBadgeClass(selectedAnnouncementForDetail.priority)}`}>
                    {selectedAnnouncementForDetail.badgeText || selectedAnnouncementForDetail.category || 'OFFICIAL DISPATCH'}
                  </span>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="font-bold text-[#b46d1c]">{selectedAnnouncementForDetail.category || 'Academy Notice'}</span>
                <span>&bull;</span>
                <span>{selectedAnnouncementForDetail.date}</span>
                {selectedAnnouncementForDetail.readTime && (
                  <>
                    <span>&bull;</span>
                    <span>{selectedAnnouncementForDetail.readTime}</span>
                  </>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 leading-tight">
                {selectedAnnouncementForDetail.title}
              </h3>

              {selectedAnnouncementForDetail.summary && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                  {selectedAnnouncementForDetail.summary}
                </div>
              )}

              <div className="text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-3 whitespace-pre-line">
                {selectedAnnouncementForDetail.content}
              </div>

              {/* Author signature footer */}
              <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-zinc-400">Published By</div>
                  <div className="text-sm font-bold text-zinc-900">{selectedAnnouncementForDetail.authorName}</div>
                  <div className="text-xs text-zinc-500">{selectedAnnouncementForDetail.authorRole}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAnnouncementForDetail(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const item = selectedAnnouncementForDetail;
                      setSelectedAnnouncementForDetail(null);
                      handleActionClick(item);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{selectedAnnouncementForDetail.actionText || 'Take Action'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Admin Live Edit / Create Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-amber-300 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950">
                    {announcements.some(a => a.id === editingItem.id) ? 'Edit Announcement Bulletin' : 'Broadcast New Announcement'}
                  </h3>
                  <p className="text-xs text-zinc-500">Live Administrator Publishing Tool</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-zinc-800 mb-1">Headline / Title *</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Fall 2026 Co-Curricular Enrollment Window Now Open"
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs font-semibold text-zinc-900"
                />
              </div>

              {/* Category & Priority & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Category</label>
                  <select
                    value={editingItem.category || 'Breaking News'}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="Breaking News">Breaking News</option>
                    <option value="Urgent Notice">Urgent Notice</option>
                    <option value="Championship">Championship / Honor</option>
                    <option value="Facility">Facility Update</option>
                    <option value="Event">Event / Gala</option>
                    <option value="Academic">Academic Olympiad</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Priority Level</label>
                  <select
                    value={editingItem.priority || 'normal'}
                    onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="breaking">🔥 Breaking (Pulsing Red)</option>
                    <option value="urgent">⚡ Urgent (Amber)</option>
                    <option value="high">🌟 High (Emerald)</option>
                    <option value="normal">Standard (Slate)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingItem.badgeText || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badgeText: e.target.value })}
                    placeholder="e.g. 🔥 FLASH BULLETIN"
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs text-zinc-900"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block font-bold text-zinc-800 mb-1">Summary / Lead Paragraph</label>
                <textarea
                  rows={2}
                  value={editingItem.summary || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, summary: e.target.value })}
                  placeholder="Short, high-impact summary displayed on cards..."
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs text-zinc-900 leading-relaxed"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block font-bold text-zinc-800 mb-1">Full Article / Dispatch Content</label>
                <textarea
                  rows={4}
                  value={editingItem.content || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  placeholder="Full text of the announcement..."
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs text-zinc-900 leading-relaxed"
                />
              </div>

              {/* Cover Image URL & Presets */}
              <div>
                <label className="block font-bold text-zinc-800 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingItem.coverImage || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, coverImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs text-zinc-900 font-mono mb-2"
                />
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-zinc-500">Preset Images:</span>
                  {presetImages.map(img => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, coverImage: img.url })}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-amber-100 text-zinc-700 hover:text-amber-900 border border-zinc-200 transition-colors cursor-pointer"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button Label & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Action Button Text</label>
                  <input
                    type="text"
                    value={editingItem.actionText || 'Explore & Register'}
                    onChange={(e) => setEditingItem({ ...editingItem, actionText: e.target.value })}
                    placeholder="e.g. Register for Clubs Now"
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Action Destination</label>
                  <select
                    value={editingItem.actionType || 'register'}
                    onChange={(e) => setEditingItem({ ...editingItem, actionType: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs bg-white"
                  >
                    <option value="register">Open Student Registration</option>
                    <option value="login">Open Student Login</option>
                    <option value="catalog">Scroll to Club Catalog</option>
                  </select>
                </div>
              </div>

              {/* Author & Pin State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Publisher / Author</label>
                  <input
                    type="text"
                    value={editingItem.authorName || 'Mr. Wondwossen Erqiyhun'}
                    onChange={(e) => setEditingItem({ ...editingItem, authorName: e.target.value })}
                    placeholder="Author name"
                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-amber-500 text-xs text-zinc-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-800">
                    <input
                      type="checkbox"
                      checked={!!editingItem.isPinned}
                      onChange={(e) => setEditingItem({ ...editingItem, isPinned: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Pin as Featured Hero Bulletin</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveAnnouncement}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-[#c5832b] hover:from-amber-700 hover:to-[#a96721] text-xs font-bold text-white transition-all shadow-md cursor-pointer"
              >
                Publish Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
