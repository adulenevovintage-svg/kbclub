import React, { useState } from 'react';
import { Registration, Club } from '../types';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Users, X, Search, Check, AlertCircle } from 'lucide-react';

interface ClubOwnerRegistrationPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
  clubs: Club[];
  onApprove: (regId: string) => void;
  onReject: (regId: string) => void;
}

export const ClubOwnerRegistrationPortalModal: React.FC<ClubOwnerRegistrationPortalModalProps> = ({
  isOpen,
  onClose,
  registrations,
  clubs,
  onApprove,
  onReject,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'enrolled'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredRegistrations = registrations.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = 
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-2xl bg-zinc-900 border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#141022] via-[#100c1c] to-[#0a0812] border-b border-[#2e264a] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Club Owner Registration Review Portal
              </h2>
              <p className="text-xs text-zinc-400">
                Universal Student Registration Requests & Admissions Management (Firebase Synced)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'pending'
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Pending Requests ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus('enrolled')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'enrolled'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Accepted / Enrolled
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-zinc-700 text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              All Records ({registrations.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or club..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40 text-amber-400" />
              <p className="text-sm font-medium text-zinc-400">No student registration requests found.</p>
              <p className="text-xs text-zinc-600 mt-1">Students registering from the catalog will instantly appear here.</p>
            </div>
          ) : (
            filteredRegistrations.map((reg) => {
              const club = clubs.find(c => c.id === reg.clubId);
              const isPending = reg.status === 'pending';
              const isEnrolled = reg.status === 'enrolled';

              return (
                <div 
                  key={reg.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isPending 
                      ? 'bg-amber-500/5 border-amber-500/30 shadow-md' 
                      : 'bg-zinc-900/60 border-zinc-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{reg.studentName}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                        Grade {reg.studentGrade || 11}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                        {reg.studentEmail}
                      </span>
                      {isPending && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider animate-pulse">
                          Pending Approval
                        </span>
                      )}
                      {isEnrolled && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider">
                          Enrolled & Active
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap pt-1">
                      <span className="font-semibold text-amber-300">Club: {reg.clubName}</span>
                      <span>&bull;</span>
                      <span>Requested: {reg.registrationDate}</span>
                      {reg.statementOfInterest && (
                        <>
                          <span>&bull;</span>
                          <span className="italic text-zinc-400">"{reg.statementOfInterest}"</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(reg.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept Request</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(reg.id)}
                          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-400 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                        <span>Successfully Registered</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Club Owner Privilege: Accepting requests instantly synchronizes student rosters and increases club member counts universally via Firebase.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
};
