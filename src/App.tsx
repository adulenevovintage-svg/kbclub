import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Club, 
  Registration, 
  ClubCharterProposal, 
  Announcement, 
  MeetingAttendanceSession, 
  SystemSettings,
  WebsiteContent,
  UserProfile,
  StudentAccount
} from './types';
import { 
  INITIAL_USERS, 
  INITIAL_CLUBS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_CHARTER_PROPOSALS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_ATTENDANCE_SESSIONS, 
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_WEBSITE_CONTENT,
  INITIAL_STUDENT_ACCOUNTS
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
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentIDCardModal } from './components/StudentIDCardModal';
import { Toast, ToastMessage } from './components/Toast';
import { ArrowLeft, Home, Compass } from 'lucide-react';

export default function App() {
  // 1. Navigation and Role View States
  const [currentView, setCurrentView] = useState<'landing' | 'operations'>('landing');
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  // 2. Student Accounts & Authentication State
  const [studentAccounts, setStudentAccounts] = useState<StudentAccount[]>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_student_accounts');
      if (saved) return JSON.parse(saved);
      return INITIAL_STUDENT_ACCOUNTS;
    } catch {
      return INITIAL_STUDENT_ACCOUNTS;
    }
  });

  const [currentStudentId, setCurrentStudentId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_active_student_id');
      if (saved) return saved;
      return INITIAL_STUDENT_ACCOUNTS[0]?.id || 'KB-2026-11B-10492';
    } catch {
      return INITIAL_STUDENT_ACCOUNTS[0]?.id || 'KB-2026-11B-10492';
    }
  });

  // Current active student profile
  const activeStudentAccount = studentAccounts.find(a => a.id === currentStudentId) || studentAccounts[0] || INITIAL_STUDENT_ACCOUNTS[0];

  // Dynamic user dictionary
  const users: Record<string, UserProfile> = {
    ...INITIAL_USERS,
    student: {
      id: activeStudentAccount.id,
      name: activeStudentAccount.fullName,
      fatherName: activeStudentAccount.fatherName,
      section: activeStudentAccount.section,
      studentIdNumber: activeStudentAccount.studentIdNumber,
      role: 'student',
      grade: activeStudentAccount.grade,
      email: activeStudentAccount.email,
      title: `Junior Scholar (Grade ${activeStudentAccount.grade}-${activeStudentAccount.section})`,
      avatarUrl: activeStudentAccount.avatarUrl || INITIAL_USERS.student.avatarUrl,
    }
  };

  const [clubs, setClubs] = useState<Club[]>(() => {
    try {
      const saved = localStorage.getItem('kb_academy_v2_clubs');
      if (saved) {
        const parsed: Club[] = JSON.parse(saved);
        return parsed.map(c => (!c.advisorName || c.advisorName === 'Faculty Advisor' || c.id === 'club-robotics' || c.id === 'club-aerospace') ? { ...c, advisorName: 'Mr. Fasil', advisorEmail: 'fasil@kbacademy.edu', advisorTitle: 'Faculty Advisor' } : c);
      }
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
      if (saved) {
        const parsed: Announcement[] = JSON.parse(saved);
        return parsed.map(a => {
          if (a.id === 'ann-2' || a.title?.includes('Regional Qualifier') || a.title?.includes('Regional Question and Answer') || a.title?.includes('Lab 204') || a.badgeText?.includes('LAB DISPATCH') || a.badgeText?.includes('REGIONAL CHAMPIONS') || a.clubId === 'club-robotics') {
            return {
              ...a,
              title: 'Regional Question and Answer Champions ',
              summary: 'Our proud and outstanding students remarkable achievements , We are proud of you ',
              content: 'Our proud and outstanding students remarkable achievements , We are proud of you . Congratulations to all participating scholars and faculty mentors on bringing home the championship title.',
              coverImage: 'https://cdn.phototourl.com/free/2026-09-20-27a9f26b-61b4-4adf-8ed5-16e5600b89d1.jpg',
              authorName: 'Mr. Fasil',
              authorRole: 'Faculty Advisor',
              badgeText: '🏆 REGIONAL CHAMPIONS',
              category: 'Championship'
            };
          }
          return a;
        });
      }
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

  // Student Auth Modal state & Student ID card modal state
  const [isStudentAuthModalOpen, setIsStudentAuthModalOpen] = useState(false);
  const [studentAuthInitialMode, setStudentAuthInitialMode] = useState<'register' | 'login'>('register');
  const [isStudentIDCardModalOpen, setIsStudentIDCardModalOpen] = useState(false);

  // Clear any legacy persisted admin session and ensure updated image & faculty advisor
  useEffect(() => {
    try {
      localStorage.removeItem('kb_academy_admin_authenticated');
    } catch {
      // ignore
    }

    setAnnouncements(prev => prev.map(a => {
      if (a.id === 'ann-2' || a.title?.includes('Regional Qualifier') || a.title?.includes('Regional Question and Answer') || a.title?.includes('Lab 204') || a.badgeText?.includes('LAB DISPATCH') || a.badgeText?.includes('REGIONAL CHAMPIONS') || a.clubId === 'club-robotics') {
        return {
          ...a,
          title: 'Regional Question and Answer Champions ',
          summary: 'Our proud and outstanding students remarkable achievements , We are proud of you ',
          content: 'Our proud and outstanding students remarkable achievements , We are proud of you . Congratulations to all participating scholars and faculty mentors on bringing home the championship title.',
          coverImage: 'https://cdn.phototourl.com/free/2026-09-20-27a9f26b-61b4-4adf-8ed5-16e5600b89d1.jpg',
          authorName: 'Mr. Fasil',
          authorRole: 'Faculty Advisor',
          badgeText: '🏆 REGIONAL CHAMPIONS',
          category: 'Championship'
        };
      }
      return a;
    }));

    setClubs(prev => prev.map(c => {
      if (!c.advisorName || c.advisorName === 'Faculty Advisor' || c.id === 'club-robotics' || c.id === 'club-aerospace') {
        return {
          ...c,
          advisorName: 'Mr. Fasil',
          advisorEmail: 'fasil@kbacademy.edu',
          advisorTitle: 'Faculty Advisor'
        };
      }
      return c;
    }));
  }, []);

  // Save student state
  useEffect(() => {
    localStorage.setItem('kb_academy_v2_student_accounts', JSON.stringify(studentAccounts));
  }, [studentAccounts]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem('kb_academy_v2_active_student_id', currentStudentId);
    }
  }, [currentStudentId]);

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

  // Student Registration & Auth handlers
  const handleOpenStudentAuth = (mode: 'register' | 'login' = 'register') => {
    setStudentAuthInitialMode(mode);
    setIsStudentAuthModalOpen(true);
  };

  const handleRegisterSuccess = (newAccount: StudentAccount) => {
    setStudentAccounts(prev => [newAccount, ...prev.filter(a => a.id !== newAccount.id)]);
    setCurrentStudentId(newAccount.id);
    setActiveRole('student');
    setCurrentView('operations');
    addToast('success', 'Profile Activated', `Welcome to the Student Portal, ${newAccount.fullName}!`);
  };

  const handleLoginSuccess = (account: StudentAccount) => {
    setCurrentStudentId(account.id);
    setActiveRole('student');
    setCurrentView('operations');
    addToast('success', 'Welcome Back', `Authenticated as ${account.fullName} (${account.studentIdNumber}).`);
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
            onOpenStudentAuth={handleOpenStudentAuth}
            announcements={announcements}
            onUpdateAnnouncements={setAnnouncements}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            {/* Highly Prominent Back to Main Website Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#14161f] border border-[#262b3a] shadow-md">
              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold transition-all shadow-md shadow-amber-950/30 cursor-pointer group"
                id="btn-global-back-to-main-website"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>← Back to Main Website</span>
              </button>

              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>Active Portal:</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#0c0d12] border border-[#2b3040] text-amber-300 font-bold uppercase text-[11px]">
                  {activeRole === 'student' ? 'High School Student Portal' : activeRole === 'teacher' ? 'Faculty Advisor Portal' : 'Student Life Director'}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentView('landing')}
                  className="hidden sm:inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-[#c5832b]" />
                  <span>Return to Public Showcase</span>
                </button>
              </div>
            </div>

            {activeRole === 'student' && (
              <StudentPortal
                student={users.student}
                clubs={clubs}
                registrations={registrations}
                onRegisterClick={(club) => setSelectedClubForRegistration(club)}
                onSelectClub={(club) => setSelectedClubForDetail(club)}
                onOpenCharterModal={() => setIsNewCharterModalOpen(true)}
                onDropClub={handleDropClub}
                onOpenIdCard={() => setIsStudentIDCardModalOpen(true)}
                onSwitchAccount={() => handleOpenStudentAuth('register')}
                onAddToast={addToast}
                onBackToLanding={() => setCurrentView('landing')}
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
                onBackToLanding={() => setCurrentView('landing')}
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
                onBackToLanding={() => setCurrentView('landing')}
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
                className="hover:text-zinc-300 transition-colors text-[11px] underline underline-offset-4 cursor-pointer"
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

      {/* Student Registration & Sign-In Modal */}
      <StudentAuthModal
        isOpen={isStudentAuthModalOpen}
        onClose={() => setIsStudentAuthModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onLoginSuccess={handleLoginSuccess}
        registeredAccounts={studentAccounts}
        onAddToast={addToast}
        initialMode={studentAuthInitialMode}
      />

      {/* Student ID Card Modal */}
      <StudentIDCardModal
        isOpen={isStudentIDCardModalOpen}
        onClose={() => setIsStudentIDCardModalOpen(false)}
        student={users.student}
        onAddToast={addToast}
      />

      {/* Toast Alerts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
