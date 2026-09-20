export type UserRole = 'student' | 'teacher' | 'director';

export type ClubCategory =
  | 'STEM & Technology'
  | 'Debate & Leadership'
  | 'Arts & Performance'
  | 'Athletics & Tactics'
  | 'Civics & Culture'
  | 'Academic Olympiad';

export interface ClubOfficer {
  role: string;
  name: string;
  grade: number;
}

export interface SyllabusItem {
  week: number;
  topic: string;
  objective: string;
}

export interface UpcomingMeeting {
  id: string;
  title: string;
  date: string;
  time: string;
  room: string;
  agenda: string;
}

export interface Club {
  id: string;
  name: string;
  code: string;
  category: ClubCategory;
  tagline: string;
  description: string;
  advisorName: string;
  advisorEmail: string;
  advisorTitle: string;
  studentPresident: string;
  meetingDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  meetingTime: string; // e.g. "3:45 PM - 5:15 PM"
  timeSlotKey: string; // e.g. "Tue-1545" for collision detection
  room: string;
  building: string;
  capacity: number;
  enrolledCount: number;
  gradesEligible: number[];
  duesPerSemester: number;
  prerequisites: string;
  coverImage: string;
  tags: string[];
  status: 'Active' | 'Under Review' | 'Registration Closed';
  charterYear: number;
  allocatedBudget: number;
  syllabus: SyllabusItem[];
  officers: ClubOfficer[];
  upcomingMeetings: UpcomingMeeting[];
}

export interface Registration {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: number;
  studentEmail: string;
  clubId: string;
  clubName: string;
  clubCategory: ClubCategory;
  meetingDay: string;
  meetingTime: string;
  registrationDate: string;
  status: 'enrolled' | 'pending' | 'waitlisted' | 'declined';
  statementOfInterest: string;
  advisorNotes?: string;
  attendedSessions: number;
  totalSessions: number;
}

export interface AttendanceEntry {
  studentId: string;
  studentName: string;
  studentGrade: number;
  status: 'present' | 'absent' | 'excused';
  timestamp?: string;
  note?: string;
}

export interface MeetingAttendanceSession {
  id: string;
  clubId: string;
  date: string;
  meetingTitle: string;
  topicCovered: string;
  entries: AttendanceEntry[];
  submittedBy: string;
  completed: boolean;
}

export interface ClubCharterProposal {
  id: string;
  clubName: string;
  category: ClubCategory;
  proposedByStudent: string;
  studentGrade: number;
  studentEmail: string;
  facultyAdvisor: string;
  facultyEmail: string;
  missionStatement: string;
  proposedMeetingDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  proposedTimeSlot: string;
  requestedRoomType: string;
  estimatedMembers: number;
  requestedBudget: number;
  safetyPlan: string;
  submissionDate: string;
  directorStatus: 'pending' | 'approved' | 'revision_requested' | 'rejected';
  directorFeedback?: string;
  assignedRoom?: string;
  approvedBudget?: number;
}

export interface Announcement {
  id: string;
  clubId?: string;
  clubName?: string;
  authorName: string;
  authorRole: string;
  title: string;
  summary?: string;
  content: string;
  date: string;
  priority: 'normal' | 'urgent' | 'breaking' | 'high';
  category?: 'Breaking News' | 'Urgent Notice' | 'Championship' | 'Facility' | 'Event' | 'Charter' | 'Academic';
  coverImage?: string;
  badgeText?: string;
  actionText?: string;
  actionType?: 'register' | 'login' | 'catalog' | 'charter' | 'external';
  isPinned?: boolean;
  isPublished?: boolean;
  readTime?: string;
}

export interface SystemSettings {
  semesterName: string;
  registrationOpen: boolean;
  registrationDeadline: string;
  maxClubsPerStudent: number;
  requireAdvisorApproval: boolean;
  allowWaitlists: boolean;
}

export interface OperationPillar {
  id: string;
  title: string;
  description: string;
}

export interface MediaPhoto {
  id: string;
  title: string;
  url: string;
  caption?: string;
  uploadedAt?: string;
}

export interface WebsiteContent {
  kbLogoUrl: string;
  realSchoolOps: {
    badge: string;
    heading: string;
    description: string;
    pillars: OperationPillar[];
  };
  leadershipQuote: {
    badge: string;
    quote: string;
    directorName: string;
    directorTitle: string;
    initials: string;
  };
  mediaPhotos: MediaPhoto[];
}

export interface StudentAccount {
  id: string; // e.g. "KB-2026-11B-48921"
  studentIdNumber: string; // ID number to copy & sign in
  firstName: string;
  fatherName: string;
  fullName: string; // Full name with father's name e.g. "Abebe Kebede"
  grade: number; // 7, 8, 9, 10, 11, 12
  section: 'A' | 'B' | 'C' | 'D' | 'E';
  password: string;
  email: string;
  registeredAt: string;
  avatarUrl?: string;
  status: 'active' | 'suspended';
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  grade?: number;
  email: string;
  avatarUrl?: string;
  title?: string;
  department?: string;
  fatherName?: string;
  section?: 'A' | 'B' | 'C' | 'D' | 'E';
  studentIdNumber?: string;
  registeredAt?: string;
}
