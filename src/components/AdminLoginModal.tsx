import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, X, KeyRound, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onAddToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onAddToast,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === 'kb@2019') {
      setPassword('');
      setError('');
      onSuccess();
      onAddToast(
        'success',
        'Admin Mode Unlocked',
        'Live website editing is now active. Scroll through the page to edit elements directly.'
      );
      onClose();
    } else {
      setError('Invalid administrator password. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="admin-login-modal"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Administrator Authorization
              </h3>
              <p className="text-[11px] text-zinc-400">
                School Operations & Content Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-[#a06014] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-900">
              Enter Administrator Password
            </h4>
            <p className="text-xs text-zinc-600 mt-1 max-w-xs mx-auto">
              Please authenticate with the confidential administrator passcode to unlock live in-page website editing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter administrator password"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs font-medium text-zinc-900 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#c5832b] hover:bg-[#a96721] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                id="btn-admin-unlock"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Live Editor</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
