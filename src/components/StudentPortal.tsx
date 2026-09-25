import React, { useState, useMemo } from 'react';
import { Club, Registration, ClubCategory, UpcomingMeeting, UserProfile } from '../types';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  GraduationCap, 
  Users, 
  ChevronRight, 
  PlusCircle, 
  FileText, 
  Sparkles,
  BookOpen,
  CalendarCheck,
  Send,
  XCircle,
  Clock3,
  Building2,
  ExternalLink,
  Copy,
  Check,
  IdCard,
  UserCheck,
  LogOut,
  ShieldCheck,
  ArrowLeft,
  Settings
} from 'lucide-react';

interface StudentPortalProps {
  student: UserProfile;
  clubs: Club[];
  registrations: Registration[];
  onRegisterClick: (club: Club) => void;
  onSelectClub: (club: Club) => void;
  onOpenCharterModal: () => void;
  onDropClub: (registrationId: string) => void;
  onOpenIdCard?: () => void;
  onOpenAdminLogin?: () => void;
  isAdminAuthenticated?: boolean;
  onOpenClubOwnerPortal?: () => void;
  onSaveAndExitAdmin?: () => void;
  pendingRegistrationsCount?: number;
  onAddToast?: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
  onBackToLanding?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  clubs,
  registrations,
  onRegisterClick,
  onSelectClub,
  onOpenCharterModal,
  onDropClub,
  onOpenIdCard,
  onOpenAdminLogin,
  isAdminAuthenticated,
  onOpenClubOwnerPortal,
  onSaveAndExitAdmin,
  pendingRegistrationsCount,
  onAddToast,
  onBackToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'my-clubs' | 'schedule'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const studentIdNumber = student.studentIdNumber || student.id;

  const handleCopyId = () => {
    navigator.clipboard.writeText(studentIdNumber);
    setCopiedId(true);
    if (onAddToast) {
      onAddToast('success', 'Student ID Copied', `Copied ${studentIdNumber} to clipboard.`);
    }
    setTimeout(() => setCopiedId(false), 3000);
  };

  // Student's active registrations
  const myRegistrations = useMemo(() => {
    return registrations.filter(r => r.studentId === student.id);
  }, [registrations, student.id]);

  const myEnrolledClubIds = useMemo(() => {
    return new Set(
      myRegistrations
        .filter(r => r.status === 'enrolled')
        .map(r => r.clubId)
    );
  }, [myRegistrations]);

  const myPendingClubIds = useMemo(() => {
    return new Set(
      myRegistrations
        .filter(r => r.status === 'pending')
        .map(r => r.clubId)
    );
  }, [myRegistrations]);

  // Build map of student's occupied time slot keys (e.g. "Tuesday-1545" -> "Robotics...")
  const occupiedTimeSlots = useMemo(() => {
    const slotMap = new Map<string, { clubName: string; time: string; day: string }>();
    myRegistrations
      .filter(r => r.status === 'enrolled')
      .forEach(reg => {
        const club = clubs.find(c => c.id === reg.clubId);
        if (club) {
          slotMap.set(club.timeSlotKey, {
            clubName: club.name,
            time: club.meetingTime,
            day: club.meetingDay
          });
        }
      });
    return slotMap;
  }, [myRegistrations, clubs]);

  // Categories list
  const categories = [
    'All',
    'STEM & Technology',
    'Debate & Leadership',
    'Arts & Performance',
    'Civics & Culture',
    'Academic Olympiad'
  ];

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Filtered clubs
  const filteredClubs = useMemo(() => {
    return clubs.filter(club => {
      // Search
      const matchesSearch = 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.advisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCat = selectedCategory === 'All' || club.category === selectedCategory;

      // Day
      const matchesDay = selectedDay === 'All' || club.meetingDay === selectedDay;

      // Available
      const matchesAvailable = !onlyAvailable || club.enrolledCount < club.capacity;

      return matchesSearch && matchesCat && matchesDay && matchesAvailable;
    });
  }, [clubs, searchQuery, selectedCategory, selectedDay, onlyAvailable]);

  // Calculate attendance score
  const totalAttended = myRegistrations.reduce((acc, r) => acc + (r.attendedSessions || 0), 0);
  const totalSessions = myRegistrations.reduce((acc, r) => acc + (r.totalSessions || 0), 0);
  const attendanceRate = totalSessions > 0 ? Math.round((totalAttended / totalSessions) * 100) : 100;

