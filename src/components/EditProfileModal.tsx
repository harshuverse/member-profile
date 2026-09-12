import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, Plus, Trash2 } from 'lucide-react';
import { MemberProfile, DEPARTMENTS, ACADEMIC_YEARS, POPULAR_SKILLS } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MemberProfile;
  onSave: (updatedProfile: Partial<MemberProfile>) => void;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [department, setDepartment] = useState(profile.department);
  const [year, setYear] = useState(profile.year);
  const [bio, setBio] = useState(profile.bio || '');
  const [gender, setGender] = useState(profile.gender || 'Male');
  const [location, setLocation] = useState(profile.location || 'Advanced Computing Lab 4, Bangalore');
  const [phone, setPhone] = useState(profile.phone || '+91 98450 12042');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || profile.name,
      role: role.trim() || profile.role,
      department,
      year,
      bio: bio.trim(),
      gender,
      location: location.trim(),
      phone: phone.trim(),
      skills,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overscroll-contain"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0C0D0E] border border-[#26282A] w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl relative overflow-hidden overscroll-contain"
        >
          {/* Accent top gold gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4A373] to-transparent z-10" />

          {/* Header (Pinned) */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#26282A] shrink-0 bg-[#0C0D0E]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#141517] border border-[#D4A373]/30 flex items-center justify-center text-[#D4A373]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-extrabold text-white">
                  Edit Member Profile
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#8E9296] hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-8 py-5 space-y-4 text-xs font-subheading">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Systems Architect"
                    required
                    className="w-full bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  >
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                    Gender / Pronouns
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                    Phone / Intranet Ext
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12042"
                    className="w-full bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                  Campus Location / Lab Assignment
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Advanced Computing Lab 4, Bangalore"
                  className="w-full bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                  Bio / Engineering Statement
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Brief introduction of your engineering interests, research, or active club projects..."
                  className="w-full bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4A373] transition-colors resize-none"
                />
              </div>

              {/* Skills chips */}
              <div>
                <label className="block text-[#D1D5DB] mb-1.5 font-medium">
                  Technical Skills & Stacks
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-[#141517] border border-[#D4A373]/30 text-white text-[11px] flex items-center gap-1.5"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-[#8E9296] hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add custom skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(customSkillInput);
                      }
                    }}
                    placeholder="Add skill (press Enter)..."
                    className="flex-1 bg-[#000000] border border-[#26282A] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#D4A373] text-xs transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(customSkillInput)}
                    className="px-3 py-2 rounded-xl bg-[#141517] hover:bg-[#1E2022] text-[#D4A373] border border-[#D4A373]/40 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Suggested quick skills */}
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="text-[10px] text-[#717579] self-center mr-1">Suggestions:</span>
                  {POPULAR_SKILLS.slice(0, 6).map((pop) => (
                    <button
                      key={pop}
                      type="button"
                      onClick={() => handleAddSkill(pop)}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#000000] hover:bg-[#141517] text-[#8E9296] hover:text-[#D4A373] border border-[#26282A] transition-colors"
                    >
                      + {pop}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions (Pinned at bottom) */}
            <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-[#26282A] bg-[#0C0D0E] shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-subheading text-[#D1D5DB] hover:text-white border border-[#26282A] hover:bg-[#141517] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-black text-xs font-heading font-bold transition-all shadow-md shadow-[#D4A373]/20 cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
