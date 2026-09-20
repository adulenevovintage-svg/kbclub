import { Club, Registration, ClubCharterProposal, Announcement, SystemSettings, UserProfile, MeetingAttendanceSession, WebsiteContent, StudentAccount } from '../types';
import { generateAmharicAvatarDataUrl } from '../utils/amharicAvatars';

export const INITIAL_STUDENT_ACCOUNTS: StudentAccount[] = [
  {
    id: 'KB-2026-11B-10492',
    studentIdNumber: 'KB-2026-11B-10492',
    firstName: 'Dawit',
    fatherName: 'Yohannes',
    fullName: 'Dawit Yohannes',
    grade: 11,
    section: 'B',
    password: 'password123',
    email: 'dawit.yohannes@kbacademy.edu',
    registeredAt: '2026-09-01T08:00:00.000Z',
    avatarUrl: generateAmharicAvatarDataUrl('ደ', 'gold'),
    status: 'active'
  },
  {
    id: 'KB-2026-10A-39182',
    studentIdNumber: 'KB-2026-10A-39182',
    firstName: 'Sara',
    fatherName: 'Kebede',
    fullName: 'Sara Kebede',
    grade: 10,
    section: 'A',
    password: 'password123',
    email: 'sara.kebede@kbacademy.edu',
    registeredAt: '2026-09-02T09:30:00.000Z',
    avatarUrl: generateAmharicAvatarDataUrl('ሰ', 'emerald'),
    status: 'active'
  }
];

