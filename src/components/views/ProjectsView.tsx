import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  FolderGit2,
  Plus,
  Search,
  ExternalLink,
  Code2,
  Calendar,
} from 'lucide-react';
import { MemberProfile, UploadedProject } from '../../types';

interface ProjectsViewProps {
  profile: MemberProfile;
  onOpenUpload: () => void;
}

const CATEGORIES = ['All', 'Systems', 'AI / ML', 'Full Stack', 'Web3', 'Hardware'];

export function ProjectsView({ profile, onOpenUpload }: ProjectsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = useMemo(() => {
    return profile.uploadedProjects || [];
  }, [profile.uploadedProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchCat =
        selectedCategory === 'All' ||
        p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(selectedCategory.toLowerCase()));
      const matchQuery =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-6 shadow-xl">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">Member Projects</h1>
          <p className="font-subheading text-xs text-[#8E9296] mt-1">
            Showcasing engineering systems, open-source modules, and research prototypes.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenUpload}
          className="px-4 py-2.5 rounded-full bg-[#D4A373] hover:bg-[#c49363] text-black text-xs font-heading font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#D4A373]/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-subheading transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#D4A373] text-black font-bold shadow-md shadow-[#D4A373]/20'
                  : 'bg-[#0C0D0E] text-[#8E9296] hover:text-white border border-[#26282A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8E9296] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or stack..."
            className="w-full pl-9.5 pr-4 py-2 bg-[#0C0D0E] border border-[#26282A] focus:border-[#D4A373] rounded-full text-xs text-white placeholder-[#8E9296] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#141517] border border-[#26282A] flex items-center justify-center mx-auto text-[#8E9296]">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-white">No projects found</h3>
            <p className="font-subheading text-xs text-[#8E9296] mt-1 max-w-sm mx-auto">
              No repositories match your current filter criteria. Upload a project or clear your search.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenUpload}
            className="px-4 py-2 rounded-full bg-[#141517] hover:bg-[#1E2022] text-[#D4A373] border border-[#D4A373]/30 text-xs font-subheading inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Your First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0C0D0E] border border-[#26282A] hover:border-[#D4A373]/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#141517] text-[#D4A373] text-[10px] font-subheading border border-[#D4A373]/30">
                    {project.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#8E9296] font-mono-tech">
                    <Calendar className="w-3 h-3" />
                    <span>{project.uploadedAt}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-base font-bold text-white group-hover:text-[#D4A373] transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="font-subheading text-xs text-[#8E9296] mt-1.5 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-[#000000] text-[#D1D5DB] border border-[#26282A] text-[10px] font-mono-tech"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#26282A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5 text-[#8E9296]" />
                  <span className="text-[11px] text-[#8E9296] font-subheading">
                    By {profile.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-[#000000] hover:bg-[#141517] text-[#D4A373] border border-[#26282A] hover:border-[#D4A373]/50 transition-colors"
                      title="View GitHub Repository"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-[#000000] hover:bg-[#141517] text-white border border-[#26282A] hover:border-white/40 transition-colors"
                      title="Open Live Preview"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
