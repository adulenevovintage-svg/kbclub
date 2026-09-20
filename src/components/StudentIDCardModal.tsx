import React, { useState } from 'react';
import { UserProfile, StudentAccount } from '../types';
import { X, Copy, Check, QrCode, ShieldCheck, Printer, Download, Sparkles } from 'lucide-react';

interface StudentIDCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: UserProfile;
  onAddToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
}

export const StudentIDCardModal: React.FC<StudentIDCardModalProps> = ({
  isOpen,
  onClose,
  student,
  onAddToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const idNumber = student.studentIdNumber || student.id;

  const handleCopy = () => {
    navigator.clipboard.writeText(idNumber);
    setCopied(true);
    onAddToast('success', 'Student ID Copied', `Copied ${idNumber} to clipboard.`);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in-50">
      <div className="relative w-full max-w-md rounded-3xl bg-[#12141c] border border-[#2b3040] shadow-2xl p-6 sm:p-8 space-y-6 text-zinc-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Digital Credential</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            KB Academy Student ID
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Official Co-Curricular & Highschool Accreditation Pass
          </p>
        </div>

        {/* The Digital ID Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1b2030] via-[#151824] to-[#0c0e14] border-2 border-amber-500/50 p-6 shadow-2xl overflow-hidden print:border-black print:bg-white print:text-black">
          {/* Subtle Decorative Ambient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Card Top Banner */}
          <div className="flex items-center justify-between border-b border-zinc-700/60 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 border border-amber-400 flex items-center justify-center">
                <img 
                  src="https://cdn.phototourl.com/free/2026-09-19-d8f0f13c-5886-4de1-b7ba-8996d63ce1a3.jpg" 
                  alt="KB"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-xs font-black tracking-wider text-amber-300 uppercase">KB ACADEMY</div>
                <div className="text-[9px] text-zinc-400">STUDENT IDENTIFICATION CARD</div>
              </div>
            </div>
            <div className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
              2026-2027
            </div>
          </div>

          {/* Student Photo and Info */}
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={student.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="text-[10px] font-bold uppercase text-zinc-400">Legitimate Scholar Name</div>
              <div className="text-lg font-black text-white truncate">{student.name}</div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span>Grade {student.grade || 11}</span>
                {student.section && (
                  <>
                    <span>&bull;</span>
                    <span>Section {student.section}</span>
                  </>
                )}
              </div>
              <div className="text-[11px] text-zinc-400 truncate">{student.email}</div>
            </div>
          </div>

          {/* ID Number Box */}
          <div className="mt-5 p-3.5 rounded-2xl bg-[#0a0b10] border border-amber-500/40 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Student ID Number
              </div>
              <div className="text-base sm:text-lg font-mono font-black text-emerald-400 tracking-wider">
                {idNumber}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#c5832b] hover:bg-[#a96721] text-white'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>BARCODE: ||| | |||| | ||| ||||</span>
            <span>VERIFIED ENROLLMENT</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs border border-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Copy className="w-4 h-4 text-amber-400" />
            <span>{copied ? 'Copied ID' : 'Copy ID Number'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-2.5 px-4 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print ID</span>
          </button>
        </div>
      </div>
    </div>
  );
};
