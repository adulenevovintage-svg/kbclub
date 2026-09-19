import React from 'react';
import { Club, Registration } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  DollarSign, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

interface ClubDetailModalProps {
  club: Club | null;
  onClose: () => void;
  onRegisterClick: (club: Club) => void;
  isEnrolled: boolean;
  isPending: boolean;
  hasConflict: boolean;
  conflictDetails?: { clubName: string; day: string; time: string };
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  club,
  onClose,
  onRegisterClick,
  isEnrolled,
  isPending,
  hasConflict,
  conflictDetails,
}) => {
  if (!club) return null;

  const seatsLeft = club.capacity - club.enrolledCount;
  const isFull = seatsLeft <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in-50">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#12141a] border border-[#2a2e3a] shadow-2xl text-zinc-200">
        {/* Sticky close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-white backdrop-blur-md transition-colors"
          id="btn-close-club-detail"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover header with realistic school imagery */}
        <div className="relative h-64 sm:h-72 w-full bg-zinc-900 overflow-hidden">
          <img 
            src={club.coverImage} 
            alt={club.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] via-[#12141a]/50 to-transparent"></div>

          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#e5a93c] border border-[#c5832b]/40 font-semibold">
              {club.category}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-zinc-300 font-mono">
              {club.code}
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {club.name}
            </h2>
            <p className="text-sm text-zinc-300 mt-1 max-w-xl font-medium">
              {club.tagline}
            </p>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Schedule & Location banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#0c0d10] border border-[#1f232c]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#181a22] text-[#c5832b]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-zinc-500">Meeting Day & Time</div>
                <div className="text-xs font-bold text-white">{club.meetingDay}</div>
                <div className="text-[11px] text-zinc-400">{club.meetingTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#181a22] text-[#c5832b]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-zinc-500">Facility Assignment</div>
                <div className="text-xs font-bold text-white truncate">{club.room}</div>
                <div className="text-[11px] text-zinc-400">{club.building}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#181a22] text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-zinc-500">Roster Capacity</div>
                <div className="text-xs font-bold text-emerald-400">
                  {club.enrolledCount} / {club.capacity} Enrolled
                </div>
                <div className="text-[11px] text-zinc-400">{seatsLeft} spots open</div>
              </div>
            </div>
          </div>

          {/* Schedule Conflict Notice */}
          {hasConflict && conflictDetails && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Schedule Collision Alert:</span> This club meets concurrently with your enrolled club{' '}
                <strong>{conflictDetails.clubName}</strong> on {conflictDetails.day} ({conflictDetails.time}).
                KB Academy requires non-overlapping commitments.
              </div>
            </div>
          )}

          {/* Syndicate Description */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Syndicate Overview & Charter
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {club.description}
            </p>
          </div>

          {/* Academic Syllabus & Milestones */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#c5832b]" />
              Structured Syllabus & Focus Weeks
            </h3>
            <div className="space-y-2.5">
              {club.syllabus.map(item => (
                <div key={item.week} className="p-3.5 rounded-xl bg-[#0c0d10] border border-[#1f232c] flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#181a22] border border-[#2a2e3a] flex items-center justify-center font-bold text-xs text-[#c5832b] shrink-0">
                    W{item.week}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{item.topic}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{item.objective}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Board & Faculty Advisor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Faculty Leadership</h4>
              <div className="text-sm font-bold text-white">{club.advisorName}</div>
              <div className="text-xs text-zinc-400">{club.advisorTitle}</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-1">{club.advisorEmail}</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0c0d10] border border-[#1f232c]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Student Executive Board</h4>
              <div className="space-y-1 text-xs">
                {club.officers.map(off => (
                  <div key={off.name} className="flex items-center justify-between">
                    <span className="text-zinc-400">{off.role}:</span>
                    <span className="font-semibold text-white">{off.name} (Gr. {off.grade})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prerequisites & Dues */}
          <div className="p-4 rounded-xl bg-[#161821] border border-[#232730] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Prerequisites & Eligibility:</span>
              <span className="font-semibold text-zinc-200">Grades {club.gradesEligible.join(', ')}</span>
            </div>
            <div className="text-zinc-300 pt-1">{club.prerequisites}</div>
            <div className="pt-2 flex items-center justify-between text-zinc-400 border-t border-[#232730] mt-2">
              <span>Semester Dues:</span>
              <span className="font-bold text-white">${club.duesPerSemester} / semester</span>
            </div>
          </div>

          {/* Modal Footer / Registration Action */}
          <div className="pt-4 border-t border-[#232730] flex items-center justify-between">
            <div className="text-xs text-zinc-400">
              KB Academy Co-Curricular Office &bull; Fall 2026
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#181a22] text-xs font-medium text-zinc-300 hover:text-white"
              >
                Close
              </button>

              {isEnrolled ? (
                <div className="px-5 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Enrolled Member
                </div>
              ) : isPending ? (
                <div className="px-5 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Application Pending Review
                </div>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onRegisterClick(club);
                  }}
                  disabled={hasConflict}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    hasConflict
                      ? 'bg-[#1f232c] text-zinc-500 cursor-not-allowed'
                      : isFull
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-[#c5832b] hover:bg-[#a96721] text-white shadow-lg shadow-[#c5832b]/20'
                  }`}
                  id="btn-modal-register"
                >
                  <span>{isFull ? 'Join Waitlist' : 'Apply / Register Now'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