export const INITIAL_USERS: Record<string, UserProfile> = {
  student: {
    id: 'KB-2026-11B-10492',
    name: 'Dawit Yohannes',
    fatherName: 'Yohannes',
    section: 'B',
    studentIdNumber: 'KB-2026-11B-10492',
    role: 'student',
    grade: 11,
    email: 'dawit.yohannes@kbacademy.edu',
    title: 'Junior Scholar (Grade 11-B)',
    avatarUrl: generateAmharicAvatarDataUrl('ደ', 'gold'),
  },
  teacher: {
    id: 'tea-201',
    name: 'Mr. Fasil',
    role: 'teacher',
    email: 'fasil@kbacademy.edu',
    title: 'Faculty Advisor & Head of STEM Advisory',
    department: 'STEM & Co-Curricular Division',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  director: {
    id: 'dir-301',
    name: 'Mr. Wondwossen Erqiyhun',
    role: 'director',
    email: 'w.erqiyhun@kbacademy.edu',
    title: 'Highschool Director',
    department: 'Executive Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
};

export const INITIAL_CLUBS: Club[] = [
  {
    id: 'club-robotics',
    name: 'Robotics & Autonomous Systems Syndicate',
    code: 'KB-ROB-01',
    category: 'STEM & Technology',
    tagline: 'Designing, prototyping, and competing with autonomous VEX and FIRST robots.',
    description: 'The premier engineering and applied robotics syndicate at KB Academy. Members engage in mechanical CAD design, embedded firmware programming (C++/ROS), computer vision, and competitive engineering design notebooks. Ranked 1st in State Regional Finals.',
    advisorName: 'Mr. Fasil',
    advisorEmail: 'fasil@kbacademy.edu',
    advisorTitle: 'Faculty Advisor',
    studentPresident: 'Dawit Yohannes (Gr. 12)',
    meetingDay: 'Tuesday',
    meetingTime: '3:45 PM – 5:30 PM',
    timeSlotKey: 'Tuesday-1545',
    room: 'Lab 204 (Advanced Robotics Wing)',
    building: 'Von Neumann Science Center',
    capacity: 24,
    enrolledCount: 21,
    gradesEligible: [9, 10, 11, 12],
    duesPerSemester: 45,
    prerequisites: 'Foundational algebra; prior coding experience encouraged but not mandatory for CAD team.',
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    tags: ['Robotics', 'CAD', 'Python', 'Competition', 'Hardware'],
    status: 'Active',
    charterYear: 2018,
    allocatedBudget: 6800,
    syllabus: [
      { week: 1, topic: 'Subsystem Architecture & Chassis Kinematics', objective: 'Analyze gear ratios and drivetrain stability for high-torque navigation.' },
      { week: 2, topic: 'Pneumatics & Actuator Mechanical Integration', objective: 'Integrate solenoid valves and pressure regulators for pneumatic arms.' },
      { week: 3, topic: 'Autonomous Path-Planning with Odometry', objective: 'Write PID controllers using optical shaft encoders in C++.' },
      { week: 4, topic: 'Competitive Scrimmage & Driver Teleop Drills', objective: 'Stress test driver assist algorithms and field strategy.' }
    ],
    officers: [
      { role: 'Captain', name: 'Dawit Yohannes', grade: 12 },
      { role: 'Firmware Lead', name: 'Brook Tesfaye', grade: 11 },
      { role: 'Mechanical Lead', name: 'Yared Bekele', grade: 11 }
    ],
    upcomingMeetings: [
      { id: 'm-101', title: 'Chassis Stress Test & Autonomous Testing', date: 'Next Tuesday, 3:45 PM', time: '3:45 PM - 5:30 PM', room: 'Lab 204', agenda: 'Complete intake arm assembly and calibrate optical sensors.' },
      { id: 'm-102', title: 'Scrimmage Simulation with Regional Rules', date: 'Oct 06, 3:45 PM', time: '3:45 PM - 5:30 PM', room: 'Arena Hall', agenda: 'Practice match rotations under tournament timing.' }
    ]
  },
  {
    id: 'club-debate',
    name: 'Lincoln-Douglas & Parliamentary Debate Society',
    code: 'KB-DEB-02',
    category: 'Debate & Leadership',
    tagline: 'Cultivating rhetorical mastery, ethical philosophy, and national circuit forensics.',
    description: 'An elite forensic forum dedicated to policy debate, philosophical scrutiny, and persuasive advocacy. The Society represents KB Academy at national circuit tournaments and develops confident public orators equipped for law, governance, and academic discourse.',
    advisorName: 'Ato Berhanu Haile',
    advisorEmail: 'b.haile@kbacademy.edu',
    advisorTitle: 'Director of Humanities & Rhetoric',
    studentPresident: 'Selamawit Desta (Gr. 12)',
    meetingDay: 'Thursday',
    meetingTime: '4:00 PM – 5:30 PM',
    timeSlotKey: 'Thursday-1600',
    room: 'Debate Chamber 110',
    building: 'Franklin Humanities Hall',
    capacity: 28,
    enrolledCount: 26,
    gradesEligible: [9, 10, 11, 12],
    duesPerSemester: 30,
    prerequisites: 'Open to all grades. Strong commitment to weekly research and cross-examination practice.',
    coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    tags: ['Forensics', 'Philosophy', 'Public Speaking', 'Ethics', 'Tournaments'],
    status: 'Active',
    charterYear: 2015,
    allocatedBudget: 4200,
    syllabus: [
      { week: 1, topic: 'Epistemic Frameworks & Value-Criterion Pairs', objective: 'Deconstruct deontology versus utilitarian frameworks in debate resolutions.' },
      { week: 2, topic: 'Cross-Examination Tactics & Argument Flowing', objective: 'Master rapid dual-column flowing and pointed interrogation techniques.' },
      { week: 3, topic: 'Kritik & Topicality Filings', objective: 'Formulate philosophical objections and topicality procedural challenges.' },
      { week: 4, topic: 'Mock Parliamentary Round & Judge Feedback', objective: 'Live debate with timed speeches and peer-led constructive reviews.' }
    ],
    officers: [
      { role: 'President', name: 'Selamawit Desta', grade: 12 },
      { role: 'VP of Research', name: 'Henok Girma', grade: 11 },
      { role: 'Novice Mentor', name: 'Tigist Assefa', grade: 10 }
    ],
    upcomingMeetings: [
      { id: 'm-201', title: 'Resolution Briefing: AI Governance in Public Infrastructure', date: 'Next Thursday, 4:00 PM', time: '4:00 PM - 5:30 PM', room: 'Chamber 110', agenda: 'Case constructive reviews and aff/neg evidentiary packets distribution.' }
    ]
  },
  {
    id: 'club-biomed',
    name: 'BioMedical Innovations & Molecular Genetics Lab',
    code: 'KB-BIO-03',
    category: 'STEM & Technology',
    tagline: 'Investigating CRISPR protocols, gel electrophoresis, and epidemiology.',
    description: 'Hands-on wet-lab biotechnology research. Students conduct PCR DNA amplification, bacterial transformation using pGLO, bioinformatics analysis of rare genetic mutations, and participate in the Regeneron Science Talent Search.',
    advisorName: 'Dr. Almaz Worku',
    advisorEmail: 'a.worku@kbacademy.edu',
    advisorTitle: 'Senior Biology Specialist',
    studentPresident: 'Biruk Tefera (Gr. 12)',
    meetingDay: 'Wednesday',
    meetingTime: '3:45 PM – 5:15 PM',
    timeSlotKey: 'Wednesday-1545',
    room: 'Biosciences Lab 308',
    building: 'Von Neumann Science Center',
    capacity: 18,
    enrolledCount: 17,
    gradesEligible: [10, 11, 12],
    duesPerSemester: 50,
    prerequisites: 'Successful completion of Honors Biology or instructor recommendation.',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    tags: ['Genetics', 'CRISPR', 'Biotech', 'Laboratory', 'Bioinformatics'],
    status: 'Active',
    charterYear: 2020,
    allocatedBudget: 5400,
    syllabus: [
      { week: 1, topic: 'Sterile Micropipetting & Agar Plate Preparation', objective: 'Precision aseptic techniques and reagent preparation.' },
      { week: 2, topic: 'Plasmid DNA Extraction and Restriction Digestion', objective: 'Incubate enzymes and perform agarose gel electrophoresis.' },
      { week: 3, topic: 'NCBI BLAST Bioinformatics Analysis', objective: 'Sequence alignment to pinpoint oncogenic variant mutations.' }
    ],
    officers: [
      { role: 'Lab Director', name: 'Biruk Tefera', grade: 12 },
      { role: 'Protocol Officer', name: 'Bethel Mengistu', grade: 11 }
    ],
    upcomingMeetings: [
      { id: 'm-301', title: 'Gel Electrophoresis Imaging & Band Sizing', date: 'Next Wednesday, 3:45 PM', time: '3:45 PM - 5:15 PM', room: 'Bio Lab 308', agenda: 'Inspect UV illumination boxes and calculate base pair distances.' }
    ]
  },
  {
    id: 'club-mun',
    name: 'Model United Nations & Diplomatic Corps',
    code: 'KB-MUN-04',
    category: 'Civics & Culture',
    tagline: 'Simulating multilateral diplomacy, international crises, and treaty negotiations.',
    description: 'KB Academy MUN delegates engage in intense simulations of the UN Security Council, WHO, and historical crisis committees. Delegates prepare policy working papers, forge voting coalitions, and compete in major Ivy League conferences.',
    advisorName: 'Ato Solomon Kassa',
    advisorEmail: 's.kassa@kbacademy.edu',
    advisorTitle: 'Dean of Global Studies',
    studentPresident: 'Aster Mulatu (Gr. 12)',
    meetingDay: 'Monday',
    meetingTime: '4:00 PM – 5:30 PM',
    timeSlotKey: 'Monday-1600',
    room: 'Global Conference Suite 401',
    building: 'Adelphi International Pavilion',
    capacity: 35,
    enrolledCount: 30,
    gradesEligible: [9, 10, 11, 12],
    duesPerSemester: 35,
    prerequisites: 'Interest in international relations, geopolitics, and collaborative negotiation.',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80',
    tags: ['Diplomacy', 'Global Affairs', 'Public Speaking', 'Crisis Simulation', 'Conferences'],
    status: 'Active',
    charterYear: 2016,
    allocatedBudget: 5100,
    syllabus: [
      { week: 1, topic: 'Rules of Procedure & Speaker’s List Protocol', objective: 'Master unmoderated caucuses, points of order, and procedural motions.' },
      { week: 2, topic: 'Position Paper Formulation & UN Declarations', objective: 'Draft operative and preambulatory clauses for draft resolutions.' },
      { week: 3, topic: 'Midnight Crisis Simulation: Maritime Transit Accords', objective: 'Respond to breaking simulated intelligence cables and forge multilateral accords.' }
    ],
    officers: [
      { role: 'Secretary General', name: 'Aster Mulatu', grade: 12 },
      { role: 'Under-Secretary of Training', name: 'Natnael Tadesse', grade: 11 }
    ],
    upcomingMeetings: [
      { id: 'm-401', title: 'Crisis Bloc Negotiations: Arctic Sea Route Treaties', date: 'Next Monday, 4:00 PM', time: '4:00 PM - 5:30 PM', room: 'Suite 401', agenda: 'Draft joint resolution sponsor list and prepare amendments.' }
    ]
  },
  {
    id: 'club-orchestra',
    name: 'Chamber Strings & Contemporary Guild',
    code: 'KB-MUS-05',
    category: 'Arts & Performance',
    tagline: 'High-level chamber music ensemble spanning classical sonatas to neo-classical scoring.',
    description: 'An auditioned ensemble of string, woodwind, and piano musicians performing repertoire from classical traditions to modern cinematic scoring. Holds semester showcases in the Grand Atrium and participates in regional conservatory adjudications.',
    advisorName: 'W/ro Genet Wolde',
    advisorEmail: 'g.wolde@kbacademy.edu',
    advisorTitle: 'Director of Instrumental Arts',
    studentPresident: 'Hiwot Alemu (Gr. 11)',
    meetingDay: 'Friday',
    meetingTime: '3:30 PM – 5:00 PM',
    timeSlotKey: 'Friday-1530',
    room: 'Symphony Hall 102',
    building: 'Performing Arts Conservatory',
    capacity: 22,
    enrolledCount: 19,
    gradesEligible: [9, 10, 11, 12],
    duesPerSemester: 25,
    prerequisites: 'Minimum 2 years instrument experience or audition submission.',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    tags: ['Music', 'Chamber Strings', 'Ensemble', 'Performance', 'Orchestra'],
    status: 'Active',
    charterYear: 2017,
    allocatedBudget: 3900,
    syllabus: [
      { week: 1, topic: 'Ensemble Intonation & Dynamic Phrasing', objective: 'Sectional balancing and bow articulation consistency across movements.' },
      { week: 2, topic: 'Complex Polyphonic Counterpoint', objective: 'Rehearse fugal entries and tempo rubato transitions.' },
      { week: 3, topic: 'Full Dress Rehearsal & Stage Presence', objective: 'Run through fall overture program without pauses.' }
    ],
    officers: [
      { role: 'Concertmaster', name: 'Hiwot Alemu', grade: 11 },
      { role: 'Principal Cellist', name: 'Ermias Fikru', grade: 12 }
    ],
    upcomingMeetings: [
      { id: 'm-501', title: 'Winter Gala Repertoire Run-Through', date: 'Next Friday, 3:30 PM', time: '3:30 PM - 5:00 PM', room: 'Symphony Hall 102', agenda: 'Tuning sectionals followed by full ensemble tempo run.' }
    ]
  },
  {
    id: 'club-aerospace',
    name: 'Aerospace Engineering & High-Altitude Rocketry',
    code: 'KB-AERO-06',
    category: 'STEM & Technology',
    tagline: 'Designing dual-deployment solid motor rockets and weather balloon telemetry.',
    description: 'Students build NAR-certified competition rockets with telemetry flight computers, dual-stage ejection systems, and composite carbon fiber airframes. Also deploys high-altitude stratospheric research payloads with real-time GPS radio tracking.',
    advisorName: 'Mr. Fasil',
    advisorEmail: 'fasil@kbacademy.edu',
    advisorTitle: 'Faculty Advisor',
    studentPresident: 'Nahom Daniel (Gr. 12)',
    meetingDay: 'Thursday',
    meetingTime: '3:45 PM – 5:15 PM',
    timeSlotKey: 'Thursday-1545',
    room: 'Makerspace Aerospace Bay',
    building: 'Von Neumann Science Center',
    capacity: 20,
    enrolledCount: 16,
    gradesEligible: [10, 11, 12],
    duesPerSemester: 55,
    prerequisites: 'Safety certification workshop during Week 1 required for launchpad access.',
    coverImage: 'https://images.unsplash.com/photo-1517976487502-53b92dc1791a?w=800&auto=format&fit=crop&q=80',
    tags: ['Aerospace', 'Rocketry', 'Telemetry', 'Avionics', 'NAR Certified'],
    status: 'Active',
    charterYear: 2021,
    allocatedBudget: 7200,
    syllabus: [
      { week: 1, topic: 'OpenRocket Trajectory Simulation & Apogee Optimization', objective: 'Model motor thrust curves and calculate center of pressure vs center of gravity.' },
      { week: 2, topic: 'Avionics Wiring & Dual-Deploy Altimeters', objective: 'Wire electronic barometric altimeters and solder black-powder ejection charges.' },
      { week: 3, topic: 'Airframe Layup & Parachute Packing', objective: 'Roll fiberglass reinforcement sleeves and verify deployment drag coefficients.' }
    ],
    officers: [
      { role: 'Flight Commander', name: 'Nahom Daniel', grade: 12 },
      { role: 'Avionics Specialist', name: 'Lydia Kassahun', grade: 11 }
    ],
    upcomingMeetings: [
      { id: 'm-601', title: 'Avionics Bay Soldering & Static Ejection Test', date: 'Next Thursday, 3:45 PM', time: '3:45 PM - 5:15 PM', room: 'Bay 104', agenda: 'Pressure chamber verification of ejection charge triggers.' }
    ]
  },
  {
    id: 'club-chess',
    name: 'Varsity Chess & Strategic Game Theory Guild',
    code: 'KB-CHS-07',
    category: 'Academic Olympiad',
    tagline: 'Grandmaster opening analysis, blitz tactics, and algorithmic endgame theory.',
    description: 'Affiliated with the Ethiopian Chess Federation and FIDE standards. Members analyze historical master games, drill tactical puzzles under blitz and rapid clocks, participate in inter-school tournaments, and host campus championships.',
    advisorName: 'Ato Mulugeta Tesfaye',
    advisorEmail: 'm.tesfaye@kbacademy.edu',
    advisorTitle: 'Department of Mathematics',
    studentPresident: 'Kaleb Getachew (Gr. 11)',
    meetingDay: 'Wednesday',
    meetingTime: '4:00 PM – 5:30 PM',
    timeSlotKey: 'Wednesday-1600',
    room: 'Seminar Room 215',
    building: 'Franklin Humanities Hall',
    capacity: 26,
    enrolledCount: 22,
    gradesEligible: [9, 10, 11, 12],
    duesPerSemester: 15,
    prerequisites: 'Basic knowledge of chess rules; open to novice through rated players.',
    coverImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80',
    tags: ['Chess', 'Tactics', 'Game Theory', 'FIDE', 'Competition'],
    status: 'Active',
    charterYear: 2014,
    allocatedBudget: 2100,
    syllabus: [
      { week: 1, topic: 'Hypermodern Pawn Structures & Sicilian Najdorf Theory', objective: 'Analyze dynamic positional pawn sacrifices and space imbalances.' },
      { week: 2, topic: 'Rook & Pawn Endgames: Philidor vs Lucena Positions', objective: 'Memorize bridge-building and passive drawing techniques.' },
      { week: 3, topic: 'Simultaneous Exhibition & Clock Matches', objective: 'Timed 5+3 blitz sparring with instant post-game engine evaluation.' }
    ],
    officers: [
      { role: 'Grandmaster Captain', name: 'Kaleb Getachew', grade: 11 },
      { role: 'Tournament Director', name: 'Binyam Lemma', grade: 10 }
    ],
    upcomingMeetings: [
      { id: 'm-701', title: 'Tactical Puzzle Blitz & Rated Ladder Round 3', date: 'Next Wednesday, 4:00 PM', time: '4:00 PM - 5:30 PM', room: 'Room 215', agenda: 'Record ladder moves for club Elo updates.' }
    ]
  },
  {
    id: 'club-journalism',
    name: 'The KB Chronicle & Investigative Media Lab',
    code: 'KB-JRN-08',
    category: 'Arts & Performance',
    tagline: 'Student-led investigative journalism, documentary photography, and quarterly print editions.',
    description: 'The official journalistic voice of KB Academy. Staff writers, photojournalists, and podcast producers investigate campus policies, spotlight student accomplishments, and publish an award-winning print journal and digital newsletter.',
    advisorName: 'W/ro Rahel Mekonnen',
    advisorEmail: 'r.mekonnen@kbacademy.edu',
    advisorTitle: 'Journalism & Publications Advisor',
    studentPresident: 'Marta Hailu (Gr. 12)',
    meetingDay: 'Monday',
    meetingTime: '3:45 PM – 5:00 PM',
    timeSlotKey: 'Monday-1545',
    room: 'Digital Media Studio 202',
    building: 'Franklin Humanities Hall',
    capacity: 25,
    enrolledCount: 20,
    gradesEligible: [9, 10, 11, 12],
    duesPerSemester: 20,
    prerequisites: 'Passion for reporting, creative nonfiction, photography, or audio editing.',
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80',
    tags: ['Journalism', 'Publishing', 'Photography', 'Podcasting', 'Editorial'],
    status: 'Active',
    charterYear: 2012,
    allocatedBudget: 3400,
    syllabus: [
      { week: 1, topic: 'Investigative Source Vetting & Ethics in Media', objective: 'Apply ethical codes to campus interviews and on-the-record statements.' },
      { week: 2, topic: 'InDesign Layout Design & Typographic Grid Systems', objective: 'Master editorial column spreads and photo caption hierarchy.' },
      { week: 3, topic: 'Audio Production for The KB Academy Podcast', objective: 'Record voice tracks with condenser mics and edit sound beds in Audition.' }
    ],
    officers: [
      { role: 'Editor-in-Chief', name: 'Marta Hailu', grade: 12 },
      { role: 'Managing Editor', name: 'Robel Negash', grade: 11 }
    ],
    upcomingMeetings: [
      { id: 'm-801', title: 'Fall Print Issue Layout Deadline Review', date: 'Next Monday, 3:45 PM', time: '3:45 PM - 5:00 PM', room: 'Studio 202', agenda: 'Final page proof signoffs before sending to press.' }
    ]
  }
];

export const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-001',
    studentId: 'stu-101',
    studentName: 'Student Member',
    studentGrade: 11,
    studentEmail: 'student@kbacademy.edu',
    clubId: 'club-robotics',
    clubName: 'Robotics & Autonomous Systems Syndicate',
    clubCategory: 'STEM & Technology',
    meetingDay: 'Tuesday',
    meetingTime: '3:45 PM – 5:30 PM',
    registrationDate: '2026-09-02',
    status: 'enrolled',
    statementOfInterest: 'I have served on the firmware programming team for 2 years and am eager to lead computer vision sensor calibration for the 2026-2027 regional challenge.',
    advisorNotes: 'Approved as Firmware Lead. Excellent prior commitment and technical aptitude.',
    attendedSessions: 4,
    totalSessions: 4
  },
  {
    id: 'reg-002',
    studentId: 'stu-101',
    studentName: 'Student Member',
    studentGrade: 11,
    studentEmail: 'student@kbacademy.edu',
    clubId: 'club-debate',
    clubName: 'Lincoln-Douglas & Parliamentary Debate Society',
    clubCategory: 'Debate & Leadership',
    meetingDay: 'Thursday',
    meetingTime: '4:00 PM – 5:30 PM',
    registrationDate: '2026-09-04',
    status: 'enrolled',
    statementOfInterest: 'Excited to refine my philosophical framework arguments and participate in the inter-school tournament.',
    advisorNotes: 'Enrolled in Varsity Novice mentor track.',
    attendedSessions: 3,
    totalSessions: 4
  },
  {
    id: 'reg-003',
    studentId: 'stu-102',
    studentName: 'Kassahun Belay',
    studentGrade: 10,
    studentEmail: 'k.belay@kbacademy.edu',
    clubId: 'club-robotics',
    clubName: 'Robotics & Autonomous Systems Syndicate',
    clubCategory: 'STEM & Technology',
    meetingDay: 'Tuesday',
    meetingTime: '3:45 PM – 5:30 PM',
    registrationDate: '2026-09-11',
    status: 'pending',
    statementOfInterest: 'Completed CAD Foundations in Grade 9 and want to join the pneumatic actuator build sub-team.',
    attendedSessions: 0,
    totalSessions: 0
  },
  {
    id: 'reg-004',
    studentId: 'stu-103',
    studentName: 'Senait Girmay',
    studentGrade: 10,
    studentEmail: 's.girmay@kbacademy.edu',
    clubId: 'club-robotics',
    clubName: 'Robotics & Autonomous Systems Syndicate',
    clubCategory: 'STEM & Technology',
    meetingDay: 'Tuesday',
    meetingTime: '3:45 PM – 5:30 PM',
    registrationDate: '2026-09-12',
    status: 'pending',
    statementOfInterest: 'Self-taught Python programmer wanting to contribute to drive-train automation and odometry testing.',
    attendedSessions: 0,
    totalSessions: 0
  },
  {
    id: 'reg-005',
    studentId: 'stu-104',
    studentName: 'Ephrem Asfaw',
    studentGrade: 9,
    studentEmail: 'e.asfaw@kbacademy.edu',
    clubId: 'club-debate',
    clubName: 'Lincoln-Douglas & Parliamentary Debate Society',
    clubCategory: 'Debate & Leadership',
    meetingDay: 'Thursday',
    meetingTime: '4:00 PM – 5:30 PM',
    registrationDate: '2026-09-10',
    status: 'pending',
    statementOfInterest: 'Passionate about public speaking and constitutional law. Participated in middle school forensics.',
    attendedSessions: 0,
    totalSessions: 0
  }
];

