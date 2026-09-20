import React, { useState, useEffect } from 'react';
import { StudentAccount } from '../types';
import { AmharicAvatarPicker } from './AmharicAvatarPicker';
import { generateAmharicAvatarDataUrl, getSuggestedAmharicLetter } from '../utils/amharicAvatars';
import { 
  X, 
  GraduationCap, 
  ShieldAlert, 
  Copy, 
  Check, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  QrCode, 
  CheckCircle2, 
  UserPlus, 
  LogIn, 
  IdCard, 
  AlertTriangle,
  School,
  FileCheck,
  BookOpen,
  Home,
  KeyRound,
  Hash,
  Mail,
  RefreshCw
} from 'lucide-react';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (account: StudentAccount) => void;
  onLoginSuccess: (account: StudentAccount) => void;
  registeredAccounts: StudentAccount[];
  onAddToast: (type: 'success' | 'warning' | 'info', title: string, message: string) => void;
  initialMode?: 'register' | 'login';
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
  onLoginSuccess,
  registeredAccounts,
  onAddToast,
  initialMode = 'register'
}) => {
  const [mode, setMode] = useState<'register' | 'login' | 'id_created'>(initialMode);

  // Sync mode with initialMode when opened
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLoginError('');
    }
  }, [isOpen, initialMode]);

  // Registration form states (High School: 9, 10, 11, 12)
  const [firstName, setFirstName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [gmail, setGmail] = useState('');
  const [gmailTouched, setGmailTouched] = useState(false);
  const [grade, setGrade] = useState<number>(9);
  const [section, setSection] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(() => generateAmharicAvatarDataUrl('ሀ', 'gold'));
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Generated Account State after successful registration
  const [createdAccount, setCreatedAccount] = useState<StudentAccount | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Update avatar auto-suggestion on first name change
  const handleFirstNameChange = (val: string) => {
    setFirstName(val);
    if (val.trim()) {
      const suggestedLetter = getSuggestedAmharicLetter(val);
      setSelectedAvatarUrl(generateAmharicAvatarDataUrl(suggestedLetter, 'gold'));
    }
  };

  // Distinct Login Method Selection: Either ID Number ONLY or Password ONLY
  const [loginMethod, setLoginMethod] = useState<'id_only' | 'password_only'>('id_only');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [nameOrEmailInput, setNameOrEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  if (!isOpen) return null;

  // Gmail Validation Helper: Must end with @gmail.com or @googlemail.com and have valid format
  const isValidGmail = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const gmailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_\-+%]+)*@(gmail\.com|googlemail\.com)$/i;
    return gmailRegex.test(trimmed);
  };

  // Generate unique Student ID Number
  const generateStudentId = (targetGrade: number, targetSection: string): string => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `KB-2026-${targetGrade}${targetSection}-${randomNum}`;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedFirst = firstName.trim();
    const trimmedFather = fatherName.trim();
    const trimmedGmail = gmail.trim().toLowerCase();

    if (!trimmedFirst || !trimmedFather) {
      onAddToast('warning', 'Incomplete Name', 'Please provide both your First Name and Father’s Name.');
      return;
    }

    if (!trimmedGmail) {
      onAddToast('warning', 'Gmail Required', 'Please enter your Gmail address.');
      return;
    }

    if (!isValidGmail(trimmedGmail)) {
      onAddToast('warning', 'Invalid Gmail Address', 'Please provide a valid Gmail address ending in @gmail.com (e.g. name@gmail.com).');
      return;
    }

    if (regPassword.length < 4) {
      onAddToast('warning', 'Password Too Short', 'Password must be at least 4 characters long.');
      return;
    }

    if (regPassword !== confirmPassword) {
      onAddToast('warning', 'Passwords Do Not Match', 'Please make sure your passwords match.');
      return;
    }

    const fullName = `${trimmedFirst} ${trimmedFather}`;
    const generatedId = generateStudentId(grade, section);

    // Chosen Amharic letter avatar
    const chosenAvatar = selectedAvatarUrl || generateAmharicAvatarDataUrl(getSuggestedAmharicLetter(trimmedFirst), 'gold');

    const newAccount: StudentAccount = {
      id: generatedId,
      studentIdNumber: generatedId,
      firstName: trimmedFirst,
      fatherName: trimmedFather,
      fullName: fullName,
      grade: Number(grade),
      section: section,
      password: regPassword,
      email: trimmedGmail,
      registeredAt: new Date().toISOString(),
      avatarUrl: chosenAvatar,
      status: 'active'
    };

    setCreatedAccount(newAccount);
    setMode('id_created');
    onAddToast('success', 'Account Created & Gmail Verified!', 'Your official Student ID has been generated.');
  };

  const handleCopyId = () => {
    if (!createdAccount) return;
    navigator.clipboard.writeText(createdAccount.studentIdNumber);
    setCopiedId(true);
    onAddToast('success', 'ID Copied to Clipboard', `Copied ${createdAccount.studentIdNumber}. Keep it safe!`);
    setTimeout(() => setCopiedId(false), 3000);
  };

  const handleFinishRegistration = () => {
    if (createdAccount) {
      onRegisterSuccess(createdAccount);
      onClose();
    }
  };

  // Distinct Login Handler: ID Only vs Password Only
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginMethod === 'id_only') {
      const cleanId = studentIdInput.trim().toLowerCase();
      if (!cleanId) {
        setLoginError('Please enter your Student ID number to log in.');
        return;
      }

      // Match by full ID or partial match
      const matched = registeredAccounts.find(acc => 
        acc.studentIdNumber.toLowerCase() === cleanId || 
        acc.id.toLowerCase() === cleanId ||
        acc.studentIdNumber.toLowerCase().includes(cleanId)
      );

      if (matched) {
        onAddToast('success', 'Authenticated via Student ID', `Welcome back, ${matched.fullName} (Grade ${matched.grade}-${matched.section})!`);
        onLoginSuccess(matched);
        onClose();
      } else {
        setLoginError(`No registered student was found matching ID "${studentIdInput}". Please verify or create a new student account.`);
      }
    } else {
      // Password only mode: requires legal name / email + password
      const cleanName = nameOrEmailInput.trim().toLowerCase();
      const cleanPass = passwordInput.trim();

      if (!cleanName || !cleanPass) {
        setLoginError('Please enter both your Legal Full Name (or Email) and your password.');
        return;
      }

      const matched = registeredAccounts.find(acc => {
        const matchName = acc.fullName.toLowerCase() === cleanName || acc.firstName.toLowerCase() === cleanName;
        const matchEmail = acc.email.toLowerCase() === cleanName;
        return (matchName || matchEmail) && acc.password === cleanPass;
      });

      if (matched) {
        onAddToast('success', 'Authenticated via Password', `Welcome back, ${matched.fullName}!`);
        onLoginSuccess(matched);
        onClose();
      } else {
        setLoginError('Invalid name or password. Please verify your credentials or switch to "Use Student ID" login.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in-50 overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-[#12141c] border border-[#2b3040] shadow-2xl overflow-hidden text-zinc-200">
        
        {/* Top Header Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-[#c5832b] to-emerald-500" />
        
        {/* Navigation Bar at Top of Modal: Back to Main Website & Close Button */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1a1d27] hover:bg-[#252a3a] border border-[#2b3040] text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm group"
            id="modal-btn-back-to-website"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#c5832b] group-hover:-translate-x-1 transition-transform" />
            <span>← Back to Main Website</span>
          </button>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Close dialog"
            id="modal-btn-close-x"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Top Banner */}
        <div className="px-6 sm:px-8 pb-4 pt-2 border-b border-[#232836] bg-gradient-to-b from-[#181c28] to-[#12141c]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#e5a93c] shadow-inner flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[10px] font-bold uppercase tracking-wider">
                High School Portal (Grades 9–12)
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {mode === 'id_created' 
                  ? 'Official Student ID Generated' 
                  : mode === 'register' 
                  ? 'New Student Registration' 
                  : 'Student Portal Log In'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {mode === 'id_created'
              ? 'Your high school student account is registered in the KB Academy database. Copy your unique ID Number below.'
              : mode === 'register'
              ? 'Enter your legitimate First & Father’s name, verified Gmail address, High School grade (9–12), and section to create your account.'
              : 'Choose your preferred sign-in method: Log in using your assigned Student ID Number, or log in with your Password.'}
          </p>

          {/* Mode Switch Tabs (Only show during register or login) */}
          {mode !== 'id_created' && (
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-2xl bg-[#0c0d12] border border-[#232836]">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setLoginError('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-[#c5832b] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                id="tab-mode-register"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New Account</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLoginError('');
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#c5832b] text-white shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                id="tab-mode-login"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* ================= MODE 1: REGISTRATION FORM ================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              
              {/* Legitimate Legal Name Advisory Box */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-200 text-xs leading-relaxed space-y-2 shadow-inner">
                <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                  <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>MANDATORY: High School Legal Name Policy</span>
                </div>
                <p className="text-[12px] text-amber-100/90 font-medium">
                  Please enter your <strong className="text-white underline decoration-amber-400 underline-offset-2">legitimate legal first name and father’s name</strong> exactly as documented on your official KB Academy registration file.
                </p>
                <p className="text-[11px] text-amber-200/80">
                  ⚠️ <em>This name is administered strictly for high school (Grades 9–12) attendance tracking, syndicate rosters, and official academic certificates.</em>
                </p>
              </div>

              {/* Name Fields: First Name & Father Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    First / Given Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    placeholder="e.g. Dawit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d12] border border-[#2b3040] focus:border-[#c5832b] text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Father’s Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Yohannes"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d12] border border-[#2b3040] focus:border-[#c5832b] text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Full Name Preview */}
              {(firstName.trim() || fatherName.trim()) && (
                <div className="p-3 rounded-xl bg-[#0c0d12] border border-[#1f232c] flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Administered Full Legal Name:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {firstName.trim() || '—'} {fatherName.trim() || '—'}
                  </span>
                </div>
              )}

              {/* Gmail Address Verification Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Personal / Student Gmail Address <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={gmail}
                    onChange={(e) => {
                      setGmail(e.target.value);
                      setGmailTouched(true);
                    }}
                    onBlur={() => setGmailTouched(true)}
                    placeholder="e.g. dawityohannes@gmail.com"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0c0d12] border text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                      gmailTouched && gmail.trim()
                        ? isValidGmail(gmail)
                          ? 'border-emerald-500/80 focus:border-emerald-500 ring-1 ring-emerald-500/30'
                          : 'border-rose-500/80 focus:border-rose-500 ring-1 ring-rose-500/30'
                        : 'border-[#2b3040] focus:border-[#c5832b]'
                    }`}
                    id="input-registration-gmail"
                  />
                  {gmail.trim() && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                      {isValidGmail(gmail) ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                  )}
                </div>

                {/* Real-time Gmail Validation Indicator */}
                {gmailTouched && gmail.trim() && (
                  <div className="mt-1.5">
                    {isValidGmail(gmail) ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Valid Gmail address format verified (@gmail.com)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>Invalid: Must be a legitimate Gmail address ending in @gmail.com</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[11px] text-zinc-500 mt-1">
                  Enter your active Gmail address for official academy notifications & student verification.
                </p>
              </div>

              {/* Grade Level Selection (Only High School: 9, 10, 11, 12) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  High School Grade Level (Grades 9 to 12) <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[9, 10, 11, 12].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGrade(g)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        grade === g
                          ? 'bg-[#c5832b] text-white border-[#c5832b] shadow-md shadow-amber-900/30 ring-2 ring-amber-400/40'
                          : 'bg-[#0c0d12] text-zinc-400 border-[#2b3040] hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      Grade {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Section Selection (A to E) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Assigned Section (A through E) <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['A', 'B', 'C', 'D', 'E'] as const).map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setSection(sec)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        section === sec
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/40 ring-2 ring-emerald-400/40'
                          : 'bg-[#0c0d12] text-zinc-400 border-[#2b3040] hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      Section {sec}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amharic Letter Profile Picture / Avatar Selector */}
              <AmharicAvatarPicker
                selectedAvatarUrl={selectedAvatarUrl}
                onSelectAvatar={(url) => setSelectedAvatarUrl(url)}
                studentFirstName={firstName}
                label="Choose Your Amharic Letter Profile Avatar"
              />

              {/* Password Creation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Create Portal Password <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimum 4 characters"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#0c0d12] border border-[#2b3040] focus:border-[#c5832b] text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Confirm Password <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d12] border text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                      confirmPassword && confirmPassword !== regPassword
                        ? 'border-rose-500/80 focus:border-rose-500'
                        : confirmPassword && confirmPassword === regPassword
                        ? 'border-emerald-500/80 focus:border-emerald-500'
                        : 'border-[#2b3040] focus:border-[#c5832b]'
                    }`}
                  />
                </div>
              </div>

              {/* Submit & Back Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#c5832b] to-[#b16f1d] hover:from-[#d69136] hover:to-[#c5832b] text-white font-bold text-sm shadow-xl shadow-amber-950/40 hover:shadow-amber-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-submit-student-registration"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Register & Generate Official Student ID</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Main Website</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setLoginError('');
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                  >
                    Already have an account? Log In →
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ================= MODE 2: ID GENERATED SUCCESS SCREEN ================= */}
          {mode === 'id_created' && createdAccount && (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              
              {/* Big Prominent Copy Warning Alert */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-amber-950/60 to-red-950/60 border-2 border-red-500/60 text-white space-y-2">
                <div className="flex items-center gap-2 font-black text-red-300 text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce flex-shrink-0" />
                  <span>CRUCIAL: PLEASE COPY & RECORD YOUR ID NUMBER NOW!</span>
                </div>
                <p className="text-xs text-red-100 leading-relaxed font-medium">
                  You will need this <strong>Official Student ID Number</strong> to instantly log in to the portal in future sessions without typing a password.
                </p>
              </div>

              {/* Official Digital Student ID Card Preview */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#1b2030] via-[#151824] to-[#0c0e14] border-2 border-amber-500/50 p-6 shadow-2xl overflow-hidden">
                {/* ID Header */}
                <div className="flex items-center justify-between border-b border-zinc-700/60 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white p-0.5 border border-amber-400">
                      <img 
                        src="https://cdn.phototourl.com/free/2026-09-19-d8f0f13c-5886-4de1-b7ba-8996d63ce1a3.jpg" 
                        alt="KB"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="text-[11px] font-black tracking-wider text-amber-300 uppercase">KB ACADEMY</div>
                      <div className="text-[9px] text-zinc-400">OFFICIAL STUDENT DIGITAL ID</div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                    VALID 2026-2027
                  </div>
                </div>

                {/* ID Details Layout */}
                <div className="flex items-center gap-4">
                  <img
                    src={createdAccount.avatarUrl}
                    alt={createdAccount.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-[10px] font-bold uppercase text-zinc-400">Legitimate Registered Scholar</div>
                    <div className="text-lg font-black text-white truncate">{createdAccount.fullName}</div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                      <span>Grade {createdAccount.grade}</span>
                      <span>&bull;</span>
                      <span>Section {createdAccount.section}</span>
                    </div>
                  </div>
                </div>

                {/* Prominent ID Highlight Box with Copy Button */}
                <div className="mt-5 p-3.5 rounded-2xl bg-[#0a0b10] border border-amber-500/40 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                      Assigned Student ID Number
                    </div>
                    <div className="text-lg sm:text-xl font-mono font-black text-emerald-400 tracking-wider">
                      {createdAccount.studentIdNumber}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyId}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                      copiedId
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#c5832b] hover:bg-[#a96721] text-white'
                    }`}
                    id="btn-copy-generated-student-id"
                  >
                    {copiedId ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-white" />
                        <span>Copy ID</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                  <span>High School Portal ID</span>
                  <span>STATUS: ACCREDITED</span>
                </div>
              </div>

              {/* Action: Proceed or Return */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs border border-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Main Website</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinishRegistration}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-enter-portal-after-register"
                >
                  <span>Enter Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= MODE 3: DISTINCT SIGN IN FORM (ID ONLY vs PASSWORD ONLY) ================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Distinct Method Selector: Use ID Only OR Use Password Only */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Select Log In Method
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0c0d12] border border-[#2b3040]">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('id_only');
                      setLoginError('');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      loginMethod === 'id_only'
                        ? 'bg-[#c5832b] text-white shadow-md ring-1 ring-amber-400/40'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    id="btn-method-id-only"
                  >
                    <Hash className="w-4 h-4" />
                    <span>Use Student ID (No Password)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('password_only');
                      setLoginError('');
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      loginMethod === 'password_only'
                        ? 'bg-[#c5832b] text-white shadow-md ring-1 ring-amber-400/40'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    id="btn-method-password-only"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Use Password (No ID Needed)</span>
                  </button>
                </div>
              </div>

              {/* OPTION A: LOG IN WITH STUDENT ID ONLY */}
              {loginMethod === 'id_only' && (
                <div className="space-y-4 p-4 rounded-2xl bg-[#0e1017] border border-[#232734] animate-in fade-in-50">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                    <Hash className="w-4 h-4 text-amber-400" />
                    <span>Instant Login via Student ID Number</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Your Official Student ID Number <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentIdInput}
                      onChange={(e) => setStudentIdInput(e.target.value)}
                      placeholder="e.g. KB-2026-11B-10492"
                      className="w-full px-3.5 py-3 rounded-xl bg-[#0c0d12] border border-[#2b3040] focus:border-[#c5832b] text-sm text-emerald-400 placeholder-zinc-500 focus:outline-none transition-colors font-mono font-bold tracking-wider"
                      id="input-student-id-login"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1.5">
                      No password required when using your verified Student ID.
                    </p>
                  </div>
                </div>
              )}

              {/* OPTION B: LOG IN WITH NAME & PASSWORD */}
              {loginMethod === 'password_only' && (
                <div className="space-y-4 p-4 rounded-2xl bg-[#0e1017] border border-[#232734] animate-in fade-in-50">
                  <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Login via Registered Legal Name & Password</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Full Legal Name or Student Email <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={nameOrEmailInput}
                      onChange={(e) => setNameOrEmailInput(e.target.value)}
                      placeholder="e.g. Dawit Yohannes or dawit.yohannes@kbacademy.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0d12] border border-[#2b3040] focus:border-[#c5832b] text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                      id="input-name-password-login"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Account Password <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter your student portal password"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#0c0d12] border border-[#2b3040] focus:border-[#c5832b] text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                        id="input-password-login"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#c5832b] hover:bg-[#a96721] text-white font-bold text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-student-login-submit"
                >
                  <LogIn className="w-4 h-4" />
                  <span>
                    {loginMethod === 'id_only' ? 'Log In with Student ID' : 'Log In with Password'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Back Button & Switch to Register */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1f232c]">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Main Website</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setLoginError('');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
                >
                  Need an ID? Register here (Grades 9–12)
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
