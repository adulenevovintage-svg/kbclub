import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Club, 
  Registration, 
  ClubCharterProposal, 
  Announcement, 
  MeetingAttendanceSession, 
  SystemSettings,
  WebsiteContent
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_CLUBS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_CHARTER_PROPOSALS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ATTENDANCE_SESSIONS, 
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_WEBSITE_CONTENT
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { StudentPortal } from './components/StudentPortal';
import { TeacherPortal } from './components/TeacherPortal';
import { DirectorPortal } from './components/DirectorPortal';
import { ClubDetailModal } from './components/ClubDetailModal';
import { RegistrationModal } from './components/RegistrationModal';
import { NewCharterModal } from './components/NewCharterModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // 1. Navigation and Role View States
  const [currentView, setCurrentView] = useState<'landing' | 'operations'>('landing');
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // 2. Persistent Domain State with localStorage
  const [users] = useState(INITIAL_USERS);

  const [clubs, setClubs] = useState<Club[]>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_clubs');
      if (saved) return JSON.parse(saved);
      // Clear legacy storage if present
      localStorage.removeItem('kb_academy_clubs');
      return INITIAL_CLUBS;
    } catch {
      return INITIAL_CLUBS;
    }
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_registrations');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('kb_academy_registrations');
      return INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [proposals, setProposals] = useState<ClubCharterProposal[]>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_proposals');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('kb_academy_proposals');
      return INITIAL_CHARTER_PROPOSALS;
    } catch {
      return INITIAL_CHARTER_PROPOSALS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_announcements');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('kb_academy_announcements');
      return INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [attendanceSessions, setAttendanceSessions] = useState<MeetingAttendanceSession[]>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_attendance');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('kb_academy_attendance');
      return INITIAL_ATTENDANCE_SESSIONS;
    } catch {
      return INITIAL_ATTENDANCE_SESSIONS;
    }
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_settings');
      if (saved) return JSON.parse(saved);
      localStorage.removeItem('kb_academy_settings');
      return INITIAL_SYSTEM_SETTINGS;
    } catch {
      return INITIAL_SYSTEM_SETTINGS;
    }
  });

  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_website_content');
      if (saved) return JSON.parse(saved);
      return INITIAL_WEBSITE_CONTENT;
    } catch {
      return INITIAL_WEBSITE_CONTENT;
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  // Admin mode is strictly INACTIVE by default, reserved ONLY for users who input the password via the settings icon
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Clear any legacy persisted admin session so it is never active by default
  useEffect(() => {
    try {
      localStorage.removeItem('kb_academy_admin_authenticated');
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('kb_academy_v2_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('kb_academy_v2_registrations', JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem('kb_academy_v2_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('kb_academy_v2_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('kb_academy_v2_attendance', JSON.stringify(attendanceSessions));
  }, [attendanceSessions]);

  useEffect(() => {
    localStorage.setItem('kb_academy_v2_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('kb_academy_v2_website_content', JSON.stringify(websiteContent));
  }, [websiteContent]);


  // 3. UI Modal States
  const [selectedClubForDetail, setSelectedClubForDetail] = useState<Club | null>(null);
  const [selectedClubForRegistration, setSelectedClubForRegistration] = useState<Club | null>(null);
  const [isNewCharterModalOpen, setIsNewCharterModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 4. Operational Handlers
  // Launch from Landing into specific role
  const handleEnterRole = (role: UserRole) => {
    setActiveRole(role);
    setCurrentView('operations');
    addToast('info', 'Workspace Loaded', `Switched to ${users[role].name} (${role.toUpperCase()}).`);
  };

  // Student registers for a club
  const handleRegisterSubmit = (statementOfInterest: string) => {
    if (!selectedClubForRegistration) return;
    const club = selectedClubForRegistration;
    const student = users.student;

    // Check student max clubs
    const currentStudentEnrollments = registrations.filter(
      r => r.studentId === student.id && (r.status === 'enrolled' || r.status === 'pending')
    );

    if (currentStudentEnrollments.length >= settings.maxClubsPerStudent) {
      addToast(
        'warning',
        'Maximum Enrollment Limit Reached',
        `KB Academy policy limits students to ${settings.maxClubsPerStudent} concurrent club commitments.`
      );
      setSelectedClubForRegistration(null);
      return;
    }

    // Determine initial status based on capacity & settings
    const isFull = club.enrolledCount >= club.capacity;
    const initialStatus = isFull 
      ? 'waitlisted' 
      : settings.requireAdvisorApproval 
      ? 'pending' 
      : 'enrolled';

    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentGrade: student.grade || 11,
      studentEmail: student.email,
      clubId: club.id,
      clubName: club.name,
      clubCategory: club.category,
      meetingDay: club.meetingDay,
      meetingTime: club.meetingTime,
      registrationDate: new Date().toISOString().split('T')[0],
      status: initialStatus,
      statementOfInterest,
      attendedSessions: 0,
      totalSessions: 0,
    };

    setRegistrations(prev => [newReg, ...prev]);

    // Update club enrolled count if immediate
    if (initialStatus === 'enrolled') {
      setClubs(prev => prev.map(c => 
        c.id === club.id ? { ...c, enrolledCount: c.enrolledCount + 1 } : c
      ));
    }

    setSelectedClubForRegistration(null);

    if (initialStatus === 'waitlisted') {
      addToast('warning', 'Placed on Waitlist', `You are queued for an opening in ${club.name}.`);
    } else if (initialStatus === 'pending') {
      addToast('success', 'Application Submitted', `Sent to faculty advisor ${club.advisorName} for review.`);
    } else {
      addToast('success', 'Registration Confirmed', `You are officially enrolled in ${club.name}!`);
    }
  };

  // Advisor approves application
  const handleApproveRegistration = (regId: string, advisorNote?: string) => {
    const reg = registrations.find(r => r.id === regId);
    if (!reg) return;

    setRegistrations(prev => prev.map(r => 
      r.id === regId ? { ...r, status: 'enrolled', advisorNotes: advisorNote } : r
    ));

    // Increment club enrolled count
    setClubs(prev => prev.map(c => 
      c.id === reg.clubId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c
    ));

    addToast('success', 'Application Approved', `${reg.studentName} has been enrolled in ${reg.clubName}.`);
  };

  // Advisor rejects application
  const handleRejectRegistration = (regId: string, reason?: string) => {
    const reg = registrations.find(r => r.id === regId);
    if (!reg) return;

    setRegistrations(prev => prev.map(r => 
      r.id === regId ? { ...r, status: 'declined', advisorNotes: reason } : r
    ));

    addToast('info', 'Application Declined', `Declined application for ${reg.studentName}.`);
  };

  // Advisor waitlists application
  const handleWaitlistRegistration = (regId: string) => {
    setRegistrations(prev => prev.map(r => 
      r.id === regId ? { ...r, status: 'waitlisted' } : r
    ));
    addToast('warning', 'Applicant Waitlisted', 'Student moved to priority waitlist.');
  };

  // Student drops/withdraws from club
  const handleDropClub = (registrationId: string) => {
    const reg = registrations.find(r => r.id === registrationId);
    if (!reg) return;

    setRegistrations(prev => prev.filter(r => r.id !== registrationId));

    if (reg.status === 'enrolled') {
      setClubs(prev => prev.map(c => 
        c.id === reg.clubId ? { ...c, enrolledCount: Math.max(0, c.enrolledCount - 1) } : c
      ));
    }

    addToast('info', 'Registration Withdrawn', `You withdrew from ${reg.clubName}.`);
  };

  // Teacher submits live session attendance
  const handleSaveAttendanceSession = (session: MeetingAttendanceSession) => {
    setAttendanceSessions(prev => [session, ...prev]);

    // Update student attended counters
    const presentStudentIds = new Set(
      session.entries.filter(e => e.status === 'present').map(e => e.studentId)
    );

    setRegistrations(prev => prev.map(r => {
      if (r.clubId === session.clubId && r.status === 'enrolled') {
        const wasPresent = presentStudentIds.has(r.studentId);
        return {
          ...r,
          totalSessions: (r.totalSessions || 0) + 1,
          attendedSessions: (r.attendedSessions || 0) + (wasPresent ? 1 : 0),
        };
      }
      return r;
    }));

    addToast('success', 'Attendance Finalized', `Recorded verified session for ${session.entries.length} students.`);
  };

  // Teacher or Director posts announcement
  const handlePostAnnouncement = (announcementData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `ann-${Date.now()}`,
      date: 'Just now',
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    addToast('success', 'Bulletin Published', 'Sent notice to all registered members.');
  };

  // Director approves new club charter
  const handleApproveProposal = (proposalId: string, assignedRoom: string, approvedBudget: number) => {
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop) return;

    // Update proposal
    setProposals(prev => prev.map(p => 
      p.id === proposalId ? {
        ...p,
        directorStatus: 'approved',
        assignedRoom,
        approvedBudget,
        directorFeedback: 'Charter petition approved by Highschool Director Mr. Wondwossen Erqiyhun. Official operational accreditation granted.'
      } : p
    ));

    // Create newly chartered club in clubs catalog!
    const newClubId = `club-${prop.clubName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const newClub: Club = {
      id: newClubId,
      name: prop.clubName,
      code: `KB-${prop.clubName.slice(0, 3).toUpperCase()}-0${clubs.length + 1}`,
      category: prop.category,
      tagline: prop.missionStatement.slice(0, 90) + '...',
      description: prop.missionStatement,
      advisorName: prop.facultyAdvisor,
      advisorEmail: prop.facultyEmail,
      advisorTitle: 'Charter Faculty Sponsor',
      studentPresident: `${prop.proposedByStudent} (Founding President)`,
      meetingDay: prop.proposedMeetingDay,
      meetingTime: prop.proposedTimeSlot,
      timeSlotKey: `${prop.proposedMeetingDay}-${prop.proposedTimeSlot.replace(/[^0-9]/g, '')}`,
      room: assignedRoom,
      building: 'Academy Academic Complex',
      capacity: prop.estimatedMembers || 20,
      enrolledCount: 1, // Founding petitioner
      gradesEligible: [9, 10, 11, 12],
      duesPerSemester: 25,
      prerequisites: 'Founding membership open to all interested scholars.',
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
      tags: ['Chartered 2026', 'Student Led', prop.category],
      status: 'Active',
      charterYear: 2026,
      allocatedBudget: approvedBudget,
      syllabus: [
        { week: 1, topic: 'Inaugural Charter Meeting & Committee Formation', objective: 'Elect secondary officers and outline semester deliverables.' },
        { week: 2, topic: 'Project Scoping & Budget Disbursement', objective: 'Authorize equipment purchases and assign working groups.' },
        { week: 3, topic: 'Collaborative Workshop Session', objective: 'Execute primary initiatives in assigned academy facility.' }
      ],
      officers: [
        { role: 'Founding President', name: prop.proposedByStudent, grade: prop.studentGrade }
      ],
      upcomingMeetings: [
        { id: `m-${Date.now()}`, title: 'Inaugural Charter Session', date: `First ${prop.proposedMeetingDay}`, time: prop.proposedTimeSlot, room: assignedRoom, agenda: 'Orientation and charter celebration.' }
      ]
    };

    setClubs(prev => [newClub, ...prev]);

    // Automatically enroll the petitioner
    const foundingReg: Registration = {
      id: `reg-${Date.now()}`,
      studentId: users.student.id,
      studentName: prop.proposedByStudent,
      studentGrade: prop.studentGrade,
      studentEmail: prop.studentEmail,
      clubId: newClubId,
      clubName: newClub.name,
      clubCategory: newClub.category,
      meetingDay: newClub.meetingDay,
      meetingTime: newClub.meetingTime,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'enrolled',
      statementOfInterest: 'Founding Charter Petitioner',
      attendedSessions: 0,
      totalSessions: 0
    };
    setRegistrations(prev => [foundingReg, ...prev]);

    addToast('success', 'Charter Accredited!', `"${prop.clubName}" is now an official active KB Academy organization.`);
  };

  // Director rejects proposal
  const handleRejectProposal = (proposalId: string, feedback: string) => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId ? {
        ...p,
        directorStatus: 'rejected',
        directorFeedback: feedback
      } : p
    ));
    addToast('info', 'Proposal Declined', 'Petitioner has been notified of the director feedback.');
  };

  // Student submits charter proposal
  const handleCreateProposal = (proposalData: Omit<ClubCharterProposal, 'id' | 'submissionDate' | 'directorStatus'>) => {
    const newProp: ClubCharterProposal = {
      ...proposalData,
      id: `prop-${Date.now()}`,
      submissionDate: new Date().toISOString().split('T')[0],
      directorStatus: 'pending',
    };

    setProposals(prev => [newProp, ...prev]);
    setIsNewCharterModalOpen(false);
    addToast('success', 'Charter Petition Submitted', 'Transmitted to Highschool Director Mr. Wondwossen Erqiyhun for official evaluation.');
  };

  // Director updates capacity
  const handleUpdateClubCapacity = (clubId: string, newCapacity: number) => {
    setClubs(prev => prev.map(c => 
      c.id === clubId ? { ...c, capacity: newCapacity } : c
    ));
    addToast('info', 'Capacity Updated', `Adjusted seat cap to ${newCapacity}.`);
  };

  // Director toggles club status
  const handleToggleClubStatus = (clubId: string) => {
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        const nextStatus = c.status === 'Active' ? 'Registration Closed' : 'Active';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Reset to initial demo data
  const handleResetData = () => {
    localStorage.clear();
    setClubs(INITIAL_CLUBS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setProposals(INITIAL_CHARTER_PROPOSALS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setAttendanceSessions(INITIAL_ATTENDANCE_SESSIONS);
    setSettings(INITIAL_SYSTEM_SETTINGS);
    setWebsiteContent(INITIAL_WEBSITE_CONTENT);
    setIsAdminAuthenticated(false);
    addToast('info', 'System Reset', 'Restored pristine KB Academy baseline dataset.');
  };

  // Check conflicts for student
  const studentEnrolledRegistrations = registrations.filter(
    r => r.studentId === users.student.id && r.status === 'enrolled'
  );
  const studentOccupiedSlots = new Map<string, { clubName: string; day: string; time: string }>();
  studentEnrolledRegistrations.forEach(r => {
    const club = clubs.find(c => c.id === r.clubId);
    if (club) {
      studentOccupiedSlots.set(club.timeSlotKey, {
        clubName: club.name,
        day: club.meetingDay,
        time: club.meetingTime
      });
    }
  });

  const detailClubConflict = selectedClubForDetail 
    ? studentOccupiedSlots.get(selectedClubForDetail.timeSlotKey)
    : undefined;
  const isDetailClubEnrolled = selectedClubForDetail
    ? studentEnrolledRegistrations.some(r => r.clubId === selectedClubForDetail.id)
    : false;
  const isDetailClubPending = selectedClubForDetail
    ? registrations.some(r => r.clubId === selectedClubForDetail.id && r.studentId === users.student.id && r.status === 'pending')
    : false;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      currentView === 'landing' ? 'bg-white text-zinc-900' : 'bg-[#0c0d10] text-[#f4f4f5]'
    }`}>
      {/* 1. Global Navigation Bar - rendered only in operations view */}
      {currentView === 'operations' && (
        <Navbar
          currentView={currentView}
          setCurrentView={setCurrentView}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          users={users}
          unreadCount={announcements.length}
          onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
          registrationOpen={settings.registrationOpen}
        />
      )}

      {/* 2. Primary Body Content */}
      <main className="flex-1 w-full">
        {currentView === 'landing' ? (
          <LandingView
            onEnterRole={handleEnterRole}
            clubs={clubs}
            onUpdateClubs={setClubs}
            onSelectClub={(club) => setSelectedClubForDetail(club)}
            websiteContent={websiteContent}
            onUpdateWebsiteContent={setWebsiteContent}
            onOpenAdminLogin={() => setIsAdminModalOpen(true)}
            isAdminAuthenticated={isAdminAuthenticated}
            setIsAdminAuthenticated={setIsAdminAuthenticated}
            onAddToast={addToast}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {activeRole === 'student' && (
              <StudentPortal
                student={users.student}
                clubs={clubs}
                registrations={registrations}
                onRegisterClick={(club) => setSelectedClubForRegistration(club)}
                onSelectClub={(club) => setSelectedClubForDetail(club)}
                onOpenCharterModal={() => setIsNewCharterModalOpen(true)}
                onDropClub={handleDropClub}
              />
            )}

            {activeRole === 'teacher' && (
              <TeacherPortal
                teacher={users.teacher}
                clubs={clubs}
                registrations={registrations}
                attendanceSessions={attendanceSessions}
                announcements={announcements}
                onApproveRegistration={handleApproveRegistration}
                onRejectRegistration={handleRejectRegistration}
                onWaitlistRegistration={handleWaitlistRegistration}
                onSaveAttendanceSession={handleSaveAttendanceSession}
                onPostAnnouncement={handlePostAnnouncement}
              />
            )}

            {activeRole === 'director' && (
              <DirectorPortal
                director={users.director}
                clubs={clubs}
                registrations={registrations}
                proposals={proposals}
                settings={settings}
                onApproveProposal={handleApproveProposal}
                onRejectProposal={handleRejectProposal}
                onUpdateSettings={setSettings}
                onUpdateClubCapacity={handleUpdateClubCapacity}
                onToggleClubStatus={handleToggleClubStatus}
              />
            )}

            {/* Quick Demo Reset / Utility Helper in Operations View */}
            <div className="mt-16 pt-6 border-t border-[#1f232c] flex items-center justify-between text-xs text-zinc-500">
              <div>
                <span>KB Academy Operations Suite &bull; Active Mode: </span>
                <strong className="text-zinc-300 capitalize">{activeRole} View</strong>
              </div>
              <button
                onClick={handleResetData}
                className="hover:text-zinc-300 transition-colors text-[11px] underline underline-offset-4"
              >
                Reset Demo Data
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 3. Modals and Overlays */}
      {selectedClubForDetail && (
        <ClubDetailModal
          club={selectedClubForDetail}
          onClose={() => setSelectedClubForDetail(null)}
          onRegisterClick={(club) => {
            setSelectedClubForRegistration(club);
          }}
          isEnrolled={isDetailClubEnrolled}
          isPending={isDetailClubPending}
          hasConflict={!!detailClubConflict && !isDetailClubEnrolled}
          conflictDetails={detailClubConflict}
        />
      )}

      {selectedClubForRegistration && (
        <RegistrationModal
          club={selectedClubForRegistration}
          student={users.student}
          onClose={() => setSelectedClubForRegistration(null)}
          onSubmit={handleRegisterSubmit}
          requireAdvisorApproval={settings.requireAdvisorApproval}
        />
      )}

      {isNewCharterModalOpen && (
        <NewCharterModal
          user={users[activeRole]}
          onClose={() => setIsNewCharterModalOpen(false)}
          onSubmitProposal={handleCreateProposal}
        />
      )}

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        announcements={announcements}
      />

      {/* Admin Login Modal (Triggered by settings icon in Real School Operations) */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => setIsAdminAuthenticated(true)}
        onAddToast={addToast}
      />

      {/* Toast Alerts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
