import React from 'react';
import { Announcement } from '../types';
import { X, Bell, Megaphone, AlertCircle, CheckCircle, Calendar, Sparkles } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  announcements,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#12141a] border-l border-[#232730] text-zinc-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#1f232c] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#c5832b]/20 text-[#c5832b]">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Academy Bulletins</h3>
                <p className="text-xs text-zinc-400">Co-curricular announcements & updates</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#1c1f28]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of announcements */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {announcements.map((item) => {
              const isUrgent = item.priority === 'urgent';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUrgent
                      ? 'bg-rose-500/5 border-rose-500/30'
                      : 'bg-[#0c0d10] border-[#1f232c] hover:border-[#2a2e3a]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white leading-snug">
                      {item.title}
                    </span>
                    {isUrgent && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shrink-0">
                        URGENT
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                    {item.content}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-[#1a1c24]">
                    <span>{item.authorName} &bull; {item.authorRole}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-[#1f232c] bg-[#0c0d10] text-[11px] text-center text-zinc-500">
            KB Academy Digital Platform &bull; Real-time Operations Feed
          </div>
        </div>
      </div>
    </div>
  );
};
