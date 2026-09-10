import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  User,
} from 'lucide-react';

interface LoginPageProps {
  onLoginClick: (identifier: string) => void;
  onNavigateToRegistration: () => void;
}

export function LoginPage({ onLoginClick, onNavigateToRegistration }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('1MS22CS042');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // When clicking Login, open exclusive Member Portal for this member
    onLoginClick(identifier.trim() || '1MS22CS042');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Centered Member Login Layout */}
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full"
        >
          {/* Member Login Card */}
          <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden group hover:border-[#3D4042] transition-colors">
            {/* Subtle top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent opacity-80" />

            {/* Accent horizontal bar */}
            <div className="w-12 h-1 bg-[#D4A373] rounded-full mb-4 shadow-sm shadow-[#D4A373]/30" />

            <div className="mb-6">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Member Login
              </h2>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-identifier"
                  className="block text-xs font-subheading font-medium text-[#D1D5DB] uppercase tracking-wider"
                >
                  Member ID
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your Member ID or USN"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm placeholder-[#555A5E] focus:outline-none focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] transition-all duration-200 font-subheading"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-subheading font-medium text-[#D1D5DB] uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="text-xs font-subheading text-[#8E9296] hover:text-[#D4A373] transition-colors focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm placeholder-[#555A5E] focus:outline-none focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] transition-all duration-200 font-subheading"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#555A5E] hover:text-white transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-subheading text-[#A3A3A3] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#26282A] bg-[#000000] text-[#D4A373] focus:ring-[#D4A373] w-4 h-4 accent-[#D4A373]"
                  />
                  <span>Remember terminal session</span>
                </label>
              </div>

              {/* Prominent Login Button with Secondary #D4A373 */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  id="btn-login-submit"
                  className="w-full py-3 px-6 bg-[#D4A373] hover:bg-[#c49363] text-[#000000] font-heading font-bold text-base tracking-wide rounded-xl shadow-lg shadow-[#D4A373]/20 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 text-[#000000]" />
                </motion.button>
              </div>
            </form>

            {/* Direct Link to Member Registration */}
            <div className="mt-5 pt-4 border-t border-[#26282A] text-center">
              <p className="text-xs font-subheading text-[#8E9296]">
                New applicant? Complete your candidate profile:
              </p>
              <button
                type="button"
                onClick={onNavigateToRegistration}
                className="mt-2 text-sm font-subheading font-medium text-[#D4A373] hover:text-[#e4b585] transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                Go to Member Registration Form
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
