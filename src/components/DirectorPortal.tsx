import React, { useState } from 'react';
import { 
  Club, 
  Registration, 
  ClubCharterProposal, 
  UserProfile, 
  SystemSettings 
} from '../types';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  FileSpreadsheet, 
  Download, 
  Settings, 
  Plus, 
  ToggleLeft, 
  ToggleRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface DirectorPortalProps {
  director: UserProfile;
  clubs: Club[];
  registrations: Registration[];
  proposals: ClubCharterProposal[];
  settings: SystemSettings;
  onApproveProposal: (proposalId: string, assignedRoom: string, approvedBudget: number) => void;
  onRejectProposal: (proposalId: string, feedback: string) => void;
  onUpdateSettings: (newSettings: SystemSettings) => void;
  onUpdateClubCapacity: (clubId: string, newCapacity: number) => void;
  onToggleClubStatus: (clubId: string) => void;
  onBackToLanding?: () => void;
}

export const DirectorPortal: React.FC<DirectorPortalProps> = ({
  director,
  clubs,
  registrations,
  proposals,
  settings,
  onApproveProposal,
  onRejectProposal,
  onUpdateSettings,
  onUpdateClubCapacity,
  onToggleClubStatus,
  onBackToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<'charters' | 'directory' | 'facilities' | 'settings'>('charters');
  const [searchDirectory, setSearchDirectory] = useState('');

  // Proposal modal state
  const [charterActionModal, setCharterActionModal] = useState<{
    isOpen: boolean;
    proposal: ClubCharterProposal | null;
    action: 'approve' | 'reject';
  }>({ isOpen: false, proposal: null, action: 'approve' });

  const [assignedRoom, setAssignedRoom] = useState('Computer Lab 202');
  const [allocatedBudget, setAllocatedBudget] = useState(1500);
  const [directorNotes, setDirectorNotes] = useState('Charter approved. Exceptional alignment with academy STEM and ethics initiatives.');

  // Director KPI calculations
  const totalEnrolled = registrations.filter(r => r.status === 'enrolled').length;
  const pendingCharterCount = proposals.filter(p => p.directorStatus === 'pending').length;
  const totalBudgetDisbursed = clubs.reduce((sum, c) => sum + (c.allocatedBudget || 0), 0);
  const totalCapacity = clubs.reduce((sum, c) => sum + c.capacity, 0);
  const totalEnrolledSeats = clubs.reduce((sum, c) => sum + c.enrolledCount, 0);
  const capacityUtilization = totalCapacity > 0 ? Math.round((totalEnrolledSeats / totalCapacity) * 100) : 0;

  // CSV export handler
  const handleExportRosterCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Grade', 'Email', 'Club Name', 'Meeting Day', 'Meeting Time', 'Status', 'Attendance'];
    const rows = registrations.map(r => [
      r.studentId,
      `"${r.studentName}"`,
      r.studentGrade,
      r.studentEmail,
      `"${r.clubName}"`,
      r.meetingDay,
      `"${r.meetingTime}"`,
      r.status,
      `"${r.attendedSessions}/${r.totalSessions}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KB_Academy_Club_Roster_Fall2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Facilities room schedule grid
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const roomsList = [
    'Lab 204 (Advanced Robotics Wing)',
    'Debate Chamber 110',
    'Biosciences Lab 308',
    'Global Conference Suite 401',
    'Symphony Hall 102',
    'Makerspace Aerospace Bay',
    'Seminar Room 215',
    'Digital Media Studio 202'
  ];

  return (
    <div className="space-y-8">
      {/* Director Executive Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14161f] via-[#12141a] to-[#0c0d10] border border-[#232730] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={director.avatarUrl} 
              alt={director.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#c5832b]/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{director.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  Executive Administration
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {director.title} &bull; {settings.semesterName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1a1d27] hover:bg-[#252a3a] text-zinc-300 hover:text-white border border-[#2b3040] hover:border-[#c5832b] text-xs font-bold transition-all cursor-pointer shadow-sm group"
                id="btn-director-portal-back-home"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#c5832b] group-hover:-translate-x-1 transition-transform" />
                <span>Main Website</span>
              </button>
            )}

            <button
              onClick={handleExportRosterCSV}
              className="px-4 py-2.5 rounded-xl bg-[#1a1d26] hover:bg-[#232734] border border-[#2e3444] text-xs font-semibold text-zinc-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              id="btn-export-roster-csv"
            >
              <Download className="w-4 h-4 text-[#c5832b]" />
              Export Master Roster (CSV)
            </button>
          </div>
        </div>

        {/* High-Level Executive KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#1f232c]">
          <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="text-[11px] text-zinc-400">Accredited Charters</div>
            <div className="text-xl font-bold text-white mt-0.5 flex items-center gap-1.5 font-crest">
              <Award className="w-4 h-4 text-[#c5832b]" />
              {clubs.length} Clubs
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">100% active standing</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="text-[11px] text-zinc-400">Total Enrolled Seats</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5 font-crest">
              <Users className="w-4 h-4 text-emerald-400" />
              {totalEnrolledSeats} <span className="text-xs text-zinc-500 font-sans font-normal">/ {totalCapacity}</span>
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">{capacityUtilization}% capacity filled</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="text-[11px] text-zinc-400">Pending Charters</div>
            <div className="text-xl font-bold text-amber-300 mt-0.5 flex items-center gap-1.5 font-crest">
              <Clock className="w-4 h-4 text-amber-400" />
              {pendingCharterCount} Proposals
            </div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">Awaiting director signoff</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="text-[11px] text-zinc-400">Allocated Seed Fund</div>
            <div className="text-xl font-bold text-white mt-0.5 flex items-center gap-1.5 font-crest">
              <DollarSign className="w-4 h-4 text-[#c5832b]" />
              ${totalBudgetDisbursed.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">From $45,000 co-curricular fund</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#232730] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('charters')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'charters'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
          }`}
          id="tab-director-charters"
        >
          <Award className="w-3.5 h-3.5" />
          Charter Proposals ({proposals.length})
          {pendingCharterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-bold text-[10px]">
              {pendingCharterCount} Pending
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'directory'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
          }`}
          id="tab-director-directory"
        >
          <Users className="w-3.5 h-3.5" />
          Master Clubs Directory & Capacity
        </button>

        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'facilities'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
          }`}
          id="tab-director-facilities"
        >
          <Building2 className="w-3.5 h-3.5" />
          Room & Schedule Heatmap
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
          }`}
          id="tab-director-settings"
        >
          <Settings className="w-3.5 h-3.5" />
          Semester Governance & Policies
        </button>
      </div>

      {/* TAB 1: CHARTER PROPOSALS */}
      {activeTab === 'charters' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Student & Faculty Charter Applications</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Official petitions to charter new extracurricular organizations at KB Academy.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {proposals.map(prop => {
              const isPending = prop.directorStatus === 'pending';
              const isApproved = prop.directorStatus === 'approved';

              return (
                <div 
                  key={prop.id}
                  className={`p-6 rounded-2xl bg-[#12141a] border transition-all space-y-4 ${
                    isPending ? 'border-amber-500/40' : 'border-[#232730]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{prop.clubName}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#181a22] text-[#e5a93c] border border-[#c5832b]/30 font-medium">
                          {prop.category}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          isApproved
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : isPending
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}>
                          {prop.directorStatus.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400 flex-wrap">
                        <span>Lead Petitioner: <strong className="text-zinc-200">{prop.proposedByStudent} (Gr. {prop.studentGrade})</strong></span>
                        <span>Faculty Sponsor: <strong className="text-zinc-200">{prop.facultyAdvisor}</strong></span>
                        <span>Requested Slot: <strong className="text-[#c5832b]">{prop.proposedMeetingDay}s &bull; {prop.proposedTimeSlot}</strong></span>
                      </div>
                    </div>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCharterActionModal({
                              isOpen: true,
                              proposal: prop,
                              action: 'approve'
                            });
                            setAssignedRoom('Franklin Hall Lab 202');
                            setAllocatedBudget(prop.requestedBudget);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                          id={`btn-charter-grant-${prop.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Grant Official Charter
                        </button>

                        <button
                          onClick={() => {
                            setCharterActionModal({
                              isOpen: true,
                              proposal: prop,
                              action: 'reject'
                            });
                          }}
                          className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mission Statement */}
                  <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c] text-xs space-y-2">
                    <div>
                      <span className="text-zinc-500 font-semibold block mb-0.5">Charter Mission & Scholastic Objective:</span>
                      <p className="text-zinc-200 leading-relaxed">{prop.missionStatement}</p>
                    </div>

                    <div className="pt-2 border-t border-[#1a1d24] flex items-center justify-between text-zinc-400 flex-wrap gap-2">
                      <span>Requested Room Type: <strong className="text-zinc-300">{prop.requestedRoomType}</strong></span>
                      <span>Target Initial Roster: <strong className="text-zinc-300">{prop.estimatedMembers} students</strong></span>
                      <span>Budget Request: <strong className="text-emerald-400">${prop.requestedBudget}</strong></span>
                    </div>
                  </div>

                  {prop.safetyPlan && (
                    <div className="text-xs text-zinc-400 bg-[#14161f] p-3 rounded-lg border border-[#1f232c]">
                      <strong className="text-zinc-300">Safety & Compliance Protocol:</strong> {prop.safetyPlan}
                    </div>
                  )}

                  {prop.directorFeedback && (
                    <div className="text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">
                      <strong>Director Endorsement:</strong> {prop.directorFeedback}
                      {prop.assignedRoom && <span> &bull; Assigned Facility: {prop.assignedRoom}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MASTER CLUBS DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">All Academy Clubs Registry</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Audit enrollment caps, adjust capacity in real-time, and monitor advisor assignments.
              </p>
            </div>

            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search clubs, advisors..."
                value={searchDirectory}
                onChange={(e) => setSearchDirectory(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#12141a] border border-[#232730] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#232730] overflow-hidden bg-[#12141a]">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#181a22] text-zinc-400 font-semibold border-b border-[#232730]">
                <tr>
                  <th className="py-3 px-4">Club / Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Faculty Advisor</th>
                  <th className="py-3 px-4">Capacity Cap</th>
                  <th className="py-3 px-4">Enrolled</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f232c]">
                {clubs
                  .filter(c => c.name.toLowerCase().includes(searchDirectory.toLowerCase()) || c.advisorName.toLowerCase().includes(searchDirectory.toLowerCase()))
                  .map(club => (
                    <tr key={club.id} className="hover:bg-[#151821]">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{club.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">{club.code} &bull; {club.room}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-300">{club.category}</td>
                      <td className="py-3 px-4 text-zinc-200">{club.advisorName}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="5"
                            max="60"
                            value={club.capacity}
                            onChange={(e) => onUpdateClubCapacity(club.id, parseInt(e.target.value) || club.capacity)}
                            className="w-16 px-2 py-1 rounded bg-[#0c0d10] border border-[#232730] text-xs text-center text-white focus:outline-none focus:border-[#c5832b]"
                          />
                          <span className="text-[10px] text-zinc-500">seats</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">
                        {club.enrolledCount} / {club.capacity}
                      </td>
                      <td className="py-3 px-4 text-zinc-200 font-mono">
                        ${club.allocatedBudget}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          club.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}>
                          {club.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onToggleClubStatus(club.id)}
                          className="px-2.5 py-1 rounded bg-[#1f232c] hover:bg-[#282d38] text-[11px] text-zinc-300 hover:text-white transition-colors"
                        >
                          {club.status === 'Active' ? 'Close Reg' : 'Open Reg'}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROOM UTILIZATION & SCHEDULE HEATMAP */}
      {activeTab === 'facilities' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Campus Facility & Room Schedule Heatmap</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Zero-collision governance across all science labs, auditoriums, and seminar chambers.
            </p>
          </div>

          <div className="rounded-xl border border-[#232730] overflow-x-auto bg-[#12141a]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#181a22] text-zinc-400 border-b border-[#232730]">
                  <th className="py-3 px-4 font-semibold w-64">Facility / Dedicated Room</th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="py-3 px-4 font-semibold text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f232c]">
                {roomsList.map(roomName => (
                  <tr key={roomName} className="hover:bg-[#151821]">
                    <td className="py-3 px-4 font-medium text-white bg-[#13151c] border-r border-[#1f232c]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c5832b]" />
                        <span>{roomName}</span>
                      </div>
                    </td>

                    {daysOfWeek.map(day => {
                      const clubInRoom = clubs.find(c => c.room === roomName && c.meetingDay === day);

                      return (
                        <td key={day} className="py-3 px-3 text-center border-r border-[#1f232c] last:border-r-0">
                          {clubInRoom ? (
                            <div className="p-2 rounded-lg bg-gradient-to-br from-[#1c1f28] to-[#14161f] border border-[#c5832b]/40 shadow-sm text-left">
                              <div className="text-[10px] text-[#e5a93c] font-semibold truncate">
                                {clubInRoom.name}
                              </div>
                              <div className="text-[9px] text-zinc-400 mt-0.5 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-zinc-500" />
                                {clubInRoom.meetingTime.split('–')[0]}
                              </div>
                              <div className="text-[9px] text-emerald-400 mt-0.5">
                                {clubInRoom.enrolledCount} enrolled
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-600 font-mono">Available</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SEMESTER POLICIES & CONTROLS */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#12141a] border border-[#232730] space-y-6">
            <div>
              <h2 className="text-base font-bold text-white">Semester Governance & Enrollment Window Controls</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Set global boundaries for student workloads, advisor review mandates, and enrollment deadlines.
              </p>
            </div>

            <div className="space-y-4">
              {/* Registration Window Switch */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
                <div>
                  <div className="text-xs font-bold text-white">Fall 2026 Student Registration Window</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    When active, students can browse and submit applications to clubs.
                  </div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ ...settings, registrationOpen: !settings.registrationOpen })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.registrationOpen
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#232730] text-zinc-400'
                  }`}
                  id="btn-toggle-reg-window"
                >
                  {settings.registrationOpen ? 'WINDOW OPEN' : 'WINDOW CLOSED'}
                </button>
              </div>

              {/* Max Clubs per Student */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
                <div>
                  <div className="text-xs font-bold text-white">Max Club Enrollments per Student</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Prevents student burnout and ensures academic balance.
                  </div>
                </div>
                <select
                  value={settings.maxClubsPerStudent}
                  onChange={(e) => onUpdateSettings({ ...settings, maxClubsPerStudent: parseInt(e.target.value) || 3 })}
                  className="px-3 py-1.5 rounded-lg bg-[#181a22] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                >
                  <option value={2}>2 Clubs Maximum</option>
                  <option value={3}>3 Clubs Maximum (Standard)</option>
                  <option value={4}>4 Clubs Maximum (Advanced)</option>
                </select>
              </div>

              {/* Faculty Advisor Approval Mandate */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
                <div>
                  <div className="text-xs font-bold text-white">Faculty Advisor Sign-off Required</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Require teachers to review student statement of interest prior to enrollment confirmation.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireAdvisorApproval}
                  onChange={(e) => onUpdateSettings({ ...settings, requireAdvisorApproval: e.target.checked })}
                  className="w-4 h-4 accent-[#c5832b] rounded"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grant Charter Approval Modal */}
      {charterActionModal.isOpen && charterActionModal.proposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-lg rounded-2xl bg-[#14161f] border border-[#c5832b]/50 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {charterActionModal.action === 'approve'
                ? `Accredit Charter: ${charterActionModal.proposal.clubName}`
                : `Decline Proposal: ${charterActionModal.proposal.clubName}`}
            </h3>

            <p className="text-xs text-zinc-400">
              Petitioned by {charterActionModal.proposal.proposedByStudent} (Gr. {charterActionModal.proposal.studentGrade}) with faculty advisor {charterActionModal.proposal.facultyAdvisor}.
            </p>

            {charterActionModal.action === 'approve' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Assign Official Meeting Room</label>
                  <input
                    type="text"
                    value={assignedRoom}
                    onChange={(e) => setAssignedRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Approved Semester Seed Budget ($)</label>
                  <input
                    type="number"
                    value={allocatedBudget}
                    onChange={(e) => setAllocatedBudget(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Director Endorsement & Charter Notes</label>
                  <textarea
                    rows={3}
                    value={directorNotes}
                    onChange={(e) => setDirectorNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1f232c]">
              <button
                onClick={() => setCharterActionModal({ isOpen: false, proposal: null, action: 'approve' })}
                className="px-4 py-2 rounded-lg bg-[#1c1f28] text-xs text-zinc-300 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (charterActionModal.action === 'approve') {
                    onApproveProposal(charterActionModal.proposal!.id, assignedRoom, allocatedBudget);
                  } else {
                    onRejectProposal(charterActionModal.proposal!.id, directorNotes);
                  }
                  setCharterActionModal({ isOpen: false, proposal: null, action: 'approve' });
                }}
                className={`px-5 py-2 rounded-lg text-xs font-semibold text-white ${
                  charterActionModal.action === 'approve'
                    ? 'bg-[#c5832b] hover:bg-[#a96721]'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {charterActionModal.action === 'approve' ? 'Accredit & Create Syndicate' : 'Decline Petition'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
