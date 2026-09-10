import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  User,
  Hash,
  Phone,
  Building2,
  Calendar,
  FileText,
  Code2,
  Check,
} from 'lucide-react';
import {
  RegistrationFormData,
  FormErrors,
  DEPARTMENTS,
  ACADEMIC_YEARS,
  POPULAR_SKILLS,
} from '../types';

interface RegistrationPageProps {
  onBackToLogin: () => void;
  onGoToPortal?: (registeredData: RegistrationFormData) => void;
}

export function RegistrationPage({ onBackToLogin, onGoToPortal }: RegistrationPageProps) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    usn: '',
    contactNumber: '',
    department: '',
    year: '',
    reasonToJoin: '',
    skills: ['Full-Stack Web', 'UI/UX Design'],
  });

  const [skillInput, setSkillInput] = useState('');
  const [touched, setTouched] = useState<Partial<Record<keyof RegistrationFormData, boolean>>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Field validation logic
  const validateField = (field: keyof RegistrationFormData, value: any): string => {
    switch (field) {
      case 'name':
        if (!value || !value.trim()) return 'Full name is required';
        if (value.trim().length < 3) return 'Name must be at least 3 characters';
        return '';
      case 'usn':
        if (!value || !value.trim()) return 'USN / Student ID is required';
        if (value.trim().length < 5) return 'Enter a valid university USN (e.g. 1MS22CS042)';
        return '';
      case 'contactNumber': {
        if (!value || !value.trim()) return 'Contact number is required';
        // Clean numeric digits
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length < 10) return 'Please enter a valid 10-digit phone number';
        if (cleaned.length > 13) return 'Phone number cannot exceed 13 digits';
        return '';
      }
      case 'department':
        if (!value) return 'Please select your department';
        return '';
      case 'year':
        if (!value) return 'Please select your current academic year';
        return '';
      case 'reasonToJoin':
        if (!value || !value.trim()) return 'Please describe why you want to join Ascent';
        if (value.trim().length < 20)
          return `Please write at least 20 characters (${20 - value.trim().length} more needed)`;
        return '';
      case 'skills':
        if (!value || value.length === 0) return 'Add at least one skill or interest area';
        return '';
      default:
        return '';
    }
  };

  const validateAll = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as (keyof RegistrationFormData)[]).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      usn: true,
      contactNumber: true,
      department: true,
      year: true,
      reasonToJoin: true,
      skills: true,
    });

    return isValid;
  };

  const handleBlur = (field: keyof RegistrationFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const errorMsg = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  // Add custom skill tag
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (formData.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput('');
      return;
    }
    const updated = [...formData.skills, trimmed];
    handleChange('skills', updated);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = formData.skills.filter((s) => s !== skillToRemove);
    handleChange('skills', updated);
  };

  const handleTogglePopularSkill = (skill: string) => {
    const exists = formData.skills.some((s) => s.toLowerCase() === skill.toLowerCase());
    let updated: string[];
    if (exists) {
      updated = formData.skills.filter((s) => s.toLowerCase() !== skill.toLowerCase());
    } else {
      updated = [...formData.skills, skill];
    }
    handleChange('skills', updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      setIsSubmittedSuccess(true);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#26282A]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackToLogin}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0C0D0E] hover:bg-[#141517] text-[#D1D5DB] hover:text-white border border-[#26282A] transition-colors text-xs font-subheading group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#D4A373]" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>

      {/* Main Registration Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden group hover:border-[#3D4042] transition-colors"
      >
        {/* Accent strip */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent opacity-80" />

        {/* Page Title & Context inspired by reference design */}
        <div className="mb-8">
          {/* Accent horizontal bar */}
          <div className="w-12 h-1 bg-[#D4A373] rounded-full mb-4 shadow-sm shadow-[#D4A373]/30" />

          {/* Heading in Inter font with two-tone styling */}
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Member Registration <span className="text-[#D4A373]">& Profile</span>
          </h1>

          {/* Subheading in Century Gothic */}
          <p className="font-subheading text-[#A3A3A3] text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Fueling ideas, shaping futures. Complete your member profile below to join Ascent’s
            engineering divisions, technical labs, workshops, and competitive hackathon teams.
          </p>
        </div>

        {/* Success Modal / Banner */}
        <AnimatePresence>
          {isSubmittedSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 p-6 rounded-2xl bg-[#000000] border border-[#D4A373] shadow-xl relative"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-[#D4A373]/15 text-[#D4A373] border border-[#D4A373]/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-lg font-bold text-white">
                    Registration Data Validated Successfully!
                  </h3>
                  <p className="font-subheading text-xs text-[#D1D5DB] mt-1 leading-relaxed">
                    Frontend verification passed for{' '}
                    <strong className="text-[#D4A373]">{formData.name}</strong> ({formData.usn}). All
                    7 required candidate parameters have been structured and validated for future
                    backend integration.
                  </p>

                  {/* Summary Profile Preview */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0C0D0E] p-3.5 rounded-xl border border-[#26282A] text-xs font-subheading">
                    <div>
                      <span className="text-[#717579] block text-[10px] uppercase">DEPARTMENT</span>
                      <span className="text-white truncate block font-medium">{formData.department}</span>
                    </div>
                    <div>
                      <span className="text-[#717579] block text-[10px] uppercase">YEAR</span>
                      <span className="text-white block font-medium">{formData.year}</span>
                    </div>
                    <div>
                      <span className="text-[#717579] block text-[10px] uppercase">CONTACT</span>
                      <span className="text-white block font-medium">{formData.contactNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#717579] block text-[10px] uppercase">SKILLS COUNT</span>
                      <span className="text-[#D4A373] block font-medium">{formData.skills.length} Selected</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSubmittedSuccess(false)}
                      className="px-4 py-2 bg-[#141517] hover:bg-[#26282A] text-white text-xs font-subheading font-medium rounded-full border border-[#26282A] transition-colors"
                    >
                      Edit Application Form
                    </button>
                    {onGoToPortal && (
                      <button
                        type="button"
                        onClick={() => onGoToPortal(formData)}
                        className="px-5 py-2 bg-[#D4A373] hover:bg-[#c49363] text-[#000000] text-xs font-bold font-heading rounded-full shadow-lg shadow-[#D4A373]/20 transition-colors cursor-pointer"
                      >
                        Enter Member Portal →
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onBackToLogin}
                      className="px-4 py-2 bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] hover:text-white text-xs font-subheading rounded-full border border-[#26282A] transition-colors"
                    >
                      Return to Login
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Section 1: Personal & Academic Identification */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* 1. Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-name"
                  className="flex items-center justify-between text-xs font-medium text-[#D1D5DB] uppercase tracking-wider font-subheading"
                >
                  <span>
                    Full Name <span className="text-[#D4A373]">*</span>
                  </span>
                  {touched.name && !errors.name && (
                    <span className="text-[#D4A373] text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. Alex Rivera"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#000000] border rounded-xl text-white text-sm placeholder-[#555A5E] focus:outline-none font-subheading transition-all duration-200 ${
                      touched.name && errors.name
                        ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[#26282A] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]'
                    }`}
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-subheading">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* 2. USN */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-usn"
                  className="flex items-center justify-between text-xs font-medium text-[#D1D5DB] uppercase tracking-wider font-subheading"
                >
                  <span>
                    USN / University Seat No. <span className="text-[#D4A373]">*</span>
                  </span>
                  {touched.usn && !errors.usn && (
                    <span className="text-[#D4A373] text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-usn"
                    type="text"
                    value={formData.usn}
                    onChange={(e) => handleChange('usn', e.target.value.toUpperCase())}
                    onBlur={() => handleBlur('usn')}
                    placeholder="e.g. 1MS22CS042"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#000000] border rounded-xl text-white text-sm uppercase placeholder-[#555A5E] focus:outline-none font-mono-tech transition-all duration-200 ${
                      touched.usn && errors.usn
                        ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[#26282A] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]'
                    }`}
                  />
                </div>
                {touched.usn && errors.usn ? (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-subheading">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.usn}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#717579] font-subheading">
                    Official university seat identification number
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* 3. Contact Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-contact"
                  className="flex items-center justify-between text-xs font-medium text-[#D1D5DB] uppercase tracking-wider font-subheading"
                >
                  <span>
                    Contact Number <span className="text-[#D4A373]">*</span>
                  </span>
                  {touched.contactNumber && !errors.contactNumber && (
                    <span className="text-[#D4A373] text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-contact"
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^\d+ -]/g, '');
                      handleChange('contactNumber', val);
                    }}
                    onBlur={() => handleBlur('contactNumber')}
                    placeholder="e.g. 9876543210"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#000000] border rounded-xl text-white text-sm placeholder-[#555A5E] focus:outline-none font-subheading transition-all duration-200 ${
                      touched.contactNumber && errors.contactNumber
                        ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[#26282A] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]'
                    }`}
                  />
                </div>
                {touched.contactNumber && errors.contactNumber ? (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-subheading">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.contactNumber}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#717579] font-subheading">10-digit phone number</p>
                )}
              </div>

              {/* 4. Department */}
              <div className="space-y-1.5 sm:col-span-1">
                <label
                  htmlFor="reg-department"
                  className="flex items-center justify-between text-xs font-medium text-[#D1D5DB] uppercase tracking-wider font-subheading"
                >
                  <span>
                    Department <span className="text-[#D4A373]">*</span>
                  </span>
                  {touched.department && !errors.department && (
                    <span className="text-[#D4A373] text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <select
                    id="reg-department"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    onBlur={() => handleBlur('department')}
                    className={`w-full pl-10 pr-8 py-2.5 bg-[#000000] border rounded-xl text-white text-sm focus:outline-none font-subheading transition-all duration-200 appearance-none cursor-pointer ${
                      touched.department && errors.department
                        ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[#26282A] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]'
                    } ${!formData.department ? 'text-[#555A5E]' : 'text-white'}`}
                  >
                    <option value="" disabled className="bg-[#0C0D0E] text-[#555A5E]">
                      Select your department
                    </option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept} className="bg-[#0C0D0E] text-white">
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8E9296]">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
                {touched.department && errors.department && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-subheading">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.department}</span>
                  </p>
                )}
              </div>

              {/* 5. Year */}
              <div className="space-y-1.5 sm:col-span-1">
                <label
                  htmlFor="reg-year"
                  className="flex items-center justify-between text-xs font-medium text-[#D1D5DB] uppercase tracking-wider font-subheading"
                >
                  <span>
                    Academic Year <span className="text-[#D4A373]">*</span>
                  </span>
                  {touched.year && !errors.year && (
                    <span className="text-[#D4A373] text-[10px] flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Valid
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#545454] group-focus-within:text-[#D4A373] transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <select
                    id="reg-year"
                    value={formData.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    onBlur={() => handleBlur('year')}
                    className={`w-full pl-10 pr-8 py-2.5 bg-[#000000] border rounded-xl text-white text-sm focus:outline-none font-subheading transition-all duration-200 appearance-none cursor-pointer ${
                      touched.year && errors.year
                        ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-[#26282A] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]'
                    } ${!formData.year ? 'text-[#555A5E]' : 'text-white'}`}
                  >
                    <option value="" disabled className="bg-[#0C0D0E] text-[#555A5E]">
                      Select academic year
                    </option>
                    {ACADEMIC_YEARS.map((yr) => (
                      <option key={yr} value={yr} className="bg-[#0C0D0E] text-white">
                        {yr}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8E9296]">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
                {touched.year && errors.year && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-subheading">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errors.year}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Statement of Purpose & Club Alignment */}
          <div className="space-y-4 pt-3 border-t border-[#26282A]/50">
            {/* 6. Reason to Join Ascent */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="reg-reason"
                  className="flex items-center gap-1 text-xs font-medium text-[#D1D5DB] uppercase tracking-wider font-subheading"
                >
                  <FileText className="w-3.5 h-3.5 text-[#545454]" />
                  <span>
                    Why Ascent <span className="text-[#D4A373]">*</span>
                  </span>
                </label>
                <span className="text-[11px] font-subheading text-[#717579]">
                  {formData.reasonToJoin.trim().length} chars (min 20)
                </span>
              </div>
              <textarea
                id="reg-reason"
                rows={4}
                value={formData.reasonToJoin}
                onChange={(e) => handleChange('reasonToJoin', e.target.value)}
                onBlur={() => handleBlur('reasonToJoin')}
                placeholder="Explain what motivates you to join Ascent, what technologies excite you, and what you hope to build or learn with the team..."
                className={`w-full px-4 py-3 bg-[#000000] border rounded-xl text-white text-sm placeholder-[#555A5E] focus:outline-none font-subheading transition-all duration-200 resize-y min-h-[100px] leading-relaxed ${
                  touched.reasonToJoin && errors.reasonToJoin
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-[#26282A] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373]'
                }`}
              />
              {touched.reasonToJoin && errors.reasonToJoin && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-subheading">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.reasonToJoin}</span>
                </p>
              )}
            </div>

            {/* 7. Skills (Tag-style input) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="reg-skills-input"
                  className="flex items-center gap-1 text-xs font-medium text-[#D1D5DB] uppercase tracking-wider font-subheading"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#545454]" />
                  <span>
                    Skills & Technical Expertise <span className="text-[#D4A373]">*</span>
                  </span>
                </label>
                <span className="text-[11px] font-subheading text-[#D4A373]">
                  {formData.skills.length} skills added
                </span>
              </div>

              {/* Tag Input Box */}
              <div
                className={`p-3.5 bg-[#000000] border rounded-2xl transition-all duration-200 ${
                  touched.skills && errors.skills
                    ? 'border-red-500/80'
                    : 'border-[#26282A] focus-within:border-[#D4A373]'
                }`}
              >
                {/* Active Skill Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0C0D0E] text-white border border-[#D4A373]/40 text-xs font-subheading font-medium group hover:border-[#D4A373] transition-colors"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-[#8E9296] hover:text-[#D4A373] rounded-full p-0.5 hover:bg-[#141517] transition-colors focus:outline-none"
                        aria-label={`Remove skill ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Input field inside container */}
                  <div className="flex-1 min-w-[160px] flex items-center gap-2">
                    <input
                      id="reg-skills-input"
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Type a skill & press Enter..."
                      className="w-full bg-transparent text-white text-xs placeholder-[#555A5E] focus:outline-none py-1 font-subheading"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-3 py-1 rounded-full bg-[#0C0D0E] hover:bg-[#141517] text-xs text-[#D4A373] font-subheading border border-[#D4A373]/40 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>

                {/* Popular suggestions quick select */}
                <div className="pt-2.5 border-t border-[#26282A] flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-subheading text-[#717579] mr-1">QUICK TAGS:</span>
                  {POPULAR_SKILLS.map((popSkill) => {
                    const isSelected = formData.skills.some(
                      (s) => s.toLowerCase() === popSkill.toLowerCase()
                    );
                    return (
                      <button
                        key={popSkill}
                        type="button"
                        onClick={() => handleTogglePopularSkill(popSkill)}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full transition-all font-subheading cursor-pointer ${
                          isSelected
                            ? 'bg-[#D4A373] text-[#000000] font-semibold shadow-sm shadow-[#D4A373]/20'
                            : 'bg-[#0C0D0E] text-[#A3A3A3] border border-[#26282A] hover:border-[#D4A373]/50 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {popSkill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {touched.skills && errors.skills && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1 font-subheading">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.skills}</span>
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-[#26282A] flex items-center justify-end gap-3 w-full">
            <button
              type="button"
              onClick={onBackToLogin}
              className="w-1/2 sm:w-32 py-2.5 rounded-xl bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] hover:text-white border border-[#26282A] text-sm font-subheading font-medium transition-colors cursor-pointer text-center flex items-center justify-center"
            >
              Cancel
            </button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              id="btn-submit-registration"
              className="w-1/2 sm:w-32 py-2.5 bg-[#D4A373] hover:bg-[#c49363] text-[#000000] font-heading font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-[#D4A373]/20 transition-all duration-200 flex items-center justify-center cursor-pointer text-center"
            >
              <span>Submit</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
