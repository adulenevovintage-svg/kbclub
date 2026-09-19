import React, { useState } from 'react';
import { Club, UserProfile } from '../types';
import { X, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, ShieldCheck, Send } from 'lucide-react';

interface RegistrationModalProps {
  club: Club | null;
  student: UserProfile;
  onClose: () => void;
  onSubmit: (statementOfInterest: string) => void;
  requireAdvisorApproval: boolean;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  club,
  student,
  onClose,
  onSubmit,
  requireAdvisorApproval,
}) => {
  const [statement, setStatement] = useState('');

  if (!club) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(statement);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in-50">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#14161f] border border-[#2a2e3a] shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#c5832b]/20 text-[#e5a93c] border border-[#c5832b]/30 text-[10px] font-semibold uppercase tracking-wider mb-2">
            Fall 2026 Registration
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Register for {club.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Faculty Advisor: {club.advisorName} &bull; Room {club.room}
          </p>
        </div>

        {/* Meeting schedule recap */}
        <div className="p-3.5 rounded-xl bg-[#0c0d10] border border-[#1f232c] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#c5832b]" />
            <span className="font-semibold text-white">{club.meetingDay}</span>
          </div>
          <div className="text-zinc-400 font-mono">
            {club.meetingTime}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Candidate Statement of Interest
            </label>
            <textarea
              rows={4}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Why are you interested in joining this syndicate? Mention any relevant projects, prior experience, or roles you hope to take on..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#c5832b] leading-relaxed transition-colors"
              required
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#161822] border border-[#232730] text-xs space-y-1.5">
            <div className="flex items-center justify-between text-zinc-400">
              <span>Applicant:</span>
              <span className="text-white font-semibold">{student.name} (Grade {student.grade})</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Required Student Dues:</span>
              <span className="text-white font-semibold">${club.duesPerSemester} (Billed via Bursar)</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Review Flow:</span>
              <span className="text-amber-400 font-semibold">
                {requireAdvisorApproval ? 'Faculty Advisor Review' : 'Instant Automatic Enrollment'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1a1d26] text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#c5832b]/20"
              id="btn-submit-registration"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