export const INITIAL_CHARTER_PROPOSALS: ClubCharterProposal[] = [
  {
    id: 'prop-001',
    clubName: 'Cybernetics & Ethical Hacking Guild',
    category: 'STEM & Technology',
    proposedByStudent: 'Elias Habte',
    studentGrade: 11,
    studentEmail: 'e.habte@kbacademy.edu',
    facultyAdvisor: 'Mr. Fasil',
    facultyEmail: 'fasil@kbacademy.edu',
    missionStatement: 'To educate KB Academy students on defensive cybersecurity, penetration testing in isolated sandbox networks, cryptography, and competing in collegiate-level challenges.',
    proposedMeetingDay: 'Friday',
    proposedTimeSlot: '3:45 PM – 5:00 PM',
    requestedRoomType: 'Computer Science Lab with Air-Gapped Network Terminals',
    estimatedMembers: 16,
    requestedBudget: 1500,
    safetyPlan: 'All lab activities will be conducted on dedicated offline virtual machines or authorized sandboxed images under faculty supervision.',
    submissionDate: '2026-09-14',
    directorStatus: 'pending'
  },
  {
    id: 'prop-002',
    clubName: 'Urban Environmental Agriculture & Hydroponics',
    category: 'Civics & Culture',
    proposedByStudent: 'Bethlehem Tsegaye',
    studentGrade: 10,
    studentEmail: 'b.tsegaye@kbacademy.edu',
    facultyAdvisor: 'Dr. Almaz Worku',
    facultyEmail: 'a.worku@kbacademy.edu',
    missionStatement: 'Designing vertical nutrient-film hydroponic towers in the greenhouse to grow fresh herbs and greens for the academy dining hall while testing nutrient pH automation.',
    proposedMeetingDay: 'Monday',
    proposedTimeSlot: '3:30 PM – 4:45 PM',
    requestedRoomType: 'Rooftop Botanical Conservatory & Greenhouses',
    estimatedMembers: 14,
    requestedBudget: 1800,
    safetyPlan: 'Nutrient solutions will be pre-mixed under biology faculty oversight; water circulation pumps are GFCI ground-fault protected.',
    submissionDate: '2026-09-08',
    directorStatus: 'approved',
    directorFeedback: 'Outstanding interdisciplinary proposal. Granted seed budget and Greenhouse Bay 3 access by Highschool Director Mr. Wondwossen Erqiyhun.',
    assignedRoom: 'Rooftop Conservatory Bay 3',
    approvedBudget: 1800
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-2',
    clubId: 'club-robotics',
    clubName: 'Robotics & Autonomous Systems Syndicate',
    authorName: 'Mr. Fasil',
    authorRole: 'Faculty Advisor',
    title: 'Regional Question and Answer Champions',
    summary: 'Our proud and outstanding students remarkable achievements , We are proud of you',
    content: 'Our proud and outstanding students remarkable achievements , We are proud of you. Congratulations to all participating scholars and faculty mentors on bringing home the championship title.',
    date: 'Yesterday at 4:15 PM',
    priority: 'high',
    category: 'Championship',
    badgeText: '🏆 REGIONAL CHAMPIONS',
    coverImage: 'https://cdn.phototourl.com/free/2026-09-20-27a9f26b-61b4-4adf-8ed5-16e5600b89d1.jpg',
    actionText: 'View Robotics Syndicate',
    actionType: 'catalog',
    isPinned: true,
    isPublished: true,
    readTime: '2 min read'
  },
  {
    id: 'ann-1',
    clubId: 'system-wide',
    clubName: 'Office of the Highschool Director',
    authorName: 'Mr. Wondwossen Erqiyhun',
    authorRole: 'Highschool Director',
    title: 'Fall 2026 Co-Curricular Enrollment Window Officially Open',
    summary: 'High School scholars (Grades 9–12) must finalize syndicate enrollments before Friday 5:00 PM. Maximum 3 clubs per scholar with real-time schedule conflict prevention.',
    content: 'Welcome to the Fall 2026 co-curricular season at KB Academy! All students are required to review available syndicates and submit registrations. Digital ID card generation and attendance verification are fully active.',
    date: 'Today &bull; 08:30 AM',
    priority: 'breaking',
    category: 'Breaking News',
    badgeText: '🔥 ACTIVE ENROLLMENT',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    actionText: 'Register for Clubs Now',
    actionType: 'register',
    isPinned: false,
    isPublished: true,
    readTime: '2 min read'
  },
  {
    id: 'ann-3',
    clubId: 'system-wide',
    clubName: 'Campus Facilities Administration',
    authorName: 'Office of Operations',
    authorRole: 'Campus Administration',
    title: 'New Quantum Computing & VR Innovation Wing Commissioned in Building B',
    summary: 'Rooms 304 and 306 are now outfitted with high-performance neural workstations and optics benches, allocated for AI Syndicate & Web3 Guild weekly sessions.',
    content: 'We are pleased to announce the commissioning of the new West Wing Innovation Labs. Equipped with dedicated gigabit optical uplinks and multi-GPU nodes, these spaces will support advanced project charters throughout the academic year.',
    date: 'Sep 18, 2026',
    priority: 'normal',
    category: 'Facility',
    badgeText: '🏛️ CAMPUS EXPANSION',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    actionText: 'Explore Facilities Schedule',
    actionType: 'catalog',
    isPinned: false,
    isPublished: true,
    readTime: '2 min read'
  },
  {
    id: 'ann-4',
    clubId: 'club-debate',
    clubName: 'Lincoln-Douglas & Parliamentary Debate Society',
    authorName: 'Ato Berhanu Haile',
    authorRole: 'Societal Moderator',
    title: 'Parliamentary Debate Society Hosts Annual Fall Interscholastic Symposium',
    summary: 'Delegates from 14 regional academies will debate resolution economics and bio-ethics in the Franklin Humanities Chamber this Saturday.',
    content: 'The annual KB Academy Parliamentary Debate Symposium will convene this Saturday. Spectator seating is open to all registered academy students. High School student adjudicators have been certified.',
    date: 'Sep 16, 2026',
    priority: 'normal',
    category: 'Event',
    badgeText: '🎙️ INVITATIONAL',
    coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    actionText: 'View Society Agenda',
    actionType: 'catalog',
    isPinned: false,
    isPublished: true,
    readTime: '3 min read'
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: MeetingAttendanceSession[] = [
  {
    id: 'att-session-1',
    clubId: 'club-robotics',
    date: '2026-09-15',
    meetingTitle: 'Session 4: Drivetrain Firmware Integration',
    topicCovered: 'Tested PID motor encoders and optical sensors on practice perimeter.',
    completed: true,
    submittedBy: 'Mr. Fasil (Faculty Advisor)',
    entries: [
      { studentId: 'stu-101', studentName: 'Student Member', studentGrade: 11, status: 'present', note: 'Calibrated left wheel optical encoders' },
      { studentId: 'stu-dawit', studentName: 'Dawit Yohannes', studentGrade: 12, status: 'present' },
      { studentId: 'stu-yared', studentName: 'Yared Bekele', studentGrade: 11, status: 'present' },
      { studentId: 'stu-bethel', studentName: 'Bethel Mengistu', studentGrade: 11, status: 'excused', note: 'Academic Olympiad conflict' }
    ]
  }
];

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  semesterName: 'Fall Semester 2026-2027',
  registrationOpen: true,
  registrationDeadline: 'September 30, 2026',
  maxClubsPerStudent: 3,
  requireAdvisorApproval: true,
  allowWaitlists: true,
};

export const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  kbLogoUrl: 'https://cdn.phototourl.com/free/2026-09-19-d8f0f13c-5886-4de1-b7ba-8996d63ce1a3.jpg',
  realSchoolOps: {
    badge: 'Real School Operations',
    heading: 'Designed for real school logistics, not generic brochureware.',
    description: 'Every feature replaces manual spreadsheets, frantic email threads, and scheduling friction with instant digital workflows.',
    pillars: [
      {
        id: 'p-1',
        title: 'Zero-Conflict Registration',
        description: 'Real-time slot matching alerts students before they accidentally enroll in concurrent clubs, protecting both academic rigor and participation.'
      },
      {
        id: 'p-2',
        title: 'Faculty Workload Relief',
        description: 'Advisors review student statements in a unified queue, batch-record attendance in under 10 seconds, and post instant group notices.'
      },
      {
        id: 'p-3',
        title: 'Facilities & Room Governance',
        description: 'Visual room utilization heatmaps for science labs, amphitheaters, and studios prevent double bookings and optimize school facilities.'
      },
      {
        id: 'p-4',
        title: 'Democratic Charter Launchpad',
        description: 'Students formally propose new clubs with faculty sponsors and safety plans; directors review, allocate budgets, and assign rooms.'
      }
    ]
  },
  leadershipQuote: {
    badge: 'Operational Standard',
    quote: '“Co-curricular activities are not secondary to the KB Academy curriculum — they are where our students test leadership, technical rigor, and civil discourse. This platform replaces paperwork with operational precision.”',
    directorName: 'Mr. Wondwossen Erqiyhun',
    directorTitle: 'Highschool Director',
    initials: 'WE'
  },
  mediaPhotos: [
    {
      id: 'photo-1',
      title: 'Von Neumann Science Center Robotics Lab',
      url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      caption: 'Main robotics engineering wing with CAD terminals and practice perimeter.'
    },
    {
      id: 'photo-2',
      title: 'Franklin Humanities Debate Chamber',
      url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
      caption: 'Tiered parliamentary debate chamber with electronic clock and audio capture.'
    },
    {
      id: 'photo-3',
      title: 'East Wing Fine Arts Studio',
      url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop&q=80',
      caption: 'Ceramics wheels, oil painting easels, and student exhibition gallery.'
    }
  ]
};

