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
  clubId: string;
  clubName: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  date: string;
  priority: 'normal' | 'urgent';
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

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  grade?: number;
  email: string;
  avatarUrl?: string;
  title?: string;
  department?: string;
}
