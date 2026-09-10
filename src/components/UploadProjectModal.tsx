import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadedProject } from '../types';
import { X, UploadCloud, FolderGit2, Plus, AlertCircle, CheckCircle2, Link2 } from 'lucide-react';

interface UploadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (project: UploadedProject) => void;
  memberDivision: string;
}

const CATEGORIES = [
  'Systems & AI Architecture',
  'Autonomous Robotics & Vision',
  'Full-Stack Web & Cloud',
  'Cybersecurity & Networks',
  'Embedded & Hardware IoT',
  'Graphics & Compute',
];

export function UploadProjectModal({
  isOpen,
  onClose,
  onUpload,
  memberDivision,
}: UploadProjectModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>(['TypeScript', 'React']);
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = techStackInput.trim();
    if (!trimmed) return;
    if (!techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
    }
    setTechStackInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTechStack(techStack.filter((t) => t !== tag));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Project title is required');
      return;
    }
    if (!description.trim() || description.trim().length < 15) {
      setError('Please provide a descriptive summary (at least 15 characters)');
      return;
    }
    if (techStack.length === 0) {
      setError('Please add at least one tech stack tool');
      return;
    }

    const newProject: UploadedProject = {
      id: `up-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      techStack,
      category,
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      uploadedAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Under Review',
      version: version.trim() || 'v1.0.0',
    };

    onUpload(newProject);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#26282A] bg-[#000000]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#141517] border border-[#D4A373]/50 flex items-center justify-center text-[#D4A373]">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading text-sm font-bold text-white">Upload Member Project</h3>
                <span className="text-[11px] font-subheading text-[#8E9296]">
                  Publish your codebase to the Ascent registry
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 font-subheading text-xs">
            {error && (
              <div className="p-3 bg-red-950/30 border border-red-500/50 rounded-xl text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Title & Version */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                  Project Name <span className="text-[#D4A373]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. Autonomous Edge Drone Pipeline"
                  className="w-full px-3 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                  Release Version
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v1.0.0"
                  className="w-full px-3 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm font-mono-tech focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                Domain / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4A373] cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0C0D0E] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                Technical Summary <span className="text-[#D4A373]">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setError('');
                }}
                placeholder="Explain the problem solved, architecture patterns used, and performance highlights..."
                className="w-full px-3 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-sm focus:outline-none focus:border-[#D4A373] resize-none"
              />
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-1.5">
              <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px]">
                Tech Stack & Libraries <span className="text-[#D4A373]">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="e.g. PyTorch, CUDA, FastAPI, Docker"
                  className="flex-1 px-3 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-xs focus:outline-none focus:border-[#D4A373]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 bg-[#141517] hover:bg-[#1E2022] text-[#D4A373] border border-[#D4A373]/40 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#141517] border border-[#26282A] text-[11px] text-[#D1D5DB]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#8E9296] hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <FolderGit2 className="w-3 h-3 text-[#8E9296]" />
                  <span>GitHub Repository URL</span>
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-xs focus:outline-none focus:border-[#D4A373]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[#D1D5DB] uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-[#8E9296]" />
                  <span>Live Demo / Artifact URL</span>
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://demo.domain.com"
                  className="w-full px-3 py-2 bg-[#000000] border border-[#26282A] rounded-xl text-white text-xs focus:outline-none focus:border-[#D4A373]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#26282A] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] border border-[#26282A] text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-black font-heading font-bold text-xs shadow-md shadow-[#D4A373]/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Project</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
