import React, { useState } from 'react';
import { 
  Club, 
  Registration, 
  UserProfile, 
  MeetingAttendanceSession, 
  AttendanceEntry,
  Announcement 
} from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  BookOpen, 
  Calendar, 
  Check, 
  QrCode, 
  Send, 
  FileSpreadsheet, 
  AlertCircle, 
  Megaphone,
  Sparkles,
  MapPin,
  ClipboardCheck,
  Building2,
  Shield
} from 'lucide-react';

interface TeacherPortalProps {
  teacher: UserProfile;
  clubs: Club[];
  registrations: Registration[];
  attendanceSessions: MeetingAttendanceSession[];
  announcements: Announcement[];
  onApproveRegistration: (regId: string, advisorNote?: string) => void;
  onRejectRegistration: (regId: string, reason?: string) => void;
  onWaitlistRegistration: (regId: string) => void;
  onSaveAttendanceSession: (session: MeetingAttendanceSession) => void;
  onPostAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  teacher,
  clubs,
  registrations,
  attendanceSessions,
  announcements,
  onApproveRegistration,
  onRejectRegistration,
  onWaitlistRegistration,
  onSaveAttendanceSession,
  onPostAnnouncement,
}) => {
  // Find clubs advised by this teacher
  const advisedClubs = clubs.filter(c => 
    c.advisorEmail.toLowerCase() === teacher.email.toLowerCase() || 
    c.advisorName.toLowerCase().includes(teacher.name.toLowerCase()) ||
    c.advisorName.toLowerCase().includes('faculty') ||
    c.advisorName.toLowerCase().includes('advisor')
  );

  const [selectedClubId, setSelectedClubId] = useState<string>(
    advisedClubs.length > 0 ? advisedClubs[0].id : clubs[0]?.id || ''
  );

  const currentClub = clubs.find(c => c.id === selectedClubId) || advisedClubs[0] || clubs[0];

  const [activeTab, setActiveTab] = useState<'approvals' | 'attendance' | 'schedule' | 'broadcast'>('approvals');

  // Registrations for the selected club
  const clubRegistrations = registrations.filter(r => r.clubId === currentClub?.id);
  const pendingRegistrations = clubRegistrations.filter(r => r.status === 'pending');
  const enrolledRegistrations = clubRegistrations.filter(r => r.status === 'enrolled');

  // Attendance local form state
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionTopic, setSessionTopic] = useState<string>('Autonomous Odometry & Sensor Calibration');
  const [attendanceList, setAttendanceList] = useState<AttendanceEntry[]>(() => {
    return enrolledRegistrations.map(r => ({
      studentId: r.studentId,
      studentName: r.studentName,
      studentGrade: r.studentGrade,
      status: 'present' as const
    }));
  });

  // Keep attendance list in sync when enrolled change
  React.useEffect(() => {
    setAttendanceList(
      enrolledRegistrations.map(r => ({
        studentId: r.studentId,
        studentName: r.studentName,
        studentGrade: r.studentGrade,
        status: 'present' as const
      }))
    );
  }, [enrolledRegistrations.length, selectedClubId]);

  // QR Modal toggle
  const [showQrModal, setShowQrModal] = useState(false);

  // Broadcast state
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');
  const [announcementPriority, setAnnouncementPriority] = useState<'normal' | 'urgent'>('normal');

  // Note dialog state for approvals
  const [reviewNoteModal, setReviewNoteModal] = useState<{
    isOpen: boolean;
    regId: string;
    action: 'approve' | 'reject';
    studentName: string;
  }>({ isOpen: false, regId: '', action: 'approve', studentName: '' });
  const [noteText, setNoteText] = useState('');

  const handleUpdateStatus = (studentId: string, newStatus: 'present' | 'absent' | 'excused') => {
    setAttendanceList(prev => prev.map(entry => 
      entry.studentId === studentId ? { ...entry, status: newStatus } : entry
    ));
  };

  const handleMarkAllPresent = () => {
    setAttendanceList(prev => prev.map(entry => ({ ...entry, status: 'present' })));
  };

  const handleFinalizeAttendance = () => {
    if (!currentClub) return;
    const newSession: MeetingAttendanceSession = {
      id: `att-${Date.now()}`,
      clubId: currentClub.id,
      date: sessionDate,
      meetingTitle: sessionTopic,
      topicCovered: sessionTopic,
      submittedBy: teacher.name,
      completed: true,
      entries: attendanceList
    };
    onSaveAttendanceSession(newSession);
  };

  const handleSubmitAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementContent.trim() || !currentClub) return;
    onPostAnnouncement({
      clubId: currentClub.id,
      clubName: currentClub.name,
      authorName: teacher.name,
      authorRole: 'Faculty Advisor',
      title: announcementTitle,
      content: announcementContent,
      priority: announcementPriority
    });
    setAnnouncementTitle('');
    setAnnouncementContent('');
  };

  if (!currentClub) {
    return <div className="p-8 text-center text-zinc-400">No advised clubs found for this faculty profile.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Teacher Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14161f] via-[#12141a] to-[#0c0d10] border border-[#232730] shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={teacher.avatarUrl} 
              alt={teacher.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#c5832b]/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white tracking-tight">{teacher.name}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#c5832b]/15 text-[#e5a93c] border border-[#c5832b]/30 font-medium">
                  Faculty Advisor
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                {teacher.title} &bull; {teacher.department}
              </p>
            </div>
          </div>

          {/* Advised Club Switcher */}
          <div className="flex items-center gap-3 bg-[#0c0d10] p-2 rounded-xl border border-[#232730]">
            <span className="text-xs text-zinc-400 pl-2">Active Syndicate:</span>
            <select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              className="bg-[#181a22] text-xs font-semibold text-white px-3 py-1.5 rounded-lg border border-[#2a2e3a] focus:outline-none focus:border-[#c5832b]"
              id="teacher-club-selector"
            >
              {advisedClubs.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Club Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#1f232c]">
          <div className="p-3 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="text-[11px] text-zinc-400">Total Roster</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {currentClub.enrolledCount} <span className="text-xs text-zinc-500 font-normal">/ {currentClub.capacity} seats</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="text-[11px] text-zinc-400">Pending Review</div>
            <div className="text-lg font-bold text-amber-400 mt-0.5 flex items-center gap-1.5">
              <span>{pendingRegistrations.length}</span>
              {pendingRegistrations.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-normal">
                  Action Required
                </span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="text-[11px] text-zinc-400">Meeting Room</div>
            <div className="text-xs font-bold text-zinc-200 mt-1 truncate">
              {currentClub.room}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="text-[11px] text-zinc-400">Weekly Cadence</div>
            <div className="text-xs font-bold text-[#c5832b] mt-1">
              {currentClub.meetingDay} &bull; {currentClub.meetingTime.split('–')[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#232730] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
          }`}
          id="tab-teacher-attendance"
        >
          <Users className="w-3.5 h-3.5" />
          Track Records & Attendance
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
          }`}
          id="tab-teacher-approvals"
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          Club Status & Registration Queue
          {pendingRegistrations.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-bold text-[10px]">
              {pendingRegistrations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
          }`}
          id="tab-teacher-schedule"
        >
          <Building2 className="w-3.5 h-3.5" />
          Room & Logistics
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'broadcast'
              ? 'bg-[#c5832b] text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14161f]'
          }`}
          id="tab-teacher-broadcast"
        >
          <Megaphone className="w-3.5 h-3.5" />
          Announcements ({announcements.filter(a => a.clubId === currentClub.id).length})
        </button>
      </div>

      {/* TAB 1: REGISTRATION REVIEW QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Student Registration Applications</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Review candidate statements of interest, evaluate grade eligibility, and admit to syndicate.
              </p>
            </div>
            <div className="text-xs text-zinc-400">
              Capacity: <strong className="text-white">{currentClub.enrolledCount}</strong> / {currentClub.capacity} filled
            </div>
          </div>

          {pendingRegistrations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#12141a] border border-[#232730]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">Queue is clear!</h3>
              <p className="text-xs text-zinc-400 mt-1">All student registration requests have been reviewed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRegistrations.map(reg => (
                <div 
                  key={reg.id}
                  className="p-5 rounded-2xl bg-[#12141a] border border-[#232730] hover:border-[#2e3444] transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1c1f28] border border-[#2a2e3a] flex items-center justify-center font-bold text-white text-xs">
                        Gr {reg.studentGrade}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{reg.studentName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1f232c] text-zinc-300 font-mono">
                            {reg.studentEmail}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">
                          Submitted on {reg.registrationDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReviewNoteModal({
                            isOpen: true,
                            regId: reg.id,
                            action: 'approve',
                            studentName: reg.studentName
                          });
                          setNoteText('Approved. Welcome to the syndicate!');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        id={`btn-approve-${reg.id}`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>

                      <button
                        onClick={() => onWaitlistRegistration(reg.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#1a1d26] hover:bg-[#222632] border border-[#2a2e3a] text-amber-300 text-xs font-medium transition-colors"
                      >
                        Waitlist
                      </button>

                      <button
                        onClick={() => {
                          setReviewNoteModal({
                            isOpen: true,
                            regId: reg.id,
                            action: 'reject',
                            studentName: reg.studentName
                          });
                          setNoteText('Thank you for applying. Currently at capacity for this grade level.');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  </div>

                  {/* Statement of Interest */}
                  <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-[#1f232c] text-xs text-zinc-300 leading-relaxed">
                    <span className="text-zinc-500 font-semibold block mb-1">Applicant Statement of Interest:</span>
                    “{reg.statementOfInterest || 'Student did not include an optional statement.'}”
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Enrolled Roster Quick List */}
          <div className="mt-8 pt-6 border-t border-[#232730]">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c5832b]" />
              Currently Enrolled Roster ({enrolledRegistrations.length} students)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-[#232730] bg-[#12141a]">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-[#181a22] text-zinc-400 font-semibold border-b border-[#232730]">
                  <tr>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4">Grade</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Enrolled Date</th>
                    <th className="py-2.5 px-4">Attendance</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f232c]">
                  {enrolledRegistrations.map(r => (
                    <tr key={r.id} className="hover:bg-[#151821]">
                      <td className="py-3 px-4 font-medium text-white">{r.studentName}</td>
                      <td className="py-3 px-4 text-zinc-400">Grade {r.studentGrade}</td>
                      <td className="py-3 px-4 text-zinc-400 font-mono">{r.studentEmail}</td>
                      <td className="py-3 px-4 text-zinc-400">{r.registrationDate}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">
                        {r.attendedSessions || 4} / {r.totalSessions || 4} Sessions
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-medium">
                          Active Member
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROSTER & LIVE ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#12141a] border border-[#232730]">
            <div>
              <h2 className="text-base font-bold text-white">Digital Attendance Session</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Log attendance for today’s meeting. Records sync immediately to student portals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowQrModal(true)}
                className="px-3.5 py-2 rounded-lg bg-[#1a1d26] hover:bg-[#222734] border border-[#2e3444] text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-colors"
                id="btn-show-qr"
              >
                <QrCode className="w-4 h-4 text-[#c5832b]" />
                Project In-Room QR Code
              </button>

              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-2 rounded-lg bg-[#181a22] hover:bg-[#242835] border border-[#2e3444] text-xs font-semibold text-emerald-400 flex items-center gap-2 transition-colors"
                id="btn-mark-all-present"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark All Present
              </button>
            </div>
          </div>

          {/* Session parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Session Date</label>
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Meeting Topic / Objective</label>
              <input
                type="text"
                value={sessionTopic}
                onChange={(e) => setSessionTopic(e.target.value)}
                placeholder="e.g. Subsystem CAD Review & Driver Scrimmage"
                className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              />
            </div>
          </div>

          {/* Attendance Roster Table */}
          <div className="rounded-xl border border-[#232730] overflow-hidden bg-[#12141a]">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#181a22] text-zinc-400 font-semibold border-b border-[#232730]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Faculty Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f232c]">
                {attendanceList.map(entry => (
                  <tr key={entry.studentId} className="hover:bg-[#151821]">
                    <td className="py-3 px-4 font-medium text-white">
                      {entry.studentName}
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      Grade {entry.studentGrade}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(entry.studentId, 'present')}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                            entry.status === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-[#181a22] text-zinc-400 hover:text-white'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(entry.studentId, 'absent')}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                            entry.status === 'absent'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-[#181a22] text-zinc-400 hover:text-white'
                          }`}
                        >
                          Absent
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(entry.studentId, 'excused')}
                          className={`px-3 py-1 rounded text-[11px] font-semibold transition-all ${
                            entry.status === 'excused'
                              ? 'bg-[#c5832b] text-white shadow-sm'
                              : 'bg-[#181a22] text-zinc-400 hover:text-white'
                          }`}
                        >
                          Excused
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        placeholder="Optional session note..."
                        value={entry.note || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAttendanceList(prev => prev.map(item => 
                            item.studentId === entry.studentId ? { ...item, note: val } : item
                          ));
                        }}
                        className="w-full px-2.5 py-1 rounded bg-[#0c0d10] border border-[#232730] text-[11px] text-zinc-300 focus:outline-none focus:border-[#c5832b]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-zinc-400">
              Present: <strong className="text-emerald-400">{attendanceList.filter(e => e.status === 'present').length}</strong> &bull; 
              Absent: <strong className="text-rose-400 ml-1">{attendanceList.filter(e => e.status === 'absent').length}</strong> &bull; 
              Excused: <strong className="text-[#c5832b] ml-1">{attendanceList.filter(e => e.status === 'excused').length}</strong>
            </div>

            <button
              onClick={handleFinalizeAttendance}
              className="px-5 py-2.5 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-semibold transition-all shadow-md shadow-[#c5832b]/20 flex items-center gap-2"
              id="btn-finalize-attendance"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalize & Submit Session Log
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ROOM & LOGISTICS */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#12141a] border border-[#232730] space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#c5832b] font-semibold">Facilities Verification</span>
                <h2 className="text-lg font-bold text-white mt-1">Confirmed Room Assignment</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Assigned by the Office of Student Life under the master academic space reservation accord.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                Room Reserved & Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
                <div className="text-xs text-zinc-500">Assigned Facility</div>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#c5832b]" />
                  {currentClub.room}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">{currentClub.building}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
                <div className="text-xs text-zinc-500">Permitted Time Window</div>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#c5832b]" />
                  Every {currentClub.meetingDay}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">{currentClub.meetingTime}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
                <div className="text-xs text-zinc-500">Fire Safety Max Occupancy</div>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  32 Persons Max
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">Current Roster: {currentClub.enrolledCount}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#161821] border border-[#232730]">
              <h4 className="text-xs font-bold text-white mb-2">Dedicated Lab Equipment & Safety Clearance</h4>
              <ul className="text-xs text-zinc-400 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Dual Prusa XL CoreXY 3D Printing Enclosures (Cleared for PETG & Carbon Fiber)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Isolated 120V / 20A Dedicated Electronics Soldering Bench with Fume Extractors
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Emergency Eye-Wash Station & Class-D Fire Extinguisher (Inspected Aug 2026)
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BROADCAST ANNOUNCEMENTS */}
      {activeTab === 'broadcast' && (
        <div className="space-y-6">
          {/* Post Form */}
          <form onSubmit={handleSubmitAnnouncement} className="p-6 rounded-2xl bg-[#12141a] border border-[#232730] space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">Broadcast Syndicate Bulletin</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Post an official advisory announcement to all enrolled {currentClub.name} members.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Headline</label>
              <input
                type="text"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                placeholder="e.g. Scrimmage Timing Update & Autonomous Tuning Requirements"
                className="w-full px-3 py-2.5 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Announcement Message</label>
              <textarea
                rows={3}
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                placeholder="Include key details, materials to prepare, or schedule modifications..."
                className="w-full px-3 py-2.5 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-400">Priority:</label>
                <select
                  value={announcementPriority}
                  onChange={(e) => setAnnouncementPriority(e.target.value as 'normal' | 'urgent')}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-zinc-300 focus:outline-none focus:border-[#c5832b]"
                >
                  <option value="normal">Standard Notice</option>
                  <option value="urgent">Urgent / Time-Sensitive</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                Publish to Club Roster
              </button>
            </div>
          </form>

          {/* Past Announcements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Published Bulletins</h4>
            {announcements.filter(a => a.clubId === currentClub.id || a.clubId === 'system-wide').map(a => (
              <div key={a.id} className="p-4 rounded-xl bg-[#12141a] border border-[#232730] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{a.title}</span>
                    {a.priority === 'urgent' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500">{a.date}</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{a.content}</p>
                <div className="text-[10px] text-zinc-500">
                  By {a.authorName} ({a.authorRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In-Room QR Code Projector Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="relative w-full max-w-sm rounded-2xl bg-[#14161f] border border-[#c5832b]/50 p-6 text-center space-y-4 shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#c5832b]/20 text-[#c5832b] flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Live Meeting Check-in QR</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Project this on classroom monitor for students to tap & register attendance.
              </p>
            </div>

            {/* Generated Mock QR Display */}
            <div className="p-4 bg-white rounded-xl mx-auto inline-block shadow-inner">
              <div className="w-44 h-44 bg-neutral-900 rounded-lg flex flex-col items-center justify-center p-2 text-center text-white relative">
                <div className="absolute inset-2 border-2 border-dashed border-[#c5832b]/60 rounded-md"></div>
                <span className="font-crest font-bold text-xl text-[#c5832b]">KB-ROB-01</span>
                <span className="text-[10px] text-zinc-300 mt-1">Session Token: #9384-KB</span>
                <span className="text-[9px] text-emerald-400 mt-2 font-mono">Live Validation Active</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400">
              Valid for {currentClub.meetingDay} session in {currentClub.room}.
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-lg bg-[#1e222d] text-xs font-semibold text-zinc-200 hover:text-white"
            >
              Dismiss Projection
            </button>
          </div>
        </div>
      )}

      {/* Review Note Modal */}
      {reviewNoteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="w-full max-w-md rounded-2xl bg-[#14161f] border border-[#2a2e3a] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              {reviewNoteModal.action === 'approve' ? 'Approve Registration' : 'Decline Application'}
            </h3>
            <p className="text-xs text-zinc-400">
              {reviewNoteModal.action === 'approve'
                ? `Confirm admission for ${reviewNoteModal.studentName} to ${currentClub.name}.`
                : `Provide guidance or reason for ${reviewNoteModal.studentName}.`}
            </p>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Advisor Feedback / Welcome Note</label>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReviewNoteModal({ isOpen: false, regId: '', action: 'approve', studentName: '' })}
                className="px-3.5 py-1.5 rounded-lg bg-[#1c1f28] text-xs text-zinc-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (reviewNoteModal.action === 'approve') {
                    onApproveRegistration(reviewNoteModal.regId, noteText);
                  } else {
                    onRejectRegistration(reviewNoteModal.regId, noteText);
                  }
                  setReviewNoteModal({ isOpen: false, regId: '', action: 'approve', studentName: '' });
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white ${
                  reviewNoteModal.action === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {reviewNoteModal.action === 'approve' ? 'Approval' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
