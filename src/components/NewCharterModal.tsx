import React, { useState } from 'react';
import { ClubCategory, ClubCharterProposal, UserProfile } from '../types';
import { X, Award, Building2, DollarSign, Calendar, ShieldCheck, Sparkles, Send } from 'lucide-react';

interface NewCharterModalProps {
  user: UserProfile;
  onClose: () => void;
  onSubmitProposal: (proposal: Omit<ClubCharterProposal, 'id' | 'submissionDate' | 'directorStatus'>) => void;
}

export const NewCharterModal: React.FC<NewCharterModalProps> = ({
  user,
  onClose,
  onSubmitProposal,
}) => {
  const [clubName, setClubName] = useState('');
  const [category, setCategory] = useState<ClubCategory>('STEM & Technology');
  const [facultyAdvisor, setFacultyAdvisor] = useState('Faculty Advisor');
  const [facultyEmail, setFacultyEmail] = useState('advisor@kbacademy.edu');
  const [missionStatement, setMissionStatement] = useState('');
  const [proposedMeetingDay, setProposedMeetingDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Wednesday');
  const [proposedTimeSlot, setProposedTimeSlot] = useState('3:45 PM – 5:00 PM');
  const [requestedRoomType, setRequestedRoomType] = useState('Computer Lab / Innovation Studio');
  const [estimatedMembers, setEstimatedMembers] = useState(15);
  const [requestedBudget, setRequestedBudget] = useState(1200);
  const [safetyPlan, setSafetyPlan] = useState('Standard academy safety protocol; faculty sponsor present at all working sessions.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim() || !missionStatement.trim()) return;

    onSubmitProposal({
      clubName,
      category,
      proposedByStudent: user.name,
      studentGrade: user.grade || 11,
      studentEmail: user.email,
      facultyAdvisor,
      facultyEmail,
      missionStatement,
      proposedMeetingDay,
      proposedTimeSlot,
      requestedRoomType,
      estimatedMembers,
      requestedBudget,
      safetyPlan,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in-50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#14161f] border border-[#c5832b]/40 shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c5832b]/20 text-[#e5a93c] border border-[#c5832b]/30 text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-[#c5832b]" />
            KB Academy Charter Petition
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Propose a New Student Club or Syndicate
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Submitted petitions are reviewed directly by Highschool Director Mr. Wondwossen Erqiyhun and the Co-Curricular Governance Board.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Proposed Club Name</label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="e.g. Quantum Computing Research Guild"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Academy Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClubCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              >
                <option value="STEM & Technology">STEM & Technology</option>
                <option value="Debate & Leadership">Debate & Leadership</option>
                <option value="Arts & Performance">Arts & Performance</option>
                <option value="Civics & Culture">Civics & Culture</option>
                <option value="Academic Olympiad">Academic Olympiad</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Faculty Sponsor / Advisor</label>
              <input
                type="text"
                value={facultyAdvisor}
                onChange={(e) => setFacultyAdvisor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Faculty Contact Email</label>
              <input
                type="email"
                value={facultyEmail}
                onChange={(e) => setFacultyEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Charter Mission Statement & Scholastic Value
            </label>
            <textarea
              rows={3}
              value={missionStatement}
              onChange={(e) => setMissionStatement(e.target.value)}
              placeholder="Detail what students will investigate, build, or perform. How does this elevate KB Academy?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Proposed Day</label>
              <select
                value={proposedMeetingDay}
                onChange={(e) => setProposedMeetingDay(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Proposed Time Slot</label>
              <input
                type="text"
                value={proposedTimeSlot}
                onChange={(e) => setProposedTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Requested Budget ($)</label>
              <input
                type="number"
                value={requestedBudget}
                onChange={(e) => setRequestedBudget(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Requested Facility Type</label>
              <input
                type="text"
                value={requestedRoomType}
                onChange={(e) => setRequestedRoomType(e.target.value)}
                placeholder="e.g. Science Wet Lab, Amphitheater, CS Lab"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Estimated Founding Members</label>
              <input
                type="number"
                value={estimatedMembers}
                onChange={(e) => setEstimatedMembers(parseInt(e.target.value) || 12)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Safety & Risk Management Plan</label>
            <input
              type="text"
              value={safetyPlan}
              onChange={(e) => setSafetyPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d10] border border-[#2a2e3a] text-xs text-white focus:outline-none focus:border-[#c5832b]"
            />
          </div>

          <div className="pt-4 border-t border-[#1f232c] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1a1d26] text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-[#c5832b]/20"
              id="btn-submit-charter-petition"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Official Petition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
