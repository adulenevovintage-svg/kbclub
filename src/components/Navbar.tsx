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
  CheckCircle2
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

  const roleMeta = {
    student: {
      label: 'Student Portal',
      icon: GraduationCap,
      badge: 'Grade 11',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Explore clubs, track memberships & proposal charters'
    },
    teacher: {
      label: 'Faculty Advisor',
      icon: BookOpen,
      badge: 'STEM Division',
      color: 'bg-[#c5832b]/15 text-[#e5a93c] border-[#c5832b]/30',
      description: 'Review registrations, mark attendance & schedule'
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
    <header className="sticky top-0 z-40 w-full border-b border-[#232730] bg-[#0c0d10]/95 backdrop-blur-md">
      {/* Top micro-bar for official academy announcement / status */}
      <div className="bg-[#121419] border-b border-[#1c1f26] px-4 py-1.5 text-xs text-zinc-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#c5832b] animate-pulse"></span>
          <span className="font-semibold tracking-wider text-zinc-200">KB ACADEMY</span>
          <span className="text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-400">Co-Curricular & Student Operations Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <CalendarCheck className="w-3.5 h-3.5 text-[#c5832b]" />
            <span>Fall 2026 Registration:</span>
            {registrationOpen ? (
              <span className="text-emerald-400 font-medium">Active (14 Days Left)</span>
            ) : (
              <span className="text-rose-400 font-medium">Closed</span>
            )}
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
            <div className="relative w-10 h-10 rounded-lg bg-white border border-[#c5832b]/50 p-0.5 flex items-center justify-center shadow-md shadow-black/40 group-hover:border-[#c5832b] transition-colors overflow-hidden">
              <img 
                src="https://cdn.phototourl.com/free/2026-09-19-d8f0f13c-5886-4de1-b7ba-8996d63ce1a3.jpg"
                alt="KB Academy Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-[#c5832b] rounded-full border-2 border-[#0c0d10]"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-crest text-base font-bold tracking-wide text-white group-hover:text-[#c5832b] transition-colors">
                  KB ACADEMY
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c5832b]/20 text-[#e5a93c] font-mono font-medium border border-[#c5832b]/30">
                  DIGITAL
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-normal">Operations & Club Management</p>
            </div>
          </button>

          {/* Primary View Mode Switcher */}
          <div className="hidden md:flex items-center ml-4 pl-4 border-l border-[#232730] bg-[#14161d] p-1 rounded-lg border border-[#232730]">
            <button
              onClick={() => setCurrentView('landing')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                currentView === 'landing'
                  ? 'bg-[#c5832b] text-white shadow-sm shadow-[#c5832b]/20 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
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
                  ? 'bg-[#c5832b] text-white shadow-sm shadow-[#c5832b]/20 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
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

          {/* Interactive Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#14161d] border border-[#232730] hover:border-[#c5832b]/60 transition-all text-left"
              id="role-dropdown-trigger"
            >
              <div className="relative">
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover border border-[#c5832b]/40"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-[#0c0d10]"></span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-zinc-100">{currentUser.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${roleMeta[activeRole].color}`}>
                    {activeRole.toUpperCase()}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 truncate max-w-[130px]">
                  {currentUser.title || roleMeta[activeRole].label}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {/* Dropdown Menu */}
            {showRoleDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowRoleDropdown(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#14161d] border border-[#2a2e3a] shadow-2xl p-2 z-40 animate-in fade-in-50 duration-150">
                  <div className="px-3 py-2 border-b border-[#232730] mb-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Switch Active Persona
                    </div>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      Explore the system through different stakeholder perspectives.
                    </p>
                  </div>

                  {(['student', 'teacher', 'director'] as UserRole[]).map((role) => {
                    const info = users[role];
                    const meta = roleMeta[role];
                    const RoleIcon = meta.icon;
                    const isSelected = activeRole === role;

                    return (
                      <button
                        key={role}
                        onClick={() => {
                          setActiveRole(role);
                          setShowRoleDropdown(false);
                          if (currentView === 'landing') {
                            setCurrentView('operations');
                          }
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-all mb-1 ${
                          isSelected
                            ? 'bg-[#1e222d] border border-[#c5832b]/50 shadow-sm'
                            : 'hover:bg-[#191c24] border border-transparent'
                        }`}
                        id={`switch-role-${role}`}
                      >
                        <div className="p-2 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-[#c5832b]">
                          <RoleIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                              {info.name}
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#c5832b]" />}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${meta.color}`}>
                              {role.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                            {info.title || meta.label}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1">
                            {meta.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Quick Action Button */}
          {currentView === 'landing' ? (
            <button
              onClick={() => setCurrentView('operations')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-semibold transition-all shadow-md shadow-[#c5832b]/20"
              id="nav-enter-platform"
            >
              Launch Portal
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('landing')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191c24] hover:bg-[#232732] border border-[#2e3340] text-zinc-300 hover:text-white text-xs font-medium transition-all"
              id="nav-view-showcase"
            >
              <Compass className="w-3.5 h-3.5 text-[#c5832b]" />
              Showcase
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
