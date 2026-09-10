import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MemberProfile,
  SAMPLE_MEMBERS,
  RegistrationFormData,
  UploadedProject,
  MemberCertificate,
} from '../types';
import {
  ShieldCheck,
  Award,
  LogOut,
  UserPlus,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  Sparkles,
  UploadCloud,
  FolderGit2,
  Lock,
  KeyRound,
  Download,
  Eye,
  EyeOff,
  Plus,
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  Layers,
  Terminal,
  Cpu,
  Trash2,
} from 'lucide-react';
import { CertificateModal } from './CertificateModal';
import { UploadProjectModal } from './UploadProjectModal';
import { ChangePasswordModal } from './ChangePasswordModal';

interface MemberPortalProps {
  memberIdentifier?: string;
  registeredUser?: RegistrationFormData | null;
  onLogout: () => void;
  onNavigateToRegistration: () => void;
}

export function MemberPortal({
  memberIdentifier = '1MS22CS042',
  registeredUser,
  onLogout,
  onNavigateToRegistration,
}: MemberPortalProps) {
  // Resolve member profile based on identifier or newly registered user
  const resolveInitialProfile = (): MemberProfile => {
    if (registeredUser) {
      const cleanUsn = registeredUser.usn.replace(/[^a-zA-Z0-9]/g, '').slice(-5) || 'NEW';
      return {
        id: `ASC-2026-${cleanUsn}`,
        name: registeredUser.name,
        usn: registeredUser.usn,
        email: `${registeredUser.name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
        department: registeredUser.department,
        year: registeredUser.year,
        division:
          registeredUser.department.includes('AI') || registeredUser.department.includes('Data')
            ? 'Applied Machine Intelligence'
            : registeredUser.department.includes('Robotics')
            ? 'Autonomous Robotics Division'
            : 'Core Systems & Web Engineering',
        role: 'Appointed Technical Member',
        memberTier: 'Technical Member',
        joinDate: 'Sept 2026',
        badgeLevel: 'Bronze Reticle // Tier 2',
        skills: registeredUser.skills.length > 0 ? registeredUser.skills : ['Full-Stack Web', 'Python'],
        projects: [
          {
            id: 'p-new',
            name: 'Ascent Onboarding Systems Sprint',
            division: 'Engineering Sandbox',
            role: 'Division Member',
            status: 'In Development',
            techStack: registeredUser.skills.slice(0, 3),
            repoStatus: 'Private Org',
          },
        ],
        uploadedProjects: [],
        certificates: [
          {
            id: 'cert-init',
            title: 'Official Ascent Membership Certificate',
            issueDate: 'September 10, 2026',
            category: 'Membership',
            issuer: 'Ascent Executive Council & Faculty Board',
            verificationCode: `ASC-MEM-2026-${cleanUsn}`,
            description: 'Official credential verifying active student membership in Ascent Tech Club with authenticated intranet clearance.',
          },
        ],
        events: [
          {
            id: 'e1',
            title: 'Ascent 48h Winter HackSprint',
            date: 'Oct 24 - 26, 2026',
            time: '09:00 AM IST',
            location: 'Advanced Computing Lab 4',
            type: 'Hackathon',
            exclusivePass: true,
            rsvpStatus: 'Confirmed',
          },
        ],
        hardwarePass: {
          allocatedHours: 20,
          assignedLab: 'Lab 2 // Bench 12 (Ascent Maker Lab)',
          activeQuota: 'Standard Workstation Access',
        },
      };
    }

    // Lookup in SAMPLE_MEMBERS
    const foundKey = Object.keys(SAMPLE_MEMBERS).find(
      (k) =>
        k.toLowerCase() === memberIdentifier.toLowerCase() ||
        SAMPLE_MEMBERS[k].email.toLowerCase() === memberIdentifier.toLowerCase()
    );

    if (foundKey) {
      return SAMPLE_MEMBERS[foundKey];
    }

    // Default to Alex Rivera if not found, with dynamic name/usn matching input
    const base = SAMPLE_MEMBERS['1MS22CS042'];
    const cleanId = memberIdentifier.includes('@')
      ? memberIdentifier.split('@')[0]
      : memberIdentifier;
    return {
      ...base,
      name: cleanId.charAt(0).toUpperCase() + cleanId.slice(1).replace(/[^a-zA-Z0-9]/g, ' '),
      email: memberIdentifier.includes('@') ? memberIdentifier : `${cleanId.toLowerCase()}@college.edu`,
      usn: memberIdentifier.includes('@') ? '1MS22CS042' : memberIdentifier.toUpperCase(),
      id: `ASC-2026-${cleanId.toUpperCase().slice(-5) || 'MBR'}`,
    };
  };

  const [activeProfile, setActiveProfile] = useState<MemberProfile>(resolveInitialProfile());
  const [copiedId, setCopiedId] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'overview'>('projects');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<MemberCertificate | null>(null);

  // Certificate download toast
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);
  const [downloadSuccessCertId, setDownloadSuccessCertId] = useState<string | null>(null);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(activeProfile.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Add newly uploaded project to active profile state
  const handleUploadProject = (newProject: UploadedProject) => {
    setActiveProfile((prev) => ({
      ...prev,
      uploadedProjects: [newProject, ...(prev.uploadedProjects || [])],
    }));
  };

  // Remove an uploaded project from the member profile
  const handleDeleteProject = (projectId: string) => {
    setActiveProfile((prev) => ({
      ...prev,
      uploadedProjects: (prev.uploadedProjects || []).filter((p) => p.id !== projectId),
    }));
  };

  // Direct certificate download using HTML5 Canvas to PNG
  const triggerCertificateDownload = (cert: MemberCertificate) => {
    setDownloadingCertId(cert.id);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Background
        ctx.fillStyle = '#08090A';
        ctx.fillRect(0, 0, 1200, 850);

        // Golden Double Border
        ctx.strokeStyle = '#D4A373';
        ctx.lineWidth = 4;
        ctx.strokeRect(36, 36, 1128, 778);

        ctx.strokeStyle = '#3E3427';
        ctx.lineWidth = 1;
        ctx.strokeRect(46, 46, 1108, 758);

        // Header
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ASCENT TECH CLUB • EXCELLENCE IN ENGINEERING', 600, 110);

        // Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 38px "Space Grotesk", sans-serif';
        ctx.fillText(cert.title.toUpperCase(), 600, 180);

        // Gold divider
        ctx.strokeStyle = '#D4A373';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(450, 210);
        ctx.lineTo(750, 210);
        ctx.stroke();

        // Subtitle
        ctx.fillStyle = '#9CA3AF';
        ctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('This official credential is systematically issued and presented to', 600, 260);

        // Name
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 44px "Space Grotesk", sans-serif';
        ctx.fillText(activeProfile.name, 600, 325);

        // Member ID & USN
        ctx.fillStyle = '#E5E7EB';
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.fillText(`MEMBER ID: ${activeProfile.id}  •  USN: ${activeProfile.usn}`, 600, 365);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(`${activeProfile.department} (${activeProfile.year})`, 600, 400);

        // Description
        ctx.fillStyle = '#D1D5DB';
        ctx.font = '16px "Plus Jakarta Sans", sans-serif';
        const words = cert.description.split(' ');
        let line = '';
        let yPos = 465;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 850 && n > 0) {
            ctx.fillText(line, 600, yPos);
            line = words[n] + ' ';
            yPos += 28;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 600, yPos);

        // Security code
        ctx.fillStyle = '#6B7280';
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillText(`VERIFICATION CODE: ${cert.verificationCode}  |  STATUS: AUTHENTICATED`, 600, 595);
        ctx.fillText(`DATE OF ISSUE: ${cert.issueDate}  |  ISSUING BODY: ${cert.issuer}`, 600, 620);

        // Signatures
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(180, 715);
        ctx.lineTo(380, 715);
        ctx.moveTo(820, 715);
        ctx.lineTo(1020, 715);
        ctx.stroke();

        ctx.fillStyle = '#D4A373';
        ctx.font = 'italic 16px "Plus Jakarta Sans", cursive';
        ctx.fillText('Dr. S. K. Venkatesh', 280, 700);
        ctx.fillText('Rohit Sharma', 920, 700);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('FACULTY ADVISOR', 280, 735);
        ctx.fillText('CLUB PRESIDENT', 920, 735);

        // Seal
        ctx.strokeStyle = '#D4A373';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(600, 715, 36, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 9px "Space Grotesk", sans-serif';
        ctx.fillText('ASCENT VERIFIED', 600, 718);

        // Download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Ascent_${cert.verificationCode}_${activeProfile.name.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setDownloadSuccessCertId(cert.id);
        setTimeout(() => setDownloadSuccessCertId(null), 3000);
      }
    } catch (e) {
      console.error('Error generating certificate', e);
    } finally {
      setDownloadingCertId(null);
    }
  };

  const uploadedCount = activeProfile.uploadedProjects?.length || 0;
  const certCount = activeProfile.certificates?.length || 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#26282A]">
        <div>
          <span className="text-[10px] font-subheading text-[#8E9296] uppercase tracking-wider block">
            Ascent Intranet
          </span>
          <h2 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <span>Member Workspace</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#141517] text-[#D4A373] border border-[#D4A373]/30 font-mono-tech">
              {activeProfile.id}
            </span>
          </h2>
        </div>

        {/* Member Switcher & Global Navigation */}
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#0C0D0E] border border-[#26282A] rounded-full">
            <span className="text-[10px] font-subheading text-[#8E9296] pl-1">Switch:</span>
            <button
              type="button"
              onClick={() => setActiveProfile(SAMPLE_MEMBERS['1MS22CS042'])}
              className={`text-xs px-2.5 py-0.5 rounded-full font-subheading transition-all ${
                activeProfile.usn === '1MS22CS042'
                  ? 'bg-[#D4A373] text-[#000000] font-bold'
                  : 'text-[#D1D5DB] hover:text-white'
              }`}
            >
              Alex (Lead)
            </button>
            <button
              type="button"
              onClick={() => setActiveProfile(SAMPLE_MEMBERS['1MS23AI018'])}
              className={`text-xs px-2.5 py-0.5 rounded-full font-subheading transition-all ${
                activeProfile.usn === '1MS23AI018'
                  ? 'bg-[#D4A373] text-[#000000] font-bold'
                  : 'text-[#D1D5DB] hover:text-white'
              }`}
            >
              Kavya (Robotics)
            </button>
          </div>

          <button
            type="button"
            onClick={onNavigateToRegistration}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0C0D0E] hover:bg-[#141517] text-[#D1D5DB] hover:text-[#D4A373] border border-[#26282A] text-xs font-subheading transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Register New Member</span>
            <span className="sm:hidden">Register</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0C0D0E] hover:bg-[#141517] text-[#D4A373] hover:text-[#e4b585] border border-[#D4A373]/40 text-xs font-subheading font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Member Identity & Actions (Left) + Primary Interactive Modules (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Member Card, Member ID & Quick Security */}
        <div className="lg:col-span-4 space-y-6">
          {/* Smart Member Identity Card */}
          <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-6 relative overflow-hidden shadow-2xl group hover:border-[#D4A373]/50 transition-all duration-300">
            {/* Top Accent Gold Bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent opacity-90" />
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4A373]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Member Identity Details: Name and ID */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#000000] border border-[#3D4042] flex items-center justify-center text-xl font-heading font-extrabold text-[#D4A373] shadow-inner shrink-0">
                  {activeProfile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="font-heading text-xl font-extrabold text-white tracking-tight leading-snug">
                    {activeProfile.name}
                  </h2>
                  <p className="font-subheading text-xs text-[#D4A373] font-medium">
                    {activeProfile.role}
                  </p>
                  <span className="text-[11px] font-mono-tech text-[#8E9296]">
                    {activeProfile.usn}
                  </span>
                </div>
              </div>

              {/* Specs Matrix */}
              <div className="bg-[#000000] rounded-2xl p-4 border border-[#26282A] space-y-2.5 text-xs font-subheading">
                {/* MEMBER ID FEATURED */}
                <div className="flex items-center justify-between py-1 px-2 rounded-xl bg-[#141517] border border-[#D4A373]/30">
                  <span className="text-[#D4A373] font-semibold text-[11px]">MEMBER ID:</span>
                  <div className="flex items-center gap-1.5">
                    <code className="text-white font-mono-tech font-bold text-xs tracking-wider">
                      {activeProfile.id}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="text-[#8E9296] hover:text-[#D4A373] p-1 rounded transition-colors"
                      title="Copy Member ID"
                      aria-label="Copy Member ID"
                    >
                      {copiedId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8E9296]">Student USN:</span>
                  <span className="text-white font-mono-tech font-medium">{activeProfile.usn}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8E9296]">Department:</span>
                  <span className="text-[#D1D5DB] truncate max-w-[180px]">
                    {activeProfile.department}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8E9296]">Academic Year:</span>
                  <span className="text-[#D1D5DB]">{activeProfile.year}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8E9296]">Division:</span>
                  <span className="text-white font-medium truncate max-w-[180px]">
                    {activeProfile.division}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8E9296]">Clearance Tier:</span>
                  <span className="text-[#D4A373] font-medium">{activeProfile.memberTier}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Member Security & Password Quick Action Card */}
          <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#D4A373]" />
                <h3 className="font-heading text-sm font-bold text-white">Security & Access</h3>
              </div>
            </div>

            <p className="text-xs font-subheading text-[#8E9296] leading-relaxed">
              Manage your intranet passcode and account security credentials.
            </p>

            <div className="pt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#141517] hover:bg-[#1E2022] text-[#D4A373] hover:text-[#e4b585] border border-[#D4A373]/40 text-xs font-subheading font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#000000] hover:bg-[#141517] text-white border border-[#26282A] text-xs font-subheading font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Upload New Project</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Summary Card */}
          <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-5 shadow-xl">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#000000] rounded-2xl border border-[#26282A] text-center">
                <span className="text-[10px] font-subheading text-[#8E9296] uppercase block">
                  Uploaded Projects
                </span>
                <span className="text-xl font-heading font-bold text-white mt-1 block">
                  {uploadedCount}
                </span>
              </div>
              <div className="p-3 bg-[#000000] rounded-2xl border border-[#26282A] text-center">
                <span className="text-[10px] font-subheading text-[#8E9296] uppercase block">
                  Certificates
                </span>
                <span className="text-xl font-heading font-bold text-[#D4A373] mt-1 block">
                  {certCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Primary Dedicated Workspaces */}
        <div className="lg:col-span-8 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent opacity-80" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#D4A373]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-12 h-1 bg-[#D4A373] rounded-full mb-3.5 shadow-sm shadow-[#D4A373]/30" />

            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome, <span className="text-[#D4A373]">{activeProfile.name}</span>
            </h1>

            <p className="font-subheading text-sm text-[#A3A3A3] mt-2 max-w-xl leading-relaxed">
              Access your uploaded club projects, download your official authenticated certificates,
              and manage your profile credentials.
            </p>

            {/* Primary Interactive Tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#26282A]">
              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded-full text-xs font-subheading font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-[#D4A373] text-[#000000] font-bold shadow-md shadow-[#D4A373]/20'
                    : 'bg-[#000000] text-[#8E9296] hover:text-white border border-[#26282A]'
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Uploaded Projects</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#000000]/20 font-bold">
                  {uploadedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('certificates')}
                className={`px-4 py-2 rounded-full text-xs font-subheading font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'certificates'
                    ? 'bg-[#D4A373] text-[#000000] font-bold shadow-md shadow-[#D4A373]/20'
                    : 'bg-[#000000] text-[#8E9296] hover:text-white border border-[#26282A]'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Download Certificates</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#000000]/20 font-bold">
                  {certCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-full text-xs font-subheading font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#D4A373] text-[#000000] font-bold shadow-md shadow-[#D4A373]/20'
                    : 'bg-[#000000] text-[#8E9296] hover:text-white border border-[#26282A]'
                }`}
              >
                <span>Profile & Skills</span>
              </button>
            </div>
          </div>

          {/* TAB 1: UPLOADED PROJECTS */}
          {activeTab === 'projects' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Header with Upload Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0C0D0E] border border-[#26282A] rounded-2xl">
                <div>
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-[#D4A373]" />
                    <span>Projects Uploaded by {activeProfile.name}</span>
                  </h3>
                  <p className="text-xs font-subheading text-[#8E9296]">
                    Repositories, research codebases, and production demos deployed by this member.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-black font-heading font-bold text-xs shadow-md shadow-[#D4A373]/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload New Project</span>
                </button>
              </div>

              {/* Projects List */}
              {uploadedCount === 0 ? (
                <div className="p-8 bg-[#0C0D0E] border border-[#26282A] rounded-3xl text-center space-y-3">
                  <FolderGit2 className="w-10 h-10 text-[#545454] mx-auto" />
                  <h4 className="font-heading text-sm font-bold text-white">
                    No Projects Uploaded Yet
                  </h4>
                  <p className="text-xs font-subheading text-[#8E9296] max-w-sm mx-auto">
                    Publish your first engineering codebase, prototype, or research repo to the Ascent Intranet.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#141517] hover:bg-[#1E2022] text-[#D4A373] border border-[#D4A373]/40 text-xs font-subheading font-medium inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Project Now</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeProfile.uploadedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-6 relative overflow-hidden shadow-xl hover:border-[#D4A373]/40 transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="font-heading text-lg font-bold text-white">
                              {proj.title}
                            </h3>
                            {proj.version && (
                              <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded-full bg-[#141517] text-[#8E9296] border border-[#26282A]">
                                {proj.version}
                              </span>
                            )}
                            <span
                              className={`text-xs font-subheading px-2.5 py-0.5 rounded-full border ${
                                proj.status === 'Featured'
                                  ? 'bg-[#141517] text-[#D4A373] border-[#D4A373]/40 font-semibold'
                                  : proj.status === 'Approved'
                                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-950/30 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {proj.status}
                            </span>
                          </div>

                          <p className="font-subheading text-xs text-[#8E9296] mt-1 flex items-center gap-2">
                            <span>Category: <strong className="text-white">{proj.category}</strong></span>
                            <span>•</span>
                            <span>Uploaded: <span className="text-[#D1D5DB]">{proj.uploadedAt}</span></span>
                          </p>
                        </div>
                      </div>

                      <p className="font-subheading text-xs text-[#A3A3A3] mb-4 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#26282A]">
                        {/* Tech Stack Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-subheading text-[#717579]">Stack:</span>
                          {proj.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs font-mono-tech px-2.5 py-0.5 rounded-md bg-[#000000] text-[#D1D5DB] border border-[#26282A]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* External Links & Actions */}
                        <div className="flex items-center gap-3">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-xs font-subheading text-[#D1D5DB] hover:text-[#D4A373] flex items-center gap-1 transition-colors"
                            >
                              <FolderGit2 className="w-3.5 h-3.5" />
                              <span>GitHub</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {proj.demoUrl && (
                            <a
                              href={proj.demoUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="text-xs font-subheading text-[#D4A373] hover:text-[#e4b585] flex items-center gap-1 transition-colors font-medium"
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 text-[#8E9296] hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                            title="Remove uploaded project"
                            aria-label="Remove uploaded project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: CERTIFICATES (HE CAN DOWNLOAD) */}
          {activeTab === 'certificates' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="p-4 bg-[#0C0D0E] border border-[#26282A] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#D4A373]" />
                    <span>Downloadable Member Certificates</span>
                  </h3>
                  <p className="text-xs font-subheading text-[#8E9296]">
                    Authentic digital credentials issued to {activeProfile.name} (Member ID: {activeProfile.id}).
                  </p>
                </div>
                <span className="text-xs font-subheading text-[#D4A373] bg-[#141517] border border-[#D4A373]/30 px-3 py-1 rounded-full self-start sm:self-auto font-mono-tech">
                  {certCount} Verified Credentials
                </span>
              </div>

              {/* Certificates List */}
              {certCount === 0 ? (
                <div className="p-8 bg-[#0C0D0E] border border-[#26282A] rounded-3xl text-center space-y-2">
                  <Award className="w-10 h-10 text-[#545454] mx-auto" />
                  <h4 className="font-heading text-sm font-bold text-white">
                    No Certificates Issued Yet
                  </h4>
                  <p className="text-xs font-subheading text-[#8E9296]">
                    Certificates will automatically appear here upon completing club hackathons, sprints, or annual membership milestones.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeProfile.certificates.map((cert) => {
                    const isDownloading = downloadingCertId === cert.id;
                    const isSuccess = downloadSuccessCertId === cert.id;

                    return (
                      <div
                        key={cert.id}
                        className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-6 relative overflow-hidden shadow-xl hover:border-[#D4A373]/40 transition-all duration-200 group"
                      >
                        {/* Gold accent line */}
                        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4A373] to-transparent opacity-60" />

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-subheading px-2.5 py-0.5 rounded-full bg-[#141517] text-[#D4A373] border border-[#D4A373]/30">
                                {cert.category}
                              </span>
                              <span className="text-[11px] font-mono-tech text-[#8E9296]">
                                ID: {cert.verificationCode}
                              </span>
                            </div>

                            <h3 className="font-heading text-lg font-bold text-white pt-1">
                              {cert.title}
                            </h3>

                            <p className="font-subheading text-xs text-[#8E9296]">
                              Issued by <strong className="text-[#D1D5DB]">{cert.issuer}</strong> on{' '}
                              <span className="text-white font-medium">{cert.issueDate}</span>
                            </p>
                          </div>

                          {/* Action Buttons: Download & Preview */}
                          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedCertForPreview(cert)}
                              className="px-3 py-1.5 rounded-xl bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] hover:text-white border border-[#26282A] text-xs font-subheading transition-colors cursor-pointer"
                              title="Preview certificate"
                            >
                              <span>Preview</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => triggerCertificateDownload(cert)}
                              disabled={isDownloading}
                              className="px-4 py-1.5 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-black font-heading font-bold text-xs shadow-md shadow-[#D4A373]/20 flex items-center gap-1.5 transition-all cursor-pointer"
                              title="Download official certificate"
                            >
                              {isSuccess ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
                                  <span>Downloaded</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5" />
                                  <span>{isDownloading ? 'Generating...' : 'Download Certificate'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <p className="font-subheading text-xs text-[#A3A3A3] mb-4 leading-relaxed">
                          {cert.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-[#26282A] text-[11px] font-subheading text-[#717579]">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
                            <span>Digital Signature & Public Cryptographic Verification Valid</span>
                          </span>
                          <span className="font-mono-tech text-[#8E9296]">
                            ISSUED TO: {activeProfile.usn}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: PROFILE & SKILLS OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Verified Technical Skills Matrix */}
              <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#D4A373]" />
                    <h3 className="font-heading text-base font-bold text-white">
                      Verified Technical Skills Matrix
                    </h3>
                  </div>
                  <span className="text-xs font-subheading text-[#8E9296]">
                    Member: {activeProfile.id}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {activeProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3.5 py-1.5 rounded-full bg-[#000000] border border-[#D4A373]/40 text-xs font-subheading text-white flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Hardware & Cloud Quota */}
              <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-[#D4A373]" />
                  <h3 className="font-heading text-base font-bold text-white">
                    Assigned Lab & Cloud Quota
                  </h3>
                </div>
                <div className="space-y-3 font-subheading text-xs">
                  <div>
                    <div className="flex justify-between text-[#8E9296] mb-1">
                      <span>GPU Cluster Compute:</span>
                      <span className="text-[#D4A373] font-semibold">
                        {activeProfile.hardwarePass.allocatedHours} hrs remaining
                      </span>
                    </div>
                    <div className="w-full bg-[#000000] rounded-full h-1.5 overflow-hidden border border-[#26282A]">
                      <div
                        className="bg-[#D4A373] h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (activeProfile.hardwarePass.allocatedHours / 80) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#000000] rounded-xl border border-[#26282A]">
                    <span className="text-[10px] text-[#717579] uppercase block">
                      Assigned Workstation
                    </span>
                    <span className="text-white font-medium text-xs block mt-0.5">
                      {activeProfile.hardwarePass.assignedLab}
                    </span>
                    <span className="text-[#D4A373] text-[11px] block mt-1 font-mono-tech">
                      {activeProfile.hardwarePass.activeQuota}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <UploadProjectModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadProject}
        memberDivision={activeProfile.division}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        memberName={activeProfile.name}
      />

      <CertificateModal
        certificate={selectedCertForPreview}
        member={activeProfile}
        onClose={() => setSelectedCertForPreview(null)}
      />
    </div>
  );
}
