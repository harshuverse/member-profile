import { useState, useMemo, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MemberProfile,
  SAMPLE_MEMBERS,
  RegistrationFormData,
  UploadedProject,
  MemberCertificate,
  MemberPost,
} from '../types';
import {
  Home,
  User,
  MessageSquare,
  FolderGit2,
  Award,
  Settings,
  Search,
  LogOut,
  UserPlus,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Camera,
  Edit3,
  MapPin,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  KeyRound,
  UploadCloud,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Download,
  Terminal,
  MoreHorizontal,
  UserCheck,
  Bell,
  Code2,
} from 'lucide-react';
import { CertificateModal } from './CertificateModal';
import { UploadProjectModal } from './UploadProjectModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { EditProfileModal } from './EditProfileModal';
import { EditCoverModal, COVER_PRESETS } from './EditCoverModal';
import { HomeView } from './views/HomeView';
import { ProjectsView } from './views/ProjectsView';
import { CertificatesView } from './views/CertificatesView';
import { SettingsView } from './views/SettingsView';

interface MemberPortalProps {
  memberIdentifier?: string;
  registeredUser?: RegistrationFormData | null;
  onLogout: () => void;
  onNavigateToRegistration: () => void;
}

// Initial sample activity posts matching the feed in the reference image
const INITIAL_POSTS: MemberPost[] = [
  {
    id: 'post-1',
    authorName: 'Alex Rivera',
    authorRole: 'Lead Systems Architect',
    timeAgo: '15 mins ago',
    content:
      'Sub-5ms edge LiDAR point cloud odometry pipeline finalized on Jetson Orin! Integrated with ROS2 for real-time 3D spatial mapping and autonomous rover obstacle avoidance. Check out the benchmark telemetry below.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    techStack: ['ROS2', 'CUDA', 'C++', 'PyTorch', 'TensorRT'],
    githubUrl: 'https://github.com/ascent-club/lidar-odometry',
    demoUrl: 'https://rover-telemetry.ascent.internal',
    likesCount: 1498,
    viewsCount: 3000,
    commentsCount: 84,
    isLiked: false,
  },
  {
    id: 'post-2',
    authorName: 'Alex Rivera',
    authorRole: 'Lead Systems Architect',
    timeAgo: 'Yesterday at 4:30 PM',
    content:
      'Officially published the Ascent Intranet Core UI/UX design system specifications. Pairing Inter display typography with Century Gothic sub-elements and deep copper obsidian gradients.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Figma'],
    githubUrl: 'https://github.com/ascent-club/ascent-core-ui',
    likesCount: 842,
    viewsCount: 1950,
    commentsCount: 36,
    isLiked: true,
  },
];

// "You might know" peers matching the screenshot
const PEER_SUGGESTIONS = [
  {
    id: 'peer-1',
    name: 'Eddie Lemonsky',
    role: 'Autonomous Robotics',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    department: 'Robotics & Automation',
  },
  {
    id: 'peer-2',
    name: 'Alexy Spev',
    role: 'ML Research Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    department: 'AI & Data Science',
  },
  {
    id: 'peer-3',
    name: 'Anton Nichevo',
    role: 'Firmware Engineer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    department: 'Electronics & Comm.',
  },
];

// "Active" peers matching the screenshot
const ACTIVE_PEERS = [
  {
    id: 'act-1',
    name: 'Shelby Goode',
    status: 'Online',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'act-2',
    name: 'Robert Bains',
    status: 'Busy in Lab 4',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'act-3',
    name: 'John Carlo',
    status: 'Online',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'act-4',
    name: 'Adriana Watson',
    status: 'In HackSprint',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
  },
];