  return (
    <div className="space-y-8">
      {/* Student Welcome & Status Overview */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#161228] via-[#110e1f] to-[#0a0814] border border-[#2e264a] shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative flex-shrink-0">
              <img 
                src={student.avatarUrl} 
                alt={student.name} 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#c5832b]/60 shadow-lg"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-md bg-[#c5832b] text-white text-[11px] font-bold shadow-sm">
                Gr {student.grade || 11}{student.section ? `-${student.section}` : ''}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{student.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                  Active Scholar
                </span>
                {student.section && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                    Section {student.section}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 flex-wrap text-xs pt-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b0c14] border border-amber-500/30 text-amber-300 font-mono shadow-inner">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Student ID:</span>
                  <span className="font-bold text-emerald-400 text-sm">{studentIdNumber}</span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="ml-1 text-zinc-400 hover:text-white cursor-pointer p-0.5"
                    title="Copy Student ID"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <p className="text-xs text-zinc-400">
                  {student.email}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="px-5 py-3 rounded-2xl bg-[#0b0c14]/90 border border-[#282240] shadow-inner text-center">
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Enrolled Clubs</div>
              <div className="text-xl font-bold text-white flex items-center justify-center gap-1.5 mt-0.5">
                <span className="text-[#c5832b]">{myEnrolledClubIds.size}</span>
                <span className="text-xs text-zinc-500 font-normal">/ 3 max</span>
              </div>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-[#0b0c14]/90 border border-[#282240] shadow-inner text-center">
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium">Attendance</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">
                {attendanceRate}%
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar (Spacious & Clean) */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-4 border-t border-[#292242]">
          <div className="flex items-center gap-2.5 flex-wrap">
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a1d27] hover:bg-[#252a3a] text-zinc-200 hover:text-white border border-[#353b4f] text-xs font-bold transition-all cursor-pointer shadow-sm group"
                id="btn-student-portal-back-home"
              >
                <ArrowLeft className="w-4 h-4 text-[#c5832b] group-hover:-translate-x-1 transition-transform" />
                <span>Main Website</span>
              </button>
            )}

            {onOpenIdCard && (
              <button
                type="button"
                onClick={onOpenIdCard}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <IdCard className="w-4 h-4 text-amber-400" />
                <span>Digital ID Card</span>
              </button>
            )}



            {onOpenAdminLogin && (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm border ${
                  isAdminAuthenticated 
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/60'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/50'
                }`}
                title="Club Owner / Admin Settings (Passcode: kb@2019)"
                id="btn-student-portal-admin-settings"
              >
                <Settings className={`w-4 h-4 ${isAdminAuthenticated ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} />
                <span>{isAdminAuthenticated ? 'Club Owner Mode Active' : 'Club Owner Settings'}</span>
              </button>
            )}

            {isAdminAuthenticated && onOpenClubOwnerPortal && (
              <button
                type="button"
                onClick={onOpenClubOwnerPortal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-extrabold transition-all cursor-pointer shadow-lg animate-pulse"
                id="btn-club-owner-registration-portal"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Review Registration Requests ({pendingRegistrationsCount || 0})</span>
              </button>
            )}

            {isAdminAuthenticated && onSaveAndExitAdmin && (
              <button
                type="button"
                onClick={onSaveAndExitAdmin}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg"
                id="btn-club-owner-save-exit"
              >
                <Check className="w-4 h-4" />
                <span>Save & Exit Club Owner Mode</span>
              </button>
            )}
          </div>

          <button
            onClick={onOpenCharterModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold transition-all shadow-md shadow-[#c5832b]/30 cursor-pointer"
            id="student-propose-charter-btn"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Propose New Club</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center justify-between border-b border-[#232730] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-[#c5832b] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
            }`}
            id="tab-catalog"
          >
            <Search className="w-3.5 h-3.5" />
            Club Catalog & Registration
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
              {clubs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('my-clubs')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'my-clubs'
                ? 'bg-[#c5832b] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
            }`}
            id="tab-my-clubs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            My Enrolled Clubs
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
              {myRegistrations.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-[#c5832b] text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
            }`}
            id="tab-schedule"
          >
            <Calendar className="w-3.5 h-3.5" />
            Weekly Schedule & Conflicts
          </button>
        </div>
      </div>

      {/* TAB 1: CATALOG & REGISTRATION */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-[#12141a] border border-[#232730] space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clubs by keyword, advisor, tag (e.g., Robotics, Ethics, CAD)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#c5832b] transition-colors"
                  id="catalog-search-input"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="px-3 py-2.5 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-zinc-200 focus:outline-none focus:border-[#c5832b]"
                  id="catalog-day-filter"
                >
                  {days.map(d => (
                    <option key={d} value={d}>
                      {d === 'All' ? 'All Days' : d}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="accent-[#c5832b] rounded"
                    id="catalog-available-checkbox"
                  />
                  <span>Open Spots Only</span>
                </label>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-zinc-500 flex items-center gap-1 shrink-0 font-medium">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#c5832b] text-white font-semibold'
                      : 'bg-[#181a22] text-zinc-400 hover:text-white border border-[#232730]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => {
              const isEnrolled = myEnrolledClubIds.has(club.id);
              const isPending = myPendingClubIds.has(club.id);
              const isFull = club.enrolledCount >= club.capacity;
              const conflictWith = occupiedTimeSlots.get(club.timeSlotKey);
              const hasConflict = !!conflictWith && !isEnrolled;
              const percentFilled = Math.round((club.enrolledCount / club.capacity) * 100);

              return (
                <div
                  key={club.id}
                  className={`rounded-2xl bg-[#12141a] border transition-all flex flex-col justify-between overflow-hidden shadow-md hover:shadow-xl ${
                    hasConflict
                      ? 'border-amber-500/40 bg-gradient-to-b from-[#161412] to-[#12141a]'
                      : 'border-[#232730] hover:border-[#c5832b]/60'
                  }`}
                  id={`club-card-${club.id}`}
                >
                  <div>
                    {/* Cover image */}
                    <div className="relative h-40 w-full overflow-hidden bg-zinc-900 group cursor-pointer" onClick={() => onSelectClub(club)}>
                      <img 
                        src={club.coverImage} 
                        alt={club.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] via-[#12141a]/40 to-transparent"></div>
                      
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[#e5a93c] border border-[#c5832b]/40 font-medium">
                          {club.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-zinc-300 font-mono font-medium">
                          {club.code}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-300">
                        <span className="flex items-center gap-1 font-mono text-zinc-300">
                          <MapPin className="w-3 h-3 text-[#c5832b]" />
                          {club.room}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          Chartered {club.charterYear}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 
                        onClick={() => onSelectClub(club)}
                        className="text-base font-bold text-white hover:text-[#c5832b] cursor-pointer transition-colors line-clamp-1"
                      >
                        {club.name}
                      </h3>
                      
                      <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {club.tagline}
                      </p>

                      {/* Schedule info */}
                      <div className="mt-4 p-2.5 rounded-xl bg-[#0c0d10] border border-[#1f232c] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <Calendar className="w-3.5 h-3.5 text-[#c5832b]" />
                          <span className="font-semibold">{club.meetingDay}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-400">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{club.meetingTime}</span>
                        </div>
                      </div>

                      {/* Advisor */}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Advisor: <strong className="text-zinc-200">{club.advisorName}</strong></span>
                        <span>Dues: <strong className="text-zinc-200">${club.duesPerSemester}</strong></span>
                      </div>

                      {/* Schedule Conflict Notice if detected */}
                      {hasConflict && (
                        <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">Schedule Conflict:</span> Overlaps with your enrolled club{' '}
                            <strong>{conflictWith.clubName}</strong> ({conflictWith.day} {conflictWith.time}).
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer with capacity and action */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-[#1f232c] space-y-3">
                      {/* Capacity bar */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-zinc-400">Enrollment</span>
                          <span className="font-medium text-zinc-300">
                            {club.enrolledCount} / {club.capacity} {isFull ? '(Full)' : `(${club.capacity - club.enrolledCount} left)`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#1f232c] rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              isFull ? 'bg-rose-500' : percentFilled >= 80 ? 'bg-amber-400' : 'bg-[#c5832b]'
                            }`}
                            style={{ width: `${Math.min(100, percentFilled)}%` }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectClub(club)}
                          className="flex-1 py-2 px-3 rounded-lg bg-[#181a22] hover:bg-[#222530] text-zinc-300 hover:text-white text-xs font-medium transition-colors text-center"
                        >
                          Details & Syllabus
                        </button>

                        {isEnrolled ? (
                          <div className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Enrolled</span>
                          </div>
                        ) : isPending ? (
                          <div className="flex items-center gap-1.5 py-2 px-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                            <Clock3 className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => onRegisterClick(club)}
                            disabled={hasConflict}
                            className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              hasConflict
                                ? 'bg-[#1f232c] text-zinc-500 cursor-not-allowed'
                                : isFull
                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                : 'bg-[#c5832b] hover:bg-[#a96721] text-white shadow-sm shadow-[#c5832b]/20'
                            }`}
                            id={`btn-register-${club.id}`}
                          >
                            <span>{isFull ? 'Waitlist' : 'Register'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredClubs.length === 0 && (
            <div className="p-12 text-center rounded-2xl bg-[#12141a] border border-[#232730]">
              <Search className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white">No clubs match your filters</h4>
              <p className="text-xs text-zinc-400 mt-1">Try resetting your search query or category filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedDay('All');
                  setOnlyAvailable(false);
                }}
                className="mt-4 px-4 py-1.5 rounded-lg bg-[#1e222d] text-xs text-zinc-200 hover:text-white"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ENROLLED CLUBS */}
      {activeTab === 'my-clubs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Active Memberships & Applications</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Manage your current co-curricular commitments and verify attendance records.</p>
            </div>
          </div>

          {myRegistrations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#12141a] border border-[#232730]">
              <GraduationCap className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">You have not registered for any clubs yet</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Explore KB Academy's 8 accredited clubs and register before the Fall semester deadline.
              </p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="mt-4 px-4 py-2 rounded-lg bg-[#c5832b] text-xs font-semibold text-white hover:bg-[#a96721]"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRegistrations.map(reg => {
                const club = clubs.find(c => c.id === reg.clubId);
                const isApproved = reg.status === 'enrolled';

                return (
                  <div 
                    key={reg.id}
                    className="p-5 rounded-2xl bg-[#12141a] border border-[#232730] hover:border-[#2f3545] transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {club ? (
                          <img 
                            src={club.coverImage} 
                            alt={club.name} 
                            className="w-16 h-16 rounded-xl object-cover border border-[#232730] shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-[#1c1f26] flex items-center justify-center text-zinc-400">
                            <BookOpen className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-white">{reg.clubName}</h3>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                              reg.status === 'enrolled'
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : reg.status === 'pending'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            }`}>
                              {reg.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#c5832b]" />
                              {reg.meetingDay}, {reg.meetingTime}
                            </span>
                            {club && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                                {club.room}
                              </span>
                            )}
                            <span className="text-zinc-500">
                              Registered: {reg.registrationDate}
                            </span>
                          </div>

                          {reg.advisorNotes && (
                            <div className="mt-3 text-xs text-zinc-300 bg-[#0d0f14] p-2.5 rounded-lg border border-[#1f232c]">
                              <strong className="text-[#c5832b]">Advisor Note:</strong> {reg.advisorNotes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side stats & actions */}
                      <div className="flex items-center gap-4 self-end lg:self-auto">
                        {isApproved && (
                          <div className="text-right">
                            <div className="text-xs text-zinc-400">Attendance</div>
                            <div className="text-sm font-bold text-emerald-400 mt-0.5">
                              {reg.attendedSessions} / {reg.totalSessions} Sessions
                            </div>
                          </div>
                        )}

                        {club && (
                          <button
                            onClick={() => onSelectClub(club)}
                            className="px-3 py-1.5 rounded-lg bg-[#181a22] hover:bg-[#202430] border border-[#2a2e3a] text-xs text-zinc-200 hover:text-white transition-colors"
                          >
                            View Syllabus
                          </button>
                        )}

                        <button
                          onClick={() => onDropClub(reg.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors"
                          title="Withdraw registration"
                        >
                          Withdraw
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WEEKLY SCHEDULE & CONFLICT AUDIT */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">Weekly Co-Curricular Schedule Grid</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Visual timetable of your enrolled club meetings Monday through Friday.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
              const dayRegistrations = myRegistrations.filter(r => r.meetingDay === day && r.status === 'enrolled');

              return (
                <div 
                  key={day} 
                  className="rounded-xl bg-[#12141a] border border-[#232730] p-4 flex flex-col min-h-[220px]"
                >
                  <div className="pb-3 border-b border-[#1f232c] flex items-center justify-between">
                    <span className="font-semibold text-xs text-white">{day}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1c1f26] text-zinc-400 font-mono">
                      {dayRegistrations.length} {dayRegistrations.length === 1 ? 'Slot' : 'Slots'}
                    </span>
                  </div>

                  <div className="flex-1 mt-3 space-y-2">
                    {dayRegistrations.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-zinc-600">
                        No club scheduled
                      </div>
                    ) : (
                      dayRegistrations.map(reg => {
                        const club = clubs.find(c => c.id === reg.clubId);
                        return (
                          <div 
                            key={reg.id}
                            className="p-3 rounded-lg bg-gradient-to-br from-[#1c1f28] to-[#14161f] border border-[#c5832b]/40 shadow-sm"
                          >
                            <div className="text-[10px] text-[#e5a93c] font-semibold uppercase tracking-wider">
                              {reg.meetingTime}
                            </div>
                            <div className="text-xs font-bold text-white mt-1 line-clamp-1">
                              {reg.clubName}
                            </div>
                            {club && (
                              <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
                                <MapPin className="w-2.5 h-2.5 text-[#c5832b]" />
                                {club.room}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
