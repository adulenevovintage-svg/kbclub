import React, { useState } from 'react';
import { UserRole, Club, WebsiteContent, ClubCategory } from '../types';
import { 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  CalendarClock, 
  Users, 
  Building2, 
  Award, 
  CheckCircle, 
  Zap, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Compass,
  Search,
  ExternalLink,
  Settings,
  Edit3,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Lock,
  Unlock,
  CheckCircle2,
  X
} from 'lucide-react';
import { PhotoEditModal } from './PhotoEditModal';

interface LandingViewProps {
  onEnterRole: (role: UserRole) => void;
  clubs: Club[];
  onUpdateClubs: (clubs: Club[]) => void;
  onSelectClub: (club: Club) => void;
  websiteContent: WebsiteContent;
  onUpdateWebsiteContent: (content: WebsiteContent) => void;
  onOpenAdminLogin: () => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (val: boolean) => void;
  onAddToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onEnterRole,
  clubs,
  onUpdateClubs,
  onSelectClub,
  websiteContent,
  onUpdateWebsiteContent,
  onOpenAdminLogin,
  isAdminAuthenticated,
  setIsAdminAuthenticated,
  onAddToast,
}) => {
  const fallbackLogoUrl = 'https://cdn.phototourl.com/free/2026-09-19-d8f0f13c-5886-4de1-b7ba-8996d63ce1a3.jpg';
  const kbLogoUrl = websiteContent?.kbLogoUrl || fallbackLogoUrl;

  // Live editing mode state - strictly false by default, only true if admin authenticated and enabled
  const [isLiveEditing, setIsLiveEditing] = useState<boolean>(false);

  // Automatically enable live editing when admin authenticates with the password
  React.useEffect(() => {
    if (isAdminAuthenticated) {
      setIsLiveEditing(true);
    } else {
      setIsLiveEditing(false);
    }
  }, [isAdminAuthenticated]);

  // Master safeguard: live editing is ONLY allowed and visible when the admin has successfully authenticated
  const canLiveEdit = Boolean(isAdminAuthenticated && isLiveEditing);

  // Photo editing modal state
  const [photoModalState, setPhotoModalState] = useState<{
    isOpen: boolean;
    clubId?: string;
    currentUrl: string;
    title: string;
  }>({
    isOpen: false,
    currentUrl: '',
    title: ''
  });

  // Handler for updating a specific operational pillar
  const handleUpdatePillar = (id: string, field: 'title' | 'description', value: string) => {
    const updatedPillars = websiteContent.realSchoolOps.pillars.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    onUpdateWebsiteContent({
      ...websiteContent,
      realSchoolOps: {
        ...websiteContent.realSchoolOps,
        pillars: updatedPillars
      }
    });
  };

  // Handler for adding a new operational pillar
  const handleAddPillar = () => {
    const newId = `pillar-${Date.now()}`;
    const newPillar = {
      id: newId,
      title: 'New Operational Standard',
      description: 'Describe the logistics, accountability, or procedural workflow here.'
    };
    onUpdateWebsiteContent({
      ...websiteContent,
      realSchoolOps: {
        ...websiteContent.realSchoolOps,
        pillars: [...websiteContent.realSchoolOps.pillars, newPillar]
      }
    });
    onAddToast('success', 'Pillar Added', 'New operational pillar added to Real School Operations.');
  };

  // Handler for deleting a pillar
  const handleDeletePillar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (websiteContent.realSchoolOps.pillars.length <= 1) {
      onAddToast('warning', 'Cannot Delete', 'At least one pillar must remain.');
      return;
    }
    const updatedPillars = websiteContent.realSchoolOps.pillars.filter(p => p.id !== id);
    onUpdateWebsiteContent({
      ...websiteContent,
      realSchoolOps: {
        ...websiteContent.realSchoolOps,
        pillars: updatedPillars
      }
    });
    onAddToast('info', 'Pillar Removed', 'Operational pillar has been deleted.');
  };

  // Handler for updating a club
  const handleUpdateClubField = (clubId: string, field: keyof Club, value: any) => {
    const updated = clubs.map(c => c.id === clubId ? { ...c, [field]: value } : c);
    onUpdateClubs(updated);
  };

  // Handler for deleting a club
  const handleDeleteClub = (clubId: string, clubName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (clubs.length <= 1) {
      onAddToast('warning', 'Cannot Delete', 'At least one club must remain in directory.');
      return;
    }
    const updated = clubs.filter(c => c.id !== clubId);
    onUpdateClubs(updated);
    onAddToast('info', 'Club Removed', `${clubName} was removed from the active directory.`);
  };

  // Handler for adding a new club
  const handleAddNewClub = () => {
    const newId = `club-${Date.now()}`;
    const newClub: Club = {
      id: newId,
      name: 'New Co-Curricular Syndicate',
      code: `KB-SYN-0${clubs.length + 1}`,
      category: 'STEM & Technology',
      tagline: 'Enter a concise mission tagline for this new student organization.',
      description: 'Full syndicate charter description detailing syllabus, objectives, and competition scope.',
      advisorName: 'Faculty Advisor',
      advisorEmail: 'advisor@kbacademy.edu',
      advisorTitle: 'Faculty Advisor',
      studentPresident: 'Student Lead',
      meetingDay: 'Wednesday',
      meetingTime: '3:45 PM – 5:00 PM',
      timeSlotKey: 'Wednesday-1545',
      room: 'Innovation Lab 102',
      building: 'Main Academic Center',
      capacity: 25,
      enrolledCount: 0,
      gradesEligible: [9, 10, 11, 12],
      duesPerSemester: 30,
      prerequisites: 'Open to all interested scholars.',
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      tags: ['Leadership', 'Scholastic'],
      status: 'Active',
      charterYear: 2026,
      allocatedBudget: 1500,
      syllabus: [],
      officers: [],
      upcomingMeetings: []
    };
    onUpdateClubs([newClub, ...clubs]);
    onAddToast('success', 'New Club Added', 'New club created. Scroll down to customize its details and photo directly.');
  };

  return (
    <div className="w-full bg-[#ffffff] text-zinc-900 selection:bg-[#c5832b] selection:text-white pb-16">
      
      {/* 1. Full-Screen Grand Showcase Section (WELCOME PAGE - PRESERVED & UNCHANGED AS REQUESTED) */}
      <section className="relative min-h-screen w-full flex flex-col justify-between items-center text-center overflow-hidden px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-gradient-to-b from-[#ffffff] via-[#fcfbf9] to-[#f5f1e9]">
        {/* Bright, radiant ambient lighting & subtle geometric pattern */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Warm ochre & golden sunlight ambient glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-amber-100/70 via-orange-50/40 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-yellow-100/40 rounded-full blur-3xl" />
          
          {/* Subtle light architectural grid */}
          <div 
            className="w-full h-full opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(#000000 1px, transparent 1px), linear-gradient(90deg, #000000 1px, transparent 1px)`,
              backgroundSize: '56px 56px'
            }}
          />
        </div>

        {/* Center Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center my-auto pt-4 pb-8">
          
          {/* Big KB Academy Crest / Logo */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-300/40 via-orange-200/50 to-amber-400/40 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-2.5 sm:p-3 bg-white rounded-3xl shadow-xl shadow-amber-900/10 border-2 border-amber-200/80 hover:border-[#c5832b] transition-all duration-300 transform hover:scale-105">
              <img
                src={kbLogoUrl}
                alt="KB Academy Crest"
                referrerPolicy="no-referrer"
                className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* Academic Co-Curricular Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300/70 text-[#a06014] text-xs font-bold tracking-wider uppercase mb-5 shadow-xs">
            KB Academy Co-Curricular Operations Hub
          </div>

          {/* Centered Main Quote & Headline */}
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-zinc-950 leading-[1.08] mb-6">
              One platform. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-950 via-[#9c6018] to-[#c5832b]">
                A smarter KB Academy.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
              Centralizing student club registration, faculty advisory reviews, room allocation governance, 
              and zero-collision scheduling into one unified digital system built for modern scholastic excellence.
            </p>
          </div>

          {/* 2 Interactive Stakeholder Portal Launch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8 text-left">
            {/* Student Card */}
            <div 
              onClick={() => onEnterRole('student')}
              className="group cursor-pointer p-6 rounded-2xl bg-white border border-zinc-200/90 hover:border-emerald-500 transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-zinc-200/50 hover:shadow-emerald-500/10 flex flex-col justify-between"
              id="hero-role-student"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold">Student Portal</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-emerald-700 transition-colors">
                  Explore & Register
                </h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  Browse accredited syndicates, check schedule clashes instantly, view active syllabi, and submit charter proposals.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                <span>Enter Student Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Teacher / Advisor Card - Updated to Track Record & Club Status */}
            <div 
              onClick={() => onEnterRole('teacher')}
              className="group cursor-pointer p-6 rounded-2xl bg-white border border-zinc-200/90 hover:border-[#c5832b] transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-zinc-200/50 hover:shadow-amber-500/10 flex flex-col justify-between"
              id="hero-role-teacher"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-[#b46d1c] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-xs">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-[#a06014] font-bold">Faculty Advisor</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-[#b46d1c] transition-colors">
                  Track Record & Club Status
                </h3>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  Track student attendance records, monitor real-time club member status, verify rosters, and oversee syndicate health.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#a06014] group-hover:text-[#834d0b]">
                <span>Track Record & Club Status</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Live Academy Pulse Ticker Bar */}
        <div className="relative z-10 max-w-5xl mx-auto w-full pt-6 border-t border-zinc-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm text-center sm:text-left">
              <div className="text-2xl lg:text-3xl font-bold font-crest text-zinc-950">94.2%</div>
              <div className="text-xs text-zinc-600 mt-1 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>On-Time Room Allocation</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm text-center sm:text-left">
              <div className="text-2xl lg:text-3xl font-bold font-crest text-zinc-950">18</div>
              <div className="text-xs text-zinc-600 mt-1 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Award className="w-3.5 h-3.5 text-[#c5832b]" />
                <span>Accredited Syndicates</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm text-center sm:text-left">
              <div className="text-2xl lg:text-3xl font-bold font-crest text-zinc-950">450+</div>
              <div className="text-xs text-zinc-600 mt-1 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-[#b46d1c]" />
                <span>Enrolled Scholars</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm text-center sm:text-left">
              <div className="text-2xl lg:text-3xl font-bold font-crest text-zinc-950">100%</div>
              <div className="text-xs text-zinc-600 mt-1 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#c5832b]" />
                <span>Digital Verified Attendance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Operational Architecture Pillars (DIRECT IN-PAGE EDITABLE) */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white" id="real-school-operations-section">
        {/* Settings Icon in the Top Right Corner - Admin Mode Trigger */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-20 flex items-center gap-2">
          {isAdminAuthenticated && (
            <button
              onClick={() => {
                setIsLiveEditing(!isLiveEditing);
                onAddToast(
                  'info', 
                  isLiveEditing ? 'Visitor Preview Mode' : 'Live Edit Mode Active',
                  isLiveEditing ? 'Switched to clean visitor preview.' : 'You can now edit elements directly on the website.'
                );
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isLiveEditing 
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs' 
                  : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200'
              }`}
              title="Toggle in-page live editing"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span>{isLiveEditing ? 'Live Editing: ON' : 'Live Editing: OFF'}</span>
            </button>
          )}

          <button
            onClick={() => {
              if (!isAdminAuthenticated) {
                onOpenAdminLogin();
              } else {
                setIsLiveEditing(!isLiveEditing);
              }
            }}
            id="btn-real-school-ops-admin-settings"
            title={isAdminAuthenticated ? "Admin Mode Active (Click to toggle)" : "Unlock Administrator Live Editing Mode"}
            aria-label="Admin Settings Mode"
            className="group relative inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-amber-50 text-zinc-600 hover:text-amber-900 border border-zinc-200 hover:border-amber-300 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
          >
            <Settings className="w-4 h-4 text-zinc-500 group-hover:text-amber-700 transition-transform duration-300 group-hover:rotate-90" />
            <span className="text-xs font-semibold">
              {isAdminAuthenticated ? 'Admin Active' : 'Admin Mode'}
            </span>
            {isAdminAuthenticated ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Admin Authenticated" />
            ) : (
              <Lock className="w-3 h-3 text-zinc-400" />
            )}
          </button>
        </div>

        {/* Section Heading Area */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Badge */}
          {canLiveEdit ? (
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded uppercase">
                Badge
              </span>
              <input
                type="text"
                value={websiteContent?.realSchoolOps?.badge || 'Real School Operations'}
                onChange={(e) => onUpdateWebsiteContent({
                  ...websiteContent,
                  realSchoolOps: {
                    ...websiteContent.realSchoolOps,
                    badge: e.target.value
                  }
                })}
                className="px-3 py-1 rounded-full bg-amber-50 border-2 border-dashed border-amber-400 text-xs text-[#a06014] font-bold uppercase tracking-wider focus:outline-none focus:bg-white text-center"
              />
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs text-[#a06014] font-bold mb-3 uppercase tracking-wider">
              {websiteContent?.realSchoolOps?.badge || 'Real School Operations'}
            </div>
          )}

          {/* Main Headline */}
          {canLiveEdit ? (
            <div className="relative mb-3">
              <span className="absolute -top-3 left-2 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                Headline
              </span>
              <textarea
                rows={2}
                value={websiteContent?.realSchoolOps?.heading || 'Designed for real school logistics, not generic brochureware.'}
                onChange={(e) => onUpdateWebsiteContent({
                  ...websiteContent,
                  realSchoolOps: {
                    ...websiteContent.realSchoolOps,
                    heading: e.target.value
                  }
                })}
                className="w-full text-center text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight bg-amber-50/50 border-2 border-dashed border-amber-300 rounded-xl p-3 focus:outline-none focus:bg-white focus:border-amber-500"
              />
            </div>
          ) : (
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              {websiteContent?.realSchoolOps?.heading || 'Designed for real school logistics, not generic brochureware.'}
            </h2>
          )}

          {/* Description */}
          {canLiveEdit ? (
            <div className="relative">
              <span className="absolute -top-3 left-2 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                Description
              </span>
              <textarea
                rows={3}
                value={websiteContent?.realSchoolOps?.description || 'Every feature replaces manual spreadsheets, frantic email threads, and scheduling friction with instant digital workflows.'}
                onChange={(e) => onUpdateWebsiteContent({
                  ...websiteContent,
                  realSchoolOps: {
                    ...websiteContent.realSchoolOps,
                    description: e.target.value
                  }
                })}
                className="w-full text-center text-base text-zinc-600 bg-amber-50/40 border-2 border-dashed border-amber-300 rounded-xl p-3 focus:outline-none focus:bg-white focus:border-amber-500 leading-relaxed"
              />
            </div>
          ) : (
            <p className="text-zinc-600 mt-4 text-base leading-relaxed">
              {websiteContent?.realSchoolOps?.description || 'Every feature replaces manual spreadsheets, frantic email threads, and scheduling friction with instant digital workflows.'}
            </p>
          )}
        </div>

        {/* Operational Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {websiteContent?.realSchoolOps?.pillars?.map((pillar, index) => {
            const icons = [CalendarClock, Users, Building2, Zap];
            const IconComponent = icons[index % icons.length];

            return (
              <div 
                key={pillar.id || `pillar-${index}`} 
                className={`relative p-6 rounded-2xl transition-all ${
                  canLiveEdit
                    ? 'bg-amber-50/30 border-2 border-dashed border-amber-300 shadow-sm'
                    : 'bg-[#faf9f7] border border-zinc-200 hover:border-[#c5832b]/60 hover:bg-white hover:shadow-md'
                }`}
              >
                {canLiveEdit && (
                  <button
                    type="button"
                    onClick={(e) => handleDeletePillar(pillar.id, e)}
                    className="absolute top-3 right-3 p-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors cursor-pointer"
                    title="Delete pillar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#b46d1c] flex items-center justify-center mb-4">
                  <IconComponent className="w-5 h-5" />
                </div>

                {canLiveEdit ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => handleUpdatePillar(pillar.id, 'title', e.target.value)}
                      placeholder="Pillar Title"
                      className="w-full text-base font-bold text-zinc-900 bg-white border border-amber-300 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500"
                    />
                    <textarea
                      rows={3}
                      value={pillar.description}
                      onChange={(e) => handleUpdatePillar(pillar.id, 'description', e.target.value)}
                      placeholder="Pillar Description"
                      className="w-full text-xs text-zinc-600 bg-white border border-amber-300 rounded-lg p-2 focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="text-base font-bold text-zinc-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {pillar.description}
                    </p>
                  </>
                )}
              </div>
            );
          })}

          {/* If Live Editing: Add Pillar Button Card */}
          {canLiveEdit && (
            <button
              type="button"
              onClick={handleAddPillar}
              className="p-6 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-100/50 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[180px]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-900">Add Operational Pillar</span>
              <span className="text-[11px] text-amber-700/80 mt-1">Add another logistic highlight</span>
            </button>
          )}
        </div>
      </section>

      {/* 3. Featured Clubs Directory Preview (DIRECT IN-PAGE EDITABLE) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#b46d1c]">
              Co-Curricular Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">
              Active Academy Clubs & Syndicates
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm mt-1">
              Currently accepting student applications for Fall 2026.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {canLiveEdit && (
              <button
                onClick={handleAddNewClub}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
                id="btn-add-club-live"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Club</span>
              </button>
            )}

            <button
              onClick={() => onEnterRole('student')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-xs font-bold text-white transition-colors shadow-sm cursor-pointer"
              id="btn-landing-open-student-dir"
            >
              <span>Open Full Student Directory</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clubs.slice(0, canLiveEdit ? 8 : 4).map((club) => {
            const seatsLeft = club.capacity - club.enrolledCount;
            const percentFilled = Math.round((club.enrolledCount / club.capacity) * 100);

            return (
              <div
                key={club.id}
                onClick={() => {
                  if (!canLiveEdit) onSelectClub(club);
                }}
                className={`group rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  canLiveEdit
                    ? 'border-2 border-dashed border-amber-300 shadow-md'
                    : 'border-zinc-200 hover:border-[#c5832b] hover:-translate-y-1 shadow-sm hover:shadow-lg cursor-pointer'
                }`}
                id={`featured-club-${club.id}`}
              >
                <div>
                  {/* School imagery & Image Change button */}
                  <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                    <img 
                      src={club.coverImage} 
                      alt={club.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* In Live Edit Mode: Change Photo Action */}
                    {canLiveEdit && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotoModalState({
                              isOpen: true,
                              clubId: club.id,
                              currentUrl: club.coverImage,
                              title: `${club.name} Cover Photo`
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Change Photo</span>
                        </button>
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-zinc-900 font-bold shadow-xs">
                        {club.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-zinc-200">
                      <span className="flex items-center gap-1 font-mono text-zinc-100">
                        <MapPin className="w-3 h-3 text-[#e5a93c]" />
                        {club.room}
                      </span>
                      <span className="font-semibold text-white font-mono">{club.code}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    {canLiveEdit ? (
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase">Club Title</label>
                          <input
                            type="text"
                            value={club.name}
                            onChange={(e) => handleUpdateClubField(club.id, 'name', e.target.value)}
                            className="w-full text-sm font-bold text-zinc-900 border border-amber-300 rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase">Mission Tagline</label>
                          <textarea
                            rows={2}
                            value={club.tagline}
                            onChange={(e) => handleUpdateClubField(club.id, 'tagline', e.target.value)}
                            className="w-full text-xs text-zinc-600 border border-amber-300 rounded-lg p-2 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase">Room</label>
                            <input
                              type="text"
                              value={club.room}
                              onChange={(e) => handleUpdateClubField(club.id, 'room', e.target.value)}
                              className="w-full text-xs text-zinc-700 border border-amber-300 rounded-lg px-2 py-1"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase">Day</label>
                            <select
                              value={club.meetingDay}
                              onChange={(e) => handleUpdateClubField(club.id, 'meetingDay', e.target.value)}
                              className="w-full text-xs text-zinc-700 border border-amber-300 rounded-lg px-1 py-1"
                            >
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteClub(club.id, club.name, e)}
                            className="text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete Club</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#b46d1c] transition-colors line-clamp-1">
                          {club.name}
                        </h3>
                        <p className="text-xs text-zinc-600 mt-2 line-clamp-2 leading-relaxed">
                          {club.tagline}
                        </p>

                        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#c5832b]" />
                            <span className="font-medium text-zinc-700">{club.meetingDay}</span>
                          </div>
                          <span className="text-zinc-600 font-medium font-mono">
                            {club.meetingTime.split('–')[0]}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {!canLiveEdit && (
                  <div className="px-5 pb-5 pt-2">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-zinc-500">Roster Capacity</span>
                      <span className="font-semibold text-zinc-800">
                        {club.enrolledCount} / {club.capacity} ({seatsLeft} open)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/60">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          percentFilled >= 90 ? 'bg-amber-500' : 'bg-[#c5832b]'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Leadership & Academy Vision (DIRECT IN-PAGE EDITABLE) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200">
        <div className={`rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm transition-all ${
          canLiveEdit
            ? 'bg-amber-50/50 border-2 border-dashed border-amber-300'
            : 'bg-gradient-to-br from-[#faf8f4] via-[#f7f3ea] to-[#efe9dc] border border-amber-200/70'
        }`}>
          <div className="absolute right-0 top-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            {/* Badge */}
            {canLiveEdit ? (
              <div className="mb-2">
                <input
                  type="text"
                  value={websiteContent?.leadershipQuote?.badge || 'Operational Standard'}
                  onChange={(e) => onUpdateWebsiteContent({
                    ...websiteContent,
                    leadershipQuote: {
                      ...websiteContent.leadershipQuote,
                      badge: e.target.value
                    }
                  })}
                  className="text-xs font-bold text-[#a06014] tracking-wider uppercase bg-white border border-amber-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <span className="text-xs font-bold text-[#a06014] tracking-wider uppercase">
                {websiteContent?.leadershipQuote?.badge || 'Operational Standard'}
              </span>
            )}

            {/* Blockquote */}
            {canLiveEdit ? (
              <div className="my-3">
                <textarea
                  rows={4}
                  value={websiteContent?.leadershipQuote?.quote || '“Co-curricular activities are not secondary to the KB Academy curriculum — they are where our students test leadership, technical rigor, and civil discourse. This platform replaces paperwork with operational precision.”'}
                  onChange={(e) => onUpdateWebsiteContent({
                    ...websiteContent,
                    leadershipQuote: {
                      ...websiteContent.leadershipQuote,
                      quote: e.target.value
                    }
                  })}
                  className="w-full text-lg sm:text-xl font-serif text-zinc-900 leading-snug font-medium bg-white border border-amber-300 rounded-xl p-3 focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <blockquote className="mt-4 text-xl sm:text-2xl font-serif text-zinc-900 leading-snug font-medium">
                {websiteContent?.leadershipQuote?.quote || '“Co-curricular activities are not secondary to the KB Academy curriculum — they are where our students test leadership, technical rigor, and civil discourse. This platform replaces paperwork with operational precision.”'}
              </blockquote>
            )}

            {/* Director Information */}
            <div className="mt-6 flex items-center gap-3">
              {canLiveEdit ? (
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="text"
                    maxLength={3}
                    value={websiteContent?.leadershipQuote?.initials || 'WE'}
                    onChange={(e) => onUpdateWebsiteContent({
                      ...websiteContent,
                      leadershipQuote: {
                        ...websiteContent.leadershipQuote,
                        initials: e.target.value.toUpperCase()
                      }
                    })}
                    className="w-11 h-11 rounded-full bg-white border border-amber-300 text-center font-bold text-[#b46d1c] focus:outline-none focus:border-amber-500 text-sm"
                    title="Initials"
                  />
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={websiteContent?.leadershipQuote?.directorName || 'Mr. Wondwossen Erqiyhun'}
                      onChange={(e) => onUpdateWebsiteContent({
                        ...websiteContent,
                        leadershipQuote: {
                          ...websiteContent.leadershipQuote,
                          directorName: e.target.value
                        }
                      })}
                      className="w-full text-sm font-bold text-zinc-950 bg-white border border-amber-300 rounded-lg px-2 py-0.5"
                      placeholder="Director Name"
                    />
                    <input
                      type="text"
                      value={websiteContent?.leadershipQuote?.directorTitle || 'Highschool Director'}
                      onChange={(e) => onUpdateWebsiteContent({
                        ...websiteContent,
                        leadershipQuote: {
                          ...websiteContent.leadershipQuote,
                          directorTitle: e.target.value
                        }
                      })}
                      className="w-full text-xs text-zinc-600 bg-white border border-amber-300 rounded-lg px-2 py-0.5"
                      placeholder="Director Title"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full bg-white border border-amber-300 flex items-center justify-center font-crest font-bold text-[#b46d1c] shadow-xs">
                    {websiteContent?.leadershipQuote?.initials || 'WE'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-950">
                      {websiteContent?.leadershipQuote?.directorName || 'Mr. Wondwossen Erqiyhun'}
                    </div>
                    <div className="text-xs text-zinc-600">
                      {websiteContent?.leadershipQuote?.directorTitle || 'Highschool Director'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-zinc-200 py-12 px-4 sm:px-6 lg:px-8 text-xs text-zinc-500 bg-[#fbfaf8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src={kbLogoUrl} 
              alt="KB Academy"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-lg object-contain bg-white border border-amber-300/70 p-0.5" 
            />
            <span className="text-zinc-600 font-medium">
              KB Academy Digital Operations Platform &bull; Academic Year 2026-2027
            </span>
          </div>
          <div className="flex items-center gap-6 font-medium text-zinc-600">
            <button onClick={() => onEnterRole('student')} className="hover:text-zinc-950 transition-colors cursor-pointer">Student Portal</button>
            <button onClick={() => onEnterRole('teacher')} className="hover:text-zinc-950 transition-colors cursor-pointer">Advisor Workspace</button>
            <button onClick={() => onEnterRole('director')} className="hover:text-zinc-950 transition-colors cursor-pointer">Director Control Center</button>
          </div>
        </div>
      </footer>

      {/* ================= FLOATING STICKY ADMIN LIVE EDIT BAR ================= */}
      {canLiveEdit && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-zinc-900/95 backdrop-blur-md text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-bottom-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>Admin Live Website Editor Active</span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Scroll up and down to edit text, pillars, clubs, or quotes directly on the page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleAddPillar}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Pillar</span>
            </button>

            <button
              onClick={handleAddNewClub}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Club</span>
            </button>

            <button
              onClick={() => {
                onAddToast('success', 'Changes Saved', 'All website modifications are saved to active memory.');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>

            <button
              onClick={() => setIsLiveEditing(false)}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              title="Preview without edit frames"
            >
              Preview
            </button>

            <button
              onClick={() => {
                setIsAdminAuthenticated(false);
                setIsLiveEditing(false);
                onAddToast('info', 'Admin Locked', 'Administrator mode has been locked.');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-red-900/60 text-zinc-400 hover:text-red-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
              title="Log out of admin"
            >
              <Lock className="w-3 h-3" />
              <span className="hidden md:inline">Lock</span>
            </button>
          </div>
        </div>
      )}

      {/* Photo Change Modal */}
      <PhotoEditModal
        isOpen={photoModalState.isOpen}
        onClose={() => setPhotoModalState({ ...photoModalState, isOpen: false })}
        currentImageUrl={photoModalState.currentUrl}
        title={photoModalState.title}
        onSaveImage={(newUrl) => {
          if (photoModalState.clubId) {
            handleUpdateClubField(photoModalState.clubId, 'coverImage', newUrl);
          }
        }}
        onAddToast={onAddToast}
      />
    </div>
  );
};