export function MemberPortal({
  memberIdentifier = '1MS22CS042',
  registeredUser,
  onLogout,
  onNavigateToRegistration,
}: MemberPortalProps) {
  // Resolve initial member profile
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
        bio: registeredUser.reasonToJoin || 'Newly registered technical member exploring Ascent engineering divisions and collaborative projects.',
        gender: 'Technical Member',
        location: 'Main Engineering Campus, Bangalore',
        phone: registeredUser.contactNumber || '+91 98450 00000',
        birthDate: 'June 28, 2004',
        followersCount: 120,
        followingCount: 84,
        coverStyle: 'circuit',
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
            description:
              'Official credential verifying active student membership in Ascent Tech Club with authenticated intranet clearance.',
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

    const foundKey = Object.keys(SAMPLE_MEMBERS).find(
      (k) =>
        k.toLowerCase() === memberIdentifier.toLowerCase() ||
        SAMPLE_MEMBERS[k].email.toLowerCase() === memberIdentifier.toLowerCase()
    );

    if (foundKey) {
      return SAMPLE_MEMBERS[foundKey];
    }

    const base = SAMPLE_MEMBERS['1MS22CS042'];
    const cleanId = memberIdentifier.includes('@') ? memberIdentifier.split('@')[0] : memberIdentifier;
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
  const [activeNav, setActiveNav] = useState<'home' | 'profile' | 'messages' | 'projects' | 'certificates' | 'gallery' | 'settings'>('profile');
  const [activeTab, setActiveTab] = useState<'followers' | 'following' | 'posts' | 'projects' | 'certificates'>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [posts, setPosts] = useState<MemberPost[]>(INITIAL_POSTS);
  const [connectedPeers, setConnectedPeers] = useState<Record<string, boolean>>({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // New post composer
  const [composerText, setComposerText] = useState('');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditCoverOpen, setIsEditCoverOpen] = useState(false);
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<MemberCertificate | null>(null);

  // Certificate download toast
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);
  const [downloadSuccessCertId, setDownloadSuccessCertId] = useState<string | null>(null);

  const handleCopyId = () => {
    navigator.clipboard?.writeText(activeProfile.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Upload Project Handler
  const handleUploadProject = (newProject: UploadedProject) => {
    setActiveProfile((prev) => ({
      ...prev,
      uploadedProjects: [newProject, ...(prev.uploadedProjects || [])],
    }));
    // Also inject into posts feed so it appears immediately!
    const postFromProject: MemberPost = {
      id: `post-proj-${newProject.id}`,
      authorName: activeProfile.name,
      authorRole: activeProfile.role,
      timeAgo: 'Just now',
      content: `Uploaded new ${newProject.category} project: "${newProject.title}". ${newProject.description}`,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      techStack: newProject.techStack,
      githubUrl: newProject.githubUrl,
      demoUrl: newProject.demoUrl,
      likesCount: 1,
      viewsCount: 1,
      commentsCount: 0,
      isLiked: true,
    };
    setPosts((prev) => [postFromProject, ...prev]);
  };

  // Delete Project Handler
  const handleDeleteProject = (projectId: string) => {
    setActiveProfile((prev) => ({
      ...prev,
      uploadedProjects: (prev.uploadedProjects || []).filter((p) => p.id !== projectId),
    }));
  };

  // Update Profile
  const handleSaveProfile = (updatedData: Partial<MemberProfile>) => {
    setActiveProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  // Change Cover Style
  const handleSelectCover = (coverStyle: string) => {
    setActiveProfile((prev) => ({
      ...prev,
      coverStyle,
    }));
  };

  // Toggle Like on Post
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );
  };

  // Toggle Connect on Peer
  const handleToggleConnect = (peerId: string) => {
    setConnectedPeers((prev) => ({
      ...prev,
      [peerId]: !prev[peerId],
    }));
  };

  // Handle composer submission
  const handlePublishPost = (e: FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    const newPost: MemberPost = {
      id: `post-${Date.now()}`,
      authorName: activeProfile.name,
      authorRole: activeProfile.role,
      timeAgo: 'Just now',
      content: composerText.trim(),
      likesCount: 0,
      viewsCount: 1,
      commentsCount: 0,
      isLiked: false,
    };

    setPosts([newPost, ...posts]);
    setComposerText('');
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

        // Corner ornaments
        const drawCorner = (x: number, y: number) => {
          ctx.strokeStyle = '#D4A373';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - 20, y);
          ctx.lineTo(x, y);
          ctx.lineTo(x, y - 20);
          ctx.stroke();
        };
        drawCorner(60, 60);
        drawCorner(1140, 60);
        drawCorner(60, 790);
        drawCorner(1140, 790);

        // Header
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 22px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ASCENT TECHNICAL SOCIETY', 600, 130);

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '14px "Century Gothic", sans-serif';
        ctx.fillText('Autonomous Systems & Applied Intelligence Council', 600, 160);

        // Title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 36px "Inter", sans-serif';
        ctx.fillText(cert.title.toUpperCase(), 600, 240);

        // Category Tag
        ctx.fillStyle = '#D4A373';
        ctx.font = '14px "Inter", sans-serif';
        ctx.fillText(`CATEGORY: ${cert.category.toUpperCase()}`, 600, 280);

        // Recipient line
        ctx.fillStyle = '#D1D5DB';
        ctx.font = '18px "Century Gothic", sans-serif';
        ctx.fillText('This official credential is systematically conferred upon', 600, 340);

        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 38px "Inter", sans-serif';
        ctx.fillText(activeProfile.name, 600, 400);

        // USN & ID
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '16px "JetBrains Mono", monospace';
        ctx.fillText(`STUDENT USN: ${activeProfile.usn}   |   MEMBER ID: ${activeProfile.id}`, 600, 440);

        // Description
        ctx.fillStyle = '#E5E7EB';
        ctx.font = '15px "Century Gothic", sans-serif';
        const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
          const words = text.split(' ');
          let line = '';
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
              ctx.fillText(line, x, y);
              line = words[n] + ' ';
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line, x, y);
        };
        wrapText(cert.description, 600, 500, 860, 26);

        // Verification Line
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillText(`VERIFICATION CODE: ${cert.verificationCode}   |   ISSUED: ${cert.issueDate}`, 600, 610);

        // Signature lines
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(180, 710);
        ctx.lineTo(380, 710);
        ctx.moveTo(820, 710);
        ctx.lineTo(1020, 710);
        ctx.stroke();

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px "Inter", sans-serif';
        ctx.fillText('FACULTY ADVISOR', 280, 735);
        ctx.fillText('CLUB PRESIDENT', 920, 735);

        // Seal
        ctx.strokeStyle = '#D4A373';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(600, 715, 36, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = '#D4A373';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
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
  const followersCount = activeProfile.followersCount || 1498;
  const followingCount = activeProfile.followingCount || 320;

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.content.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.techStack?.some((t) => t.toLowerCase().includes(q))
    );
  }, [posts, searchQuery]);

  // Current cover preset object
  const currentCover =
    COVER_PRESETS.find((c) => c.id === (activeProfile.coverStyle || 'circuit')) || COVER_PRESETS[0];

  return (
    <div className="min-h-screen bg-[#000000] text-[#F3F4F6] flex">
      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR (Directly inspired by the reference image's dark sidebar) */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0C0D0E] border-r border-[#26282A] min-h-screen shrink-0 sticky top-0 z-30 justify-between">
        <div>
          {/* Navigation Links */}
          <nav className="p-4 pt-6 space-y-1.5 font-subheading text-xs">
            <button
              type="button"
              onClick={() => setActiveNav('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                activeNav === 'home'
                  ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/40 shadow-sm'
                  : 'text-[#8E9296] hover:text-white hover:bg-[#141517]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                activeNav === 'profile'
                  ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/40 shadow-sm'
                  : 'text-[#8E9296] hover:text-white hover:bg-[#141517]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#D4A373]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                activeNav === 'projects'
                  ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/40 shadow-sm'
                  : 'text-[#8E9296] hover:text-white hover:bg-[#141517]'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Projects</span>
              {uploadedCount > 0 && (
                <span className="ml-auto px-2 py-0.5 rounded-full bg-[#1E2022] text-[#D4A373] text-[10px] border border-[#26282A]">
                  {uploadedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('certificates')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                activeNav === 'certificates'
                  ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/40 shadow-sm'
                  : 'text-[#8E9296] hover:text-white hover:bg-[#141517]'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificates</span>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-[#1E2022] text-[#D4A373] text-[10px] border border-[#26282A]">
                {certCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveNav('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all cursor-pointer ${
                activeNav === 'settings'
                  ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/40 shadow-sm'
                  : 'text-[#8E9296] hover:text-white hover:bg-[#141517]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#26282A] space-y-2">
          <button
            type="button"
            onClick={onNavigateToRegistration}
            className="w-full py-2 px-3 rounded-xl bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] hover:text-[#D4A373] border border-[#26282A] text-xs font-subheading flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New Member</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl bg-[#000000] hover:bg-[#141517] text-[#D4A373] border border-[#D4A373]/30 text-xs font-subheading flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE CONTAINER                                              */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden px-4 py-3 bg-[#0C0D0E] border-b border-[#26282A] flex items-center sticky top-0 z-20">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-[#8E9296] hover:text-white p-1.5 rounded-xl border border-[#26282A]"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Slide-Out Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="w-72 bg-[#0C0D0E] border-r border-[#26282A] h-full p-5 flex flex-col justify-between"
                onClick={(e) => e.stopPropagation()}
              >
                <div>
                  <div className="flex items-center justify-end pb-4 border-b border-[#26282A] mb-4">
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[#8E9296] hover:text-white p-1 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1 font-subheading text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('home');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        activeNav === 'home'
                          ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/30'
                          : 'text-[#8E9296] hover:text-white'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                      <span>Home</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('profile');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        activeNav === 'profile'
                          ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/30'
                          : 'text-[#8E9296] hover:text-white'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('projects');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        activeNav === 'projects'
                          ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/30'
                          : 'text-[#8E9296] hover:text-white'
                      }`}
                    >
                      <FolderGit2 className="w-4 h-4" />
                      <span>Projects ({uploadedCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('certificates');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        activeNav === 'certificates'
                          ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/30'
                          : 'text-[#8E9296] hover:text-white'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                      <span>Certificates ({certCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveNav('settings');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        activeNav === 'settings'
                          ? 'bg-[#141517] text-[#D4A373] font-bold border border-[#D4A373]/30'
                          : 'text-[#8E9296] hover:text-white'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#26282A] space-y-2">
                  <button
                    type="button"
                    onClick={onNavigateToRegistration}
                    className="w-full py-2 px-3 rounded-xl bg-[#000000] text-[#D1D5DB] border border-[#26282A] text-xs font-subheading flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register New Member</span>
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full py-2 px-3 rounded-xl bg-[#000000] text-[#D4A373] border border-[#D4A373]/30 text-xs font-subheading flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeNav === 'home' && (
            <HomeView
              profile={activeProfile}
              posts={filteredPosts}
              onNavigate={(view) => setActiveNav(view)}
              onOpenUpload={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeNav === 'projects' && (
            <ProjectsView
              profile={activeProfile}
              onOpenUpload={() => setIsUploadModalOpen(true)}
            />
          )}

          {activeNav === 'certificates' && (
            <CertificatesView
              profile={activeProfile}
              onPreviewCertificate={(cert) => setSelectedCertForPreview(cert)}
            />
          )}

          {activeNav === 'settings' && (
            <SettingsView
              profile={activeProfile}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onOpenChangePassword={() => setIsPasswordModalOpen(true)}
              onLogout={onLogout}
            />
          )}

          {activeNav === 'profile' && (
            <>
              {/* ===================================================================== */}
              {/* 3. HERO COVER BANNER & PROFILE HEADER                                 */}
              {/*    (Directly mirrors the panoramic cover & overlapping circular badge) */}
              {/* ===================================================================== */}
          <div className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl overflow-hidden shadow-2xl relative">
            {/* Panoramic Cover Banner */}
            <div
              className={`h-28 sm:h-36 w-full relative overflow-hidden bg-gradient-to-r ${currentCover.gradientClass} transition-all duration-300`}
              style={{
                backgroundImage: `${currentCover.accentGlow}, ${currentCover.bgPattern}`,
                backgroundSize: `auto, ${currentCover.bgSize}`,
              }}
            >
              {/* Subtle tech gridlines overlay */}
              <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

              {/* Edit Cover Photo button (top right of banner - matching screenshot) */}
              <button
                type="button"
                onClick={() => setIsEditCoverOpen(true)}
                className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md border border-[#26282A] text-white text-[11px] font-subheading flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              >
                <Camera className="w-3 h-3 text-[#D4A373]" />
                <span className="font-medium">Edit Cover Photo</span>
              </button>
            </div>

            {/* Profile Identity Bar: Overlapping Avatar, Name & Action Buttons */}
            <div className="px-5 pb-4 pt-0 relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                {/* Left: Avatar (Overlapping) & User Headline */}
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-10 sm:-mt-12">
                  {/* Circular Avatar with warm gold border ring (as seen in screenshot) */}
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#000000] border-3 sm:border-4 border-[#0C0D0E] ring-2 ring-[#D4A373] shadow-xl flex items-center justify-center text-xl sm:text-2xl font-heading font-extrabold text-[#D4A373] overflow-hidden">
                      {activeProfile.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                  </div>

                  {/* Name & Title */}
                  <div className="text-center sm:text-left mb-0.5">
                    <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                      {activeProfile.name}
                    </h1>
                    <p className="font-subheading text-xs sm:text-sm text-[#D4A373] font-medium">
                      {activeProfile.role}
                    </p>
                  </div>
                </div>

                {/* Right: Actions (Edit Profile, Follow, Message - matching screenshot) */}
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 pt-1 sm:pt-0">
                  {/* Edit Profile Button (matching screenshot pill) */}
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#000000] hover:bg-[#141517] text-white border border-[#26282A] hover:border-[#D4A373]/50 text-xs font-subheading font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Edit Profile</span>
                  </button>

                  {/* Follow / Connect Button */}
                  <button
                    type="button"
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-[#141517] text-[#D4A373] border border-[#D4A373]/40'
                        : 'bg-[#D4A373] hover:bg-[#c49363] text-black shadow-md shadow-[#D4A373]/20'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  {/* Message Button */}
                  <button
                    type="button"
                    onClick={() => alert(`Direct message channel opened with ${activeProfile.name}`)}
                    className="p-1.5 rounded-full bg-[#000000] hover:bg-[#141517] text-[#D4A373] border border-[#26282A] hover:border-[#D4A373]/40 transition-colors cursor-pointer"
                    title="Send Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {/* Schedule Meeting / Book Workstation Button */}
                  <button
                    type="button"
                    onClick={() => alert(`Workstation reservation requested for ${activeProfile.hardwarePass.assignedLab}`)}
                    className="px-3 py-1.5 rounded-full bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] hover:text-white border border-[#26282A] text-xs font-subheading transition-colors cursor-pointer hidden xl:inline-flex"
                  >
                    Schedule a meeting
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 4. THREE-COLUMN LAYOUT (Directly matching the uploaded picture)       */}
          {/*    Left: About Card                                                   */}
          {/*    Center: Feed / Posts / Projects Tabs                              */}
          {/*    Right: "You might know" & "Active"                                 */}
          {/* ===================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ----------------------------------------------------------------- */}
            {/* LEFT COLUMN: ABOUT CARD (Cols: 3 on lg/xl)                        */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-3 space-y-6">
              {/* "About" Card */}
              <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#26282A]">
                  <h3 className="font-heading text-base font-bold text-white">About</h3>
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(true)}
                    className="text-[#8E9296] hover:text-[#D4A373] text-xs font-subheading transition-colors"
                  >
                    Edit
                  </button>
                </div>

                {/* Bio text if provided */}
                {activeProfile.bio && (
                  <p className="font-subheading text-xs text-[#A3A3A3] leading-relaxed">
                    {activeProfile.bio}
                  </p>
                )}

                {/* Icon list (mirrors the reference screenshot's About list) */}
                <div className="space-y-3 font-subheading text-xs text-[#D1D5DB]">
                  {/* Gender / Designation */}
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#D4A373] shrink-0" />
                    <span>{activeProfile.gender || 'Technical Member'}</span>
                  </div>

                  {/* Joined / Academic Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#D4A373] shrink-0" />
                    <span>Joined {activeProfile.joinDate}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#D4A373] shrink-0" />
                    <span className="truncate">{activeProfile.location || 'Advanced Computing Lab, Campus'}</span>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#D4A373] shrink-0" />
                    <span className="truncate text-white font-mono-tech text-[11px]">{activeProfile.email}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#D4A373] shrink-0" />
                    <span className="font-mono-tech text-[11px]">{activeProfile.phone || '+91 98450 12042'}</span>
                  </div>

                  {/* Member ID with Copy Button */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#000000] border border-[#26282A]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#D4A373]" />
                      <span className="font-mono-tech font-bold text-white text-[11px]">
                        {activeProfile.id}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      className="text-[#8E9296] hover:text-[#D4A373] p-1 rounded transition-colors"
                      title="Copy Member ID"
                    >
                      {copiedId ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* CENTER COLUMN: MAIN WORKSPACE FEED (Cols: 6 on lg/xl)             */}
            {/*    Tabs (Followers, Following, Posts, Uploaded Projects, Certs)    */}
            {/*    Post Composer & Rich Feed Cards                                */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-6 space-y-6">
              {/* Tab Navigation Header (Directly inspired by screenshot tabs) */}
              <div className="bg-[#0C0D0E] border border-[#26282A] rounded-2xl p-2 flex items-center justify-between gap-1 overflow-x-auto">
                <div className="flex items-center gap-1">
                  {/* Posts Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 rounded-xl text-xs font-subheading font-medium transition-all cursor-pointer ${
                      activeTab === 'posts'
                        ? 'bg-[#D4A373] text-black font-bold shadow-md shadow-[#D4A373]/20'
                        : 'text-[#8E9296] hover:text-white hover:bg-[#141517]'
                    }`}
                  >
                    Posts
                  </button>

                  {/* Uploaded Projects Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('projects')}
                    className={`px-4 py-2 rounded-xl text-xs font-subheading font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'projects'
                        ? 'bg-[#D4A373] text-black font-bold shadow-md shadow-[#D4A373]/20'
                        : 'text-[#8E9296] hover:text-white hover:bg-[#141517]'
                    }`}
                  >
                    <span>Projects</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#000000]/20 font-bold">
                      {uploadedCount}
                    </span>
                  </button>

                  {/* Certificates Tab */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('certificates')}
                    className={`px-4 py-2 rounded-xl text-xs font-subheading font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'certificates'
                        ? 'bg-[#D4A373] text-black font-bold shadow-md shadow-[#D4A373]/20'
                        : 'text-[#8E9296] hover:text-white hover:bg-[#141517]'
                    }`}
                  >
                    <span>Certificates</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#000000]/20 font-bold">
                      {certCount}
                    </span>
                  </button>
                </div>
              </div>

              {/* POSTS TAB CONTENT */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {/* Share an Update / Project Composer */}
                  <form
                    onSubmit={handlePublishPost}
                    className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-5 shadow-xl space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#141517] border border-[#D4A373]/40 flex items-center justify-center text-xs font-heading font-bold text-[#D4A373] shrink-0">
                        {activeProfile.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <input
                        type="text"
                        value={composerText}
                        onChange={(e) => setComposerText(e.target.value)}
                        placeholder={`Share a project milestone, research discovery, or hardware benchmark...`}
                        className="flex-1 bg-[#000000] border border-[#26282A] rounded-full px-4 py-2 text-xs font-subheading text-white focus:outline-none focus:border-[#D4A373] transition-colors"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#26282A]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsUploadModalOpen(true)}
                          className="text-xs font-subheading text-[#8E9296] hover:text-[#D4A373] flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-[#141517] transition-colors cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5 text-[#D4A373]" />
                          <span>Attach Project</span>
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={!composerText.trim()}
                        className="px-4 py-1.5 rounded-full bg-[#D4A373] disabled:opacity-40 hover:bg-[#c49363] text-black text-xs font-heading font-bold transition-all shadow-md shadow-[#D4A373]/20 cursor-pointer"
                      >
                        Publish
                      </button>
                    </div>
                  </form>

                  {/* Feed Posts List (Matching the rich post card in the screenshot) */}
                  {filteredPosts.length === 0 ? (
                    <div className="p-8 bg-[#0C0D0E] border border-[#26282A] rounded-3xl text-center space-y-2">
                      <MessageSquare className="w-8 h-8 text-[#545454] mx-auto" />
                      <p className="text-xs font-subheading text-[#8E9296]">
                        No posts matched your search. Clear filter or publish a new update.
                      </p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-5 shadow-xl hover:border-[#3D4042] transition-all space-y-4"
                      >
                        {/* Post Author Row (Avatar, Name, Timestamp, 3-dots) */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#141517] border border-[#D4A373]/40 flex items-center justify-center text-xs font-heading font-bold text-[#D4A373] shrink-0">
                              {post.authorName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                            <div>
                              <h4 className="font-heading text-sm font-bold text-white leading-tight">
                                {post.authorName}
                              </h4>
                              <p className="font-subheading text-[11px] text-[#8E9296]">
                                {post.timeAgo} • <span className="text-[#D4A373]">{post.authorRole}</span>
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="text-[#8E9296] hover:text-white p-1 rounded-lg"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Post Body */}
                        <p className="font-subheading text-xs sm:text-sm text-[#D1D5DB] leading-relaxed">
                          {post.content}
                        </p>

                        {/* Post Media Image (as in the screenshot's post card) */}
                        {post.imageUrl && (
                          <div className="rounded-2xl overflow-hidden border border-[#26282A] max-h-72 w-full bg-[#000000]">
                            <img
                              src={post.imageUrl}
                              alt="Post preview"
                              className="w-full h-full object-cover object-center hover:scale-102 transition-transform duration-500"
                            />
                          </div>
                        )}

                        {/* Tech Stack Chips if available */}
                        {post.techStack && post.techStack.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {post.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[11px] font-mono-tech px-2.5 py-0.5 rounded-md bg-[#000000] text-[#D4A373] border border-[#26282A]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* External links */}
                        {(post.githubUrl || post.demoUrl) && (
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-subheading">
                            {post.githubUrl && (
                              <a
                                href={post.githubUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-[#D1D5DB] hover:text-[#D4A373] flex items-center gap-1 transition-colors"
                              >
                                <FolderGit2 className="w-3.5 h-3.5" />
                                <span>GitHub Repository</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {post.demoUrl && (
                              <a
                                href={post.demoUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="text-[#D4A373] hover:text-[#e4b585] flex items-center gap-1 transition-colors font-medium"
                              >
                                <span>Live Prototype</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Interaction Bar: Heart / Likes, Comments, Share (mirrors screenshot) */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#26282A] text-xs font-subheading text-[#8E9296]">
                          <div className="flex items-center gap-5">
                            {/* Like Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleLike(post.id)}
                              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                                post.isLiked ? 'text-[#D4A373] font-bold' : 'hover:text-white'
                              }`}
                            >
                              <Heart
                                className={`w-4 h-4 ${
                                  post.isLiked ? 'fill-[#D4A373] text-[#D4A373]' : ''
                                }`}
                              />
                              <span>{post.likesCount.toLocaleString()}</span>
                            </button>

                            {/* Comments */}
                            <button
                              type="button"
                              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.viewsCount.toLocaleString()}</span>
                            </button>
                          </div>

                          {/* Share button */}
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(window.location.href);
                              alert('Post link copied to clipboard!');
                            }}
                            className="flex items-center gap-1 hover:text-[#D4A373] transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* UPLOADED PROJECTS TAB */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0C0D0E] border border-[#26282A] rounded-2xl">
                    <div>
                      <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                        <FolderGit2 className="w-4 h-4 text-[#D4A373]" />
                        <span>Uploaded Projects</span>
                      </h3>
                      <p className="text-xs font-subheading text-[#8E9296]">
                        Repositories, prototypes, and engineering codebases deployed by {activeProfile.name}.
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
                                      : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                                  }`}
                                >
                                  {proj.status}
                                </span>
                              </div>

                              <p className="font-subheading text-xs text-[#8E9296] mt-1 flex items-center gap-2">
                                <span>
                                  Category: <strong className="text-white">{proj.category}</strong>
                                </span>
                                <span>•</span>
                                <span>
                                  Uploaded: <span className="text-[#D1D5DB]">{proj.uploadedAt}</span>
                                </span>
                              </p>
                            </div>
                          </div>

                          <p className="font-subheading text-xs text-[#A3A3A3] mb-4 leading-relaxed">
                            {proj.description}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#26282A]">
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
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CERTIFICATES TAB */}
              {activeTab === 'certificates' && (
                <div className="space-y-4">
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

                              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setSelectedCertForPreview(cert)}
                                  className="px-3 py-1.5 rounded-xl bg-[#000000] hover:bg-[#141517] text-[#D1D5DB] hover:text-white border border-[#26282A] text-xs font-subheading transition-colors cursor-pointer"
                                >
                                  Preview
                                </button>

                                <button
                                  type="button"
                                  onClick={() => triggerCertificateDownload(cert)}
                                  disabled={isDownloading}
                                  className="px-4 py-1.5 rounded-xl bg-[#D4A373] hover:bg-[#c49363] text-black font-heading font-bold text-xs shadow-md shadow-[#D4A373]/20 flex items-center gap-1.5 transition-all cursor-pointer"
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
                                <span>Digital Signature Valid</span>
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
                </div>
              )}
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* RIGHT COLUMN: "YOU MIGHT KNOW" & "ACTIVE" (Cols: 3 on lg/xl)      */}
            {/* ----------------------------------------------------------------- */}
            <div className="lg:col-span-3 space-y-6">
              {/* "You might know" Card (Matching top right widget in reference screenshot) */}
              <div className="bg-[#0C0D0E] border border-[#26282A] rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#26282A]">
                  <h3 className="font-heading text-sm font-bold text-white">You might know</h3>
                  <span className="text-[10px] font-subheading text-[#8E9296]">Ascent Members</span>
                </div>

                <div className="space-y-3.5">
                  {PEER_SUGGESTIONS.map((peer) => {
                    const isConnected = connectedPeers[peer.id];
                    return (
                      <div key={peer.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={peer.avatar}
                            alt={peer.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#26282A] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-heading text-xs font-bold text-white truncate">
                              {peer.name}
                            </h4>
                            <p className="font-subheading text-[11px] text-[#8E9296] truncate">
                              {peer.role}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleConnect(peer.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-subheading font-medium transition-all shrink-0 cursor-pointer ${
                            isConnected
                              ? 'bg-[#141517] text-[#D4A373] border border-[#D4A373]/30'
                              : 'bg-[#000000] text-white hover:text-[#D4A373] border border-[#26282A] hover:border-[#D4A373]/40'
                          }`}
                        >
                          {isConnected ? 'Connected' : '+ Connect'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>


            </div>
          </div>
            </>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODALS & OVERLAYS                                                      */}
      {/* ========================================================================= */}
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

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={activeProfile}
        onSave={handleSaveProfile}
      />

      <EditCoverModal
        isOpen={isEditCoverOpen}
        onClose={() => setIsEditCoverOpen(false)}
        currentCoverStyle={activeProfile.coverStyle}
        onSelectCover={handleSelectCover}
      />
    </div>
  );
}
