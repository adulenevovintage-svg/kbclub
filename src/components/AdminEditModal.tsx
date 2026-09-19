import React, { useState, useRef } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  KeyRound, 
  Save, 
  RotateCcw, 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Building2,
  Sparkles,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import { WebsiteContent, Club, ClubCategory } from '../types';
import { INITIAL_WEBSITE_CONTENT } from '../data/mockData';

interface AdminEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  websiteContent: WebsiteContent;
  onSaveWebsiteContent: (content: WebsiteContent) => void;
  clubs: Club[];
  onSaveClubs: (clubs: Club[]) => void;
  onAddToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
}

export const AdminEditModal: React.FC<AdminEditModalProps> = ({
  isOpen,
  onClose,
  websiteContent,
  onSaveWebsiteContent,
  clubs,
  onSaveClubs,
  onAddToast,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  // Password state
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active editor tab
  const [activeTab, setActiveTab] = useState<'realOps' | 'clubs' | 'photos' | 'leadership'>('realOps');

  // Working copy of content
  const [draftContent, setDraftContent] = useState<WebsiteContent>(websiteContent);
  const [draftClubs, setDraftClubs] = useState<Club[]>(clubs);
  const [selectedClubId, setSelectedClubId] = useState<string>(clubs[0]?.id || '');
  const [clubSearch, setClubSearch] = useState('');

  // New club creation state
  const [isAddingNewClub, setIsAddingNewClub] = useState(false);
  const [newClub, setNewClub] = useState<{
    name: string;
    code: string;
    category: ClubCategory;
    tagline: string;
    description: string;
    meetingDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    meetingTime: string;
    room: string;
    capacity: number;
    coverImage: string;
  }>({
    name: '',
    code: 'KB-NEW-01',
    category: 'STEM & Technology',
    tagline: '',
    description: '',
    meetingDay: 'Wednesday',
    meetingTime: '3:45 PM – 5:15 PM',
    room: 'Lab 101',
    capacity: 25,
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
  });

  // Photo upload temporary states
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clubImageInputRef = useRef<HTMLInputElement>(null);
  const logoImageInputRef = useRef<HTMLInputElement>(null);

  // Sync draft when modal opens or parent content changes
  React.useEffect(() => {
    setDraftContent(websiteContent);
    setDraftClubs(clubs);
  }, [websiteContent, clubs, isOpen]);

  if (!isOpen) return null;

  // Handle Password Unlock
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'kb@2019') {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
      onAddToast('success', 'Admin Access Granted', 'Master session unlocked. You can now edit website copy and photos.');
    } else {
      setAuthError('Incorrect passcode. Please enter the valid admin password.');
    }
  };

  const handleLockAdmin = () => {
    setIsAuthenticated(false);
    onAddToast('info', 'Admin Locked', 'Admin mode locked. Password required to re-enter.');
  };

  // Save All Changes
  const handleSaveAll = () => {
    onSaveWebsiteContent(draftContent);
    onSaveClubs(draftClubs);
    onAddToast('success', 'Changes Saved Live', 'Website text and media have been updated across KB Academy.');
    onClose();
  };

  // Reset to Factory Default Content
  const handleResetDefaults = () => {
    if (window.confirm('Reset all website text and media back to factory defaults?')) {
      setDraftContent(INITIAL_WEBSITE_CONTENT);
      onSaveWebsiteContent(INITIAL_WEBSITE_CONTENT);
      onAddToast('info', 'Content Restored', 'Website copy restored to original default baseline.');
    }
  };

  // Handle Photo File Upload (Convert to Base64 data URL)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image is too large. Please select a photo under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSuccess(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Update selected club fields
  const handleClubChange = (field: keyof Club, value: any) => {
    setDraftClubs(prev => prev.map(c => {
      if (c.id === selectedClubId) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  const selectedClub = draftClubs.find(c => c.id === selectedClubId) || draftClubs[0];

  // Add new club
  const handleCreateNewClub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClub.name.trim()) return;

    const newClubId = `club-custom-${Date.now()}`;
    const createdClub: Club = {
      id: newClubId,
      name: newClub.name,
      code: newClub.code || `KB-${Math.floor(Math.random() * 900 + 100)}`,
      category: newClub.category,
      tagline: newClub.tagline || 'Student co-curricular chapter at KB Academy.',
      description: newClub.description || 'Active scholastic syndicate open for member registration.',
      advisorName: 'Faculty Advisor',
      advisorEmail: 'advisors@kbacademy.edu',
      advisorTitle: 'Academic Mentor',
      studentPresident: 'Student Leader',
      meetingDay: newClub.meetingDay,
      meetingTime: newClub.meetingTime,
      timeSlotKey: `${newClub.meetingDay}-1600`,
      room: newClub.room,
      building: 'Main Academic Campus',
      capacity: Number(newClub.capacity) || 20,
      enrolledCount: 0,
      gradesEligible: [9, 10, 11, 12],
      duesPerSemester: 25,
      prerequisites: 'Open to all students in good academic standing.',
      coverImage: newClub.coverImage || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      tags: ['Academics', 'Leadership', 'Activity'],
      status: 'Active',
      charterYear: 2026,
      allocatedBudget: 1500,
      syllabus: [
        { week: 1, topic: 'Orientation & Chapter Objectives', objective: 'Review annual calendar and elect working committees.' },
        { week: 2, topic: 'Core Workshop & Project Launch', objective: 'Begin collaborative group challenges.' }
      ],
      officers: [
        { role: 'Chapter Lead', name: 'Student Leader', grade: 11 }
      ],
      upcomingMeetings: [
        { id: `m-${Date.now()}`, title: 'First General Assembly', date: `Next ${newClub.meetingDay}`, time: newClub.meetingTime, room: newClub.room, agenda: 'Welcome new registrants and distribute materials.' }
      ]
    };

    setDraftClubs(prev => [createdClub, ...prev]);
    setSelectedClubId(newClubId);
    setIsAddingNewClub(false);
    setNewClub({
      name: '',
      code: 'KB-NEW-02',
      category: 'STEM & Technology',
      tagline: '',
      description: '',
      meetingDay: 'Wednesday',
      meetingTime: '3:45 PM – 5:15 PM',
      room: 'Lab 101',
      capacity: 25,
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    });
    onAddToast('success', 'New Club Created', `Added "${createdClub.name}" with custom cover photo.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh] text-zinc-900">
        
        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-center justify-between border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shadow-xs">
              {isAuthenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  KB Academy Administration Mode
                </h2>
                {isAuthenticated && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-400/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Unlocked
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isAuthenticated 
                  ? 'Edit website text, club descriptions, operational pillars, and upload photos.'
                  : 'Master authorization required to modify live school portal content.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLockAdmin}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5"
                title="Lock admin session"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Session</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= AUTHENTICATION VIEW (IF NOT AUTHENTICATED) ================= */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 text-[#a06014] flex items-center justify-center mb-5 shadow-inner">
              <KeyRound className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-zinc-950 mb-2">
              Administrator Master Password
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mb-6 leading-relaxed">
              Enter the administration password to unlock live website content editing, club management, and photo uploading.
            </p>

            <form onSubmit={handleAuthenticate} className="w-full space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
                  Admin Passcode
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError('');
                    }}
                    placeholder="Enter administrator password"
                    autoFocus
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-medium text-zinc-900 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Authenticate & Unlock Admin Mode</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] text-zinc-400 font-mono">
                  Authorized personnel: Highschool Director & Webmasters
                </span>
              </div>
            </form>
          </div>
        ) : (
          /* ================= AUTHENTICATED CONTENT EDITOR ================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Nav Tabs */}
            <div className="flex border-b border-zinc-200 bg-zinc-50 px-6 gap-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('realOps')}
                className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'realOps'
                    ? 'border-[#c5832b] text-[#a06014] bg-white'
                    : 'border-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Real School Operations Text</span>
              </button>

              <button
                onClick={() => setActiveTab('clubs')}
                className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'clubs'
                    ? 'border-[#c5832b] text-[#a06014] bg-white'
                    : 'border-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Clubs (Text & Photos)</span>
              </button>

              <button
                onClick={() => setActiveTab('photos')}
                className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'photos'
                    ? 'border-[#c5832b] text-[#a06014] bg-white'
                    : 'border-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Add Photos & School Media</span>
              </button>

              <button
                onClick={() => setActiveTab('leadership')}
                className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'leadership'
                    ? 'border-[#c5832b] text-[#a06014] bg-white'
                    : 'border-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Leadership Quote</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: Real School Operations Section Texts & Pillars */}
              {activeTab === 'realOps' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-[#a06014] flex items-start gap-3">
                    <Sparkles className="w-5 h-5 shrink-0 text-[#c5832b] mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5">Real School Operations Section Customizer</strong>
                      Edit the headline, descriptive paragraph, and the four operational pillars shown on the landing page.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        Section Badge Text
                      </label>
                      <input
                        type="text"
                        value={draftContent.realSchoolOps.badge}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          realSchoolOps: { ...draftContent.realSchoolOps, badge: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">
                        Main Section Headline
                      </label>
                      <input
                        type="text"
                        value={draftContent.realSchoolOps.heading}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          realSchoolOps: { ...draftContent.realSchoolOps, heading: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Section Subtitle / Paragraph Description
                    </label>
                    <textarea
                      rows={2}
                      value={draftContent.realSchoolOps.description}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        realSchoolOps: { ...draftContent.realSchoolOps, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  {/* 4 Pillars */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 mb-3">
                      Four Operational Architecture Pillars
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {draftContent.realSchoolOps.pillars.map((pillar, idx) => (
                        <div key={pillar.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-800">Pillar #{idx + 1}</span>
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Title</label>
                            <input
                              type="text"
                              value={pillar.title}
                              onChange={(e) => {
                                const newPillars = [...draftContent.realSchoolOps.pillars];
                                newPillars[idx] = { ...pillar, title: e.target.value };
                                setDraftContent({
                                  ...draftContent,
                                  realSchoolOps: { ...draftContent.realSchoolOps, pillars: newPillars }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-md border border-zinc-300 text-xs bg-white focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-zinc-600 mb-1">Description</label>
                            <textarea
                              rows={3}
                              value={pillar.description}
                              onChange={(e) => {
                                const newPillars = [...draftContent.realSchoolOps.pillars];
                                newPillars[idx] = { ...pillar, description: e.target.value };
                                setDraftContent({
                                  ...draftContent,
                                  realSchoolOps: { ...draftContent.realSchoolOps, pillars: newPillars }
                                });
                              }}
                              className="w-full px-3 py-1.5 rounded-md border border-zinc-300 text-xs bg-white focus:border-amber-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Clubs Text & Photos Editor */}
              {activeTab === 'clubs' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">Co-Curricular Clubs Management</h4>
                      <p className="text-[11px] text-zinc-500">Edit existing club descriptions, times, rooms, or upload new cover photos.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingNewClub(!isAddingNewClub)}
                      className="px-3 py-1.5 rounded-lg bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingNewClub ? 'View Existing Clubs' : 'Add New Club & Photo'}</span>
                    </button>
                  </div>

                  {/* Add New Club Form */}
                  {isAddingNewClub ? (
                    <form onSubmit={handleCreateNewClub} className="p-5 rounded-xl border-2 border-amber-200 bg-amber-50/30 space-y-4">
                      <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-[#c5832b]" />
                        Create New Co-Curricular Club
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Club Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Model African Union Society"
                            value={newClub.name}
                            onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-zinc-700 mb-1">Category</label>
                          <select
                            value={newClub.category}
                            onChange={(e) => setNewClub({ ...newClub, category: e.target.value as ClubCategory })}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white"
                          >
                            <option value="STEM & Technology">STEM & Technology</option>
                            <option value="Debate & Leadership">Debate & Leadership</option>
                            <option value="Arts & Performance">Arts & Performance</option>
                            <option value="Athletics & Tactics">Athletics & Tactics</option>
                            <option value="Civics & Culture">Civics & Culture</option>
                            <option value="Academic Olympiad">Academic Olympiad</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 mb-1">Meeting Day</label>
                          <select
                            value={newClub.meetingDay}
                            onChange={(e) => setNewClub({ ...newClub, meetingDay: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white"
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 mb-1">Meeting Time</label>
                          <input
                            type="text"
                            value={newClub.meetingTime}
                            onChange={(e) => setNewClub({ ...newClub, meetingTime: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-zinc-700 mb-1">Assigned Room</label>
                          <input
                            type="text"
                            value={newClub.room}
                            onChange={(e) => setNewClub({ ...newClub, room: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">Tagline</label>
                        <input
                          type="text"
                          placeholder="Short 1-sentence synopsis"
                          value={newClub.tagline}
                          onChange={(e) => setNewClub({ ...newClub, tagline: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Description</label>
                        <textarea
                          rows={2}
                          value={newClub.description}
                          onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white"
                        />
                      </div>

                      {/* Cover Photo for New Club */}
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                          Club Cover Photo
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          <div className="w-32 h-20 rounded-xl overflow-hidden bg-zinc-200 border border-zinc-300 shrink-0">
                            {newClub.coverImage ? (
                              <img src={newClub.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2 w-full">
                            <input
                              type="text"
                              placeholder="Image URL or upload file below"
                              value={newClub.coverImage}
                              onChange={(e) => setNewClub({ ...newClub, coverImage: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                            />
                            <div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, (dataUrl) => setNewClub({ ...newClub, coverImage: dataUrl }))}
                                className="text-xs text-zinc-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-[#a06014] hover:file:bg-amber-200 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingNewClub(false)}
                          className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold shadow-xs"
                        >
                          Save New Club
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Existing Clubs Selector & Editor */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: Club List */}
                      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50/50 flex flex-col h-[400px]">
                        <div className="p-3 border-b border-zinc-200 bg-white">
                          <input
                            type="text"
                            placeholder="Filter clubs..."
                            value={clubSearch}
                            onChange={(e) => setClubSearch(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs focus:ring-1 focus:ring-amber-500"
                          />
                        </div>
                        <div className="flex-1 overflow-y-auto divide-y divide-zinc-200">
                          {draftClubs
                            .filter(c => c.name.toLowerCase().includes(clubSearch.toLowerCase()))
                            .map((club) => (
                              <button
                                key={club.id}
                                onClick={() => setSelectedClubId(club.id)}
                                className={`w-full p-3 text-left transition-colors flex items-center gap-3 cursor-pointer ${
                                  selectedClubId === club.id ? 'bg-amber-50 text-[#a06014]' : 'hover:bg-zinc-100/80 text-zinc-800'
                                }`}
                              >
                                <img
                                  src={club.coverImage}
                                  alt={club.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-zinc-200 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-bold truncate">{club.name}</div>
                                  <div className="text-[10px] text-zinc-500">{club.meetingDay} &bull; {club.room}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Right: Selected Club Form */}
                      {selectedClub && (
                        <div className="lg:col-span-2 border border-zinc-200 rounded-xl p-5 bg-white space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                                {selectedClub.code}
                              </span>
                              <h4 className="text-sm font-bold text-zinc-950 mt-1">
                                Editing: {selectedClub.name}
                              </h4>
                            </div>
                            <span className="text-xs text-zinc-500">{selectedClub.category}</span>
                          </div>

                          {/* Club Name & Tagline */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">Club Title</label>
                              <input
                                type="text"
                                value={selectedClub.name}
                                onChange={(e) => handleClubChange('name', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-semibold focus:border-amber-500"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">Tagline</label>
                              <input
                                type="text"
                                value={selectedClub.tagline}
                                onChange={(e) => handleClubChange('tagline', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-zinc-700 mb-1">Description</label>
                              <textarea
                                rows={3}
                                value={selectedClub.description}
                                onChange={(e) => handleClubChange('description', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-zinc-700 mb-1">Meeting Day</label>
                                <select
                                  value={selectedClub.meetingDay}
                                  onChange={(e) => handleClubChange('meetingDay', e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                                >
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-zinc-700 mb-1">Meeting Time</label>
                                <input
                                  type="text"
                                  value={selectedClub.meetingTime}
                                  onChange={(e) => handleClubChange('meetingTime', e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-zinc-700 mb-1">Capacity</label>
                                <input
                                  type="number"
                                  value={selectedClub.capacity}
                                  onChange={(e) => handleClubChange('capacity', Number(e.target.value))}
                                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                                />
                              </div>
                            </div>

                            {/* Club Photo / Cover Image Uploader */}
                            <div className="pt-2 border-t border-zinc-100">
                              <label className="block text-xs font-bold text-zinc-700 mb-2 flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-[#c5832b]" />
                                Club Photo / Cover Image
                              </label>
                              <div className="flex items-start gap-4">
                                <div className="relative w-36 h-24 rounded-xl overflow-hidden border-2 border-zinc-200 bg-zinc-100 shrink-0 group">
                                  <img
                                    src={selectedClub.coverImage}
                                    alt="Club Cover"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={selectedClub.coverImage}
                                      onChange={(e) => handleClubChange('coverImage', e.target.value)}
                                      placeholder="https://..."
                                      className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-300 text-xs"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="file"
                                      ref={clubImageInputRef}
                                      accept="image/*"
                                      onChange={(e) => handleFileUpload(e, (dataUrl) => handleClubChange('coverImage', dataUrl))}
                                      className="text-xs text-zinc-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-[#a06014] hover:file:bg-amber-200 cursor-pointer"
                                    />
                                  </div>
                                  <p className="text-[11px] text-zinc-500">
                                    Select an image file from your device or paste any image link.
                                  </p>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Add Photos & Media Gallery */}
              {activeTab === 'photos' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-[#a06014] flex items-start gap-3">
                    <ImageIcon className="w-5 h-5 shrink-0 text-[#c5832b] mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5">School Photos & Media Manager</strong>
                      Upload photos directly from your computer or paste web links. These images can be used as the official school crest, club headers, or featured facility previews.
                    </div>
                  </div>

                  {/* 1. Official Crest / Logo Photo */}
                  <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#c5832b]" />
                      KB Academy Official Crest / Logo
                    </h4>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-white p-2 border border-amber-300 shadow-sm flex items-center justify-center shrink-0">
                        <img
                          src={draftContent.kbLogoUrl}
                          alt="Crest preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={draftContent.kbLogoUrl}
                          onChange={(e) => setDraftContent({ ...draftContent, kbLogoUrl: e.target.value })}
                          placeholder="Logo URL"
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                        />
                        <div>
                          <input
                            type="file"
                            ref={logoImageInputRef}
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, (dataUrl) => setDraftContent({ ...draftContent, kbLogoUrl: dataUrl }))}
                            className="text-xs text-zinc-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-[#a06014] hover:file:bg-amber-200 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Upload New School Photo */}
                  <div className="p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/20 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#a06014] flex items-center gap-1.5">
                      <Upload className="w-4 h-4" />
                      Upload New School Facility or Activity Photo
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Photo Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Robotics Championship Arena"
                          value={newPhotoTitle}
                          onChange={(e) => setNewPhotoTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">Caption / Facility Detail</label>
                        <input
                          type="text"
                          placeholder="e.g. South Campus Engineering Lab with CNC"
                          value={newPhotoCaption}
                          onChange={(e) => setNewPhotoCaption(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[11px] font-semibold text-zinc-700">Photo Source (URL or File)</label>
                      <input
                        type="text"
                        placeholder="Paste image URL here..."
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 text-xs bg-white"
                      />
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, (dataUrl) => setNewPhotoUrl(dataUrl))}
                          className="text-xs text-zinc-600 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-[#a06014] hover:file:bg-amber-200 cursor-pointer"
                        />
                      </div>
                    </div>

                    {newPhotoUrl && (
                      <div className="w-40 h-24 rounded-lg overflow-hidden border border-zinc-300 bg-zinc-100 mt-2">
                        <img src={newPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        disabled={!newPhotoUrl.trim()}
                        onClick={() => {
                          if (!newPhotoUrl.trim()) return;
                          const newPhoto = {
                            id: `photo-${Date.now()}`,
                            title: newPhotoTitle || 'Campus Facility Photo',
                            url: newPhotoUrl,
                            caption: newPhotoCaption,
                            uploadedAt: new Date().toLocaleDateString()
                          };
                          setDraftContent({
                            ...draftContent,
                            mediaPhotos: [newPhoto, ...(draftContent.mediaPhotos || [])]
                          });
                          setNewPhotoUrl('');
                          setNewPhotoTitle('');
                          setNewPhotoCaption('');
                          onAddToast('success', 'Photo Added', 'New image saved to school media repository.');
                        }}
                        className="px-4 py-2 rounded-lg bg-[#c5832b] hover:bg-[#a96721] disabled:opacity-40 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Add to Photo Repository
                      </button>
                    </div>
                  </div>

                  {/* 3. Existing Photo Gallery List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 mb-3">
                      Active Photo Repository ({draftContent.mediaPhotos?.length || 0})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {draftContent.mediaPhotos?.map((photo) => (
                        <div key={photo.id} className="rounded-xl border border-zinc-200 overflow-hidden bg-white shadow-xs group flex flex-col justify-between">
                          <div className="relative h-32 w-full bg-zinc-100 overflow-hidden">
                            <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <button
                              type="button"
                              onClick={() => {
                                setDraftContent({
                                  ...draftContent,
                                  mediaPhotos: draftContent.mediaPhotos.filter(p => p.id !== photo.id)
                                });
                                onAddToast('info', 'Photo Removed', 'Image removed from repository.');
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="p-3">
                            <div className="text-xs font-bold text-zinc-900 truncate">{photo.title}</div>
                            {photo.caption && (
                              <div className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">{photo.caption}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Leadership Quote Section Texts */}
              {activeTab === 'leadership' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-[#a06014] flex items-start gap-3">
                    <FileText className="w-5 h-5 shrink-0 text-[#c5832b] mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5">Highschool Director Operational Statement</strong>
                      Customize the quote, leader attribution, and official monogram displayed in the leadership section.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Section Tagline
                    </label>
                    <input
                      type="text"
                      value={draftContent.leadershipQuote.badge}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        leadershipQuote: { ...draftContent.leadershipQuote, badge: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Director Quote Content
                    </label>
                    <textarea
                      rows={4}
                      value={draftContent.leadershipQuote.quote}
                      onChange={(e) => setDraftContent({
                        ...draftContent,
                        leadershipQuote: { ...draftContent.leadershipQuote, quote: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Director Name</label>
                      <input
                        type="text"
                        value={draftContent.leadershipQuote.directorName}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          leadershipQuote: { ...draftContent.leadershipQuote, directorName: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Director Title</label>
                      <input
                        type="text"
                        value={draftContent.leadershipQuote.directorTitle}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          leadershipQuote: { ...draftContent.leadershipQuote, directorTitle: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">Monogram Initials</label>
                      <input
                        type="text"
                        maxLength={3}
                        value={draftContent.leadershipQuote.initials}
                        onChange={(e) => setDraftContent({
                          ...draftContent,
                          leadershipQuote: { ...draftContent.leadershipQuote, initials: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-300 text-xs bg-white font-mono uppercase"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ================= FOOTER / ACTION BAR ================= */}
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default Texts</span>
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-5 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Apply Live Changes</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
