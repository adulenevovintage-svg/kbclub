import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { 
  Compass, 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Bell, 
  ChevronDown,
  Sparkles,
  ExternalLink,
  CalendarCheck,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'operations';
  setCurrentView: (view: 'landing' | 'operations') => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  users: Record<string, UserProfile>;
  unreadCount: number;
  onOpenNotifications: () => void;
  registrationOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activeRole,
  setActiveRole,
  users,
  unreadCount,
  onOpenNotifications,
  registrationOpen,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const currentUser = users[activeRole];

  const roleMeta: Record<string, { label: string; icon: any; badge: string; color: string; description: string }> = {
    student: {
      label: 'Student Portal',
      icon: GraduationCap,
      badge: 'Grade 11',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Explore clubs, track memberships & proposal charters'
    },
    director: {
      label: 'Student Life Director',
      icon: ShieldCheck,
      badge: 'Administration',
      color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      description: 'Charter governance, analytics & room compliance'
    },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md text-zinc-900 shadow-xs">
      {/* Top micro-bar for official academy announcement / status */}
      <div className="bg-zinc-100 border-b border-zinc-200 px-4 py-1.5 text-xs text-zinc-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#c5832b] animate-pulse"></span>
          <span className="font-semibold tracking-wider text-zinc-800">KB ACADEMY</span>
          <span className="text-zinc-400">|</span>
          <span className="hidden sm:inline text-zinc-600">Co-Curricular & Student Operations Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-zinc-700 font-medium">
            <span>Official Student & Staff Portal</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Crest */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
            id="nav-brand-button"
          >
            <div className="relative w-10 h-10 rounded-lg bg-white border border-[#c5832b]/50 p-0.5 flex items-center justify-center shadow-sm group-hover:border-[#c5832b] transition-colors overflow-hidden">
              <img 
                src="https://cdn.phototourl.com/free/2026-09-19-d8f0f13c-5886-4de1-b7ba-8996d63ce1a3.jpg"
                alt="KB Academy Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#c5832b] rounded-full border-2 border-white"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-crest text-base font-bold tracking-wide text-zinc-900 group-hover:text-[#c5832b] transition-colors">
                  KB ACADEMY
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-mono font-medium border border-amber-200">
                  DIGITAL
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-normal">Operations & Club Management</p>
            </div>
          </button>

          {/* Primary View Mode Switcher */}
          <div className="hidden md:flex items-center ml-4 pl-4 border-l border-zinc-200 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button
              onClick={() => setCurrentView('landing')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'landing'
                  ? 'bg-[#c5832b] text-white shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              id="view-switch-landing"
            >
              <Compass className="w-3.5 h-3.5" />
              Showcase
            </button>
            <button
              onClick={() => setCurrentView('operations')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'operations'
                  ? 'bg-[#c5832b] text-white shadow-xs font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
              id="view-switch-operations"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Operations System
            </button>
          </div>
        </div>

        {/* Right Actions: Role Switcher & Notifications */}
        <div className="flex items-center gap-3">
          {/* Notifications Icon */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-[#14161d] border border-[#232730] text-zinc-300 hover:text-white hover:border-[#c5832b]/50 transition-colors"
            title="Notifications & Announcements"
            id="btn-notifications-open"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c5832b] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0c0d10]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Student Profile Info Card (No account/persona switching) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-[#c5832b]/60 transition-all text-left shadow-xs"
              id="role-dropdown-trigger"
            >
              <div className="relative">
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover border border-[#c5832b]/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white"></span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-900">{currentUser.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
                    STUDENT
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 truncate max-w-[130px]">
                  {currentUser.title || `Grade ${currentUser.grade || 11}`}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {/* Profile Popover (No switching between accounts) */}
            {showRoleDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowRoleDropdown(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-zinc-200 shadow-2xl p-4 z-40 animate-in fade-in-50 duration-150 text-zinc-900">
                  <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 mb-3">
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-[#c5832b]/40 shadow-xs"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{currentUser.name}</h4>
                      <p className="text-[11px] text-zinc-500 font-mono">{currentUser.studentIdNumber || currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                        Grade {currentUser.grade || 11}{currentUser.section ? `-${currentUser.section}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-zinc-600 mb-3">
                    <div className="flex justify-between py-1 border-b border-zinc-50">
                      <span>Status:</span>
                      <span className="font-semibold text-emerald-600">Active Account</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-50">
                      <span>Email:</span>
                      <span className="font-medium text-zinc-800 truncate max-w-[160px]">{currentUser.email}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      setCurrentView('landing');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>← Return to Main Website</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Quick Action Button */}
          {currentView === 'landing' ? (
            <button
              onClick={() => setCurrentView('operations')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-semibold transition-all shadow-md shadow-[#c5832b]/20 cursor-pointer"
              id="nav-enter-platform"
            >
              Launch Portal
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191c24] hover:bg-[#252a36] border border-[#303648] hover:border-[#c5832b] text-zinc-200 hover:text-white text-xs font-bold transition-all cursor-pointer group shadow-sm"
              id="nav-view-showcase"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#c5832b] group-hover:-translate-x-0.5 transition-transform" />
              <span>Main Website</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
