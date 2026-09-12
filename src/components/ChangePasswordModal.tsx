import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
}

export function ChangePasswordModal({ isOpen, onClose, memberName }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const origBody = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = origBody;
      document.documentElement.style.overflow = origHtml;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Compute password strength
  const getStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-zinc-700' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getStrength(newPassword);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword.trim()) {
      setError('Please enter your current password');
      return;
    }
    if (!newPassword.trim() || newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      }, 1800);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#26282A] bg-[#000000]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#141517] border border-[#D4A373]/50 flex items-center justify-center text-[#D4A373]">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-white">Change Password</h3>
                <span className="text-[11px] font-subheading text-[#8E9296]">
                  Update security passcode for {memberName}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#141517] hover:bg-[#1E2022] text-[#8E9296] hover:text-white border border-[#26282A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 font-subheading text-xs">
            {success ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-heading text-sm font-bold text-white">
                  Password Updated Successfully
                </h4>
                <p className="text-emerald-300 text-xs">
                  Your new credentials are now active across the Ascent Intranet.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-950/30 border border-red-500/50 rounded-xl text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Current Password */}
                <div className="space-y-1">
                  <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                    Current Password <span className="text-[#D4A373]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter current password"
                      className="w-full pl-3 pr-10 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8E9296] hover:text-white"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                      New Password <span className="text-[#D4A373]">*</span>
                    </label>
                    {newPassword && (
                      <span className="text-[10px] text-[#8E9296]">
                        Strength: <strong className="text-white">{strength.label}</strong>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-3 pr-10 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8E9296] hover:text-white"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator Bar */}
                  {newPassword && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            strength.score >= step ? strength.color : 'bg-[#26282A]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                    Confirm New Password <span className="text-[#D4A373]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Re-enter new password"
                      className="w-full pl-3 pr-10 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4A373]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8E9296] hover:text-white"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Policy note */}
                <div className="p-3 bg-[#000000] border border-[#26282A] rounded-xl flex items-start gap-2 text-[11px] text-[#8E9296]">
                  <ShieldCheck className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                  <span>
                    Passwords must contain at least 6 characters. Avoid using simple student USNs or
                    repeating digits.
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#26282A] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] border border-[#26282A] text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-black font-heading font-bold text-xs shadow-md shadow-[#D4A373]/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{loading ? 'Updating...' : 'Save New Password'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
