export interface RegistrationFormData {
  name: string;
  usn: string;
  contactNumber: string;
  department: string;
  year: string;
  reasonToJoin: string;
  skills: string[];
}

export type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

export interface ClubProject {
  id: string;
  name: string;
  division: string;
  role: string;
  status: 'In Development' | 'Testing' | 'Deployed';
  techStack: string[];
  repoStatus: 'Private Org' | 'Club Internal';
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'Hackathon' | 'Workshop' | 'Tech Talk' | 'Internal Sprint';
  exclusivePass: boolean;
  rsvpStatus: 'Confirmed' | 'Pending' | 'Waitlist';
}

export interface UploadedProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  category: string;
  uploadedAt: string;
  status: 'Approved' | 'Under Review' | 'Featured';
  version?: string;
}

export interface MemberPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  techStack?: string[];
  githubUrl?: string;
  demoUrl?: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  isLiked?: boolean;
}

export interface MemberCertificate {
  id: string;
  title: string;
  issueDate: string;
  category: 'Membership' | 'Hackathon' | 'Technical Excellence' | 'Workshop Completion';
  issuer: string;
  verificationCode: string;
  description: string;
  downloadUrl?: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  usn: string;
  email: string;
  department: string;
  year: string;
  division: string;
  role: string;
  memberTier: 'Ascent Fellow' | 'Core Innovator' | 'Technical Member' | 'Candidate Member';
  joinDate: string;
  badgeLevel: string;
  skills: string[];
  bio?: string;
  gender?: string;
  location?: string;
  phone?: string;
  birthDate?: string;
  coverStyle?: string;
  followersCount?: number;
  followingCount?: number;
  projects: ClubProject[];
  uploadedProjects: UploadedProject[];
  certificates: MemberCertificate[];
  events: ClubEvent[];
  hardwarePass: {
    allocatedHours: number;
    assignedLab: string;
    activeQuota: string;
  };
}

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Science & Engineering',
  'Artificial Intelligence & Machine Learning',
  'Data Science & Analytics',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Aerospace / Aeronautical Engineering',
  'Biotechnology Engineering',
  'Robotics & Automation',
] as const;

export const ACADEMIC_YEARS = [
  '1st Year (Freshman)',
  '2nd Year (Sophomore)',
  '3rd Year (Junior)',
  '4th Year (Senior)',
] as const;

export const POPULAR_SKILLS = [
  'Full-Stack Web',
  'Python',
  'AI / Machine Learning',
  'UI/UX Design',
  'Embedded & IoT',
  'Robotics',
  'Cloud / DevOps',
  'Mobile App Dev',
  'Cybersecurity',
  'Competitive Coding',
] as const;

export const SAMPLE_MEMBERS: Record<string, MemberProfile> = {
  '1MS22CS042': {
    id: 'ASC-2026-CS042',
    name: 'Alex Rivera',
    usn: '1MS22CS042',
    email: 'alex.rivera@college.edu',
    department: 'Computer Science & Engineering',
    year: '3rd Year (Junior)',
    division: 'AI & Systems Architecture',
    role: 'Lead Systems Architect',
    memberTier: 'Core Innovator',
    joinDate: 'Sept 2024',
    badgeLevel: 'Gold Reticle // Tier 1',
    skills: ['Python', 'AI / Machine Learning', 'Cloud / DevOps', 'Full-Stack Web', 'C++'],
    bio: 'Lead Systems Architect at Ascent. Engineering low-latency distributed telemetry, neural inference runtimes, and high-performance avionics pipelines.',
    gender: 'Male',
    location: 'Advanced Computing Lab 4, Bangalore',
    phone: '+91 98450 12042',
    birthDate: 'June 28, 2003',
    followersCount: 1498,
    followingCount: 320,
    coverStyle: 'circuit',
    projects: [
      {
        id: 'p1',
        name: 'Ascent Neural Inference Hub',
        division: 'AI Systems',
        role: 'Lead Developer',
        status: 'In Development',
        techStack: ['Python', 'PyTorch', 'FastAPI', 'Docker'],
        repoStatus: 'Private Org',
      },
      {
        id: 'p2',
        name: 'Campus Mesh Protocol',
        division: 'Distributed Networks',
        role: 'Core Contributor',
        status: 'Testing',
        techStack: ['Go', 'gRPC', 'WebSockets'],
        repoStatus: 'Club Internal',
      },
    ],
    uploadedProjects: [],
    certificates: [
      {
        id: 'cert-1',
        title: 'Certificate of Technical Innovation',
        issueDate: 'August 28, 2026',
        category: 'Technical Excellence',
        issuer: 'Ascent Technical Board & Faculty Advisor',
        verificationCode: 'ASC-TI-2026-9842',
        description: 'Awarded for extraordinary architecture contributions to the Neural KV-Cache and distributed edge computing systems.',
      },
      {
        id: 'cert-2',
        title: 'Official Core Innovator Credentials',
        issueDate: 'October 15, 2025',
        category: 'Membership',
        issuer: 'Ascent Executive Council',
        verificationCode: 'ASC-MEM-2025-0144',
        description: 'Certified designation of active Core Innovator status with verified voting privileges and advanced lab clearance.',
      },
      {
        id: 'cert-3',
        title: 'Ascent 48h Winter HackSprint - 1st Place',
        issueDate: 'December 05, 2025',
        category: 'Hackathon',
        issuer: 'Ascent Hackathon Committee',
        verificationCode: 'ASC-HACK-2025-001',
        description: 'Champion honors in the annual 48-Hour Inter-Departmental Systems HackSprint for the Campus Mesh Protocol project.',
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
      {
        id: 'e2',
        title: 'High-Performance WebGL Shaders',
        date: 'Nov 04, 2026',
        time: '04:30 PM IST',
        location: 'Ascent Tech Suite A',
        type: 'Workshop',
        exclusivePass: true,
        rsvpStatus: 'Confirmed',
      },
    ],
    hardwarePass: {
      allocatedHours: 64,
      assignedLab: 'Lab 4 // Node 08 (NVIDIA RTX 4090 Cluster)',
      activeQuota: 'GPU Cluster + Embedded FPGA Rack',
    },
  },
  '1MS23AI018': {
    id: 'ASC-2026-AI018',
    name: 'Kavya Patel',
    usn: '1MS23AI018',
    email: 'kavya.patel@college.edu',
    department: 'Artificial Intelligence & Machine Learning',
    year: '2nd Year (Sophomore)',
    division: 'Computer Vision & Robotics',
    role: 'Autonomous Systems Engineer',
    memberTier: 'Ascent Fellow',
    joinDate: 'Jan 2025',
    badgeLevel: 'Platinum Reticle // Tier 1',
    skills: ['Python', 'Robotics', 'ROS2', 'Embedded & IoT', 'OpenCV'],
    bio: 'Autonomous Robotics perception engineer. Designing sub-5ms embedded LiDAR odometry pipelines on Jetson Orin and spatial navigation sensors.',
    gender: 'Female',
    location: 'Autonomous Robotics Bay // Bench 03',
    phone: '+91 97421 88319',
    birthDate: 'August 14, 2004',
    followersCount: 890,
    followingCount: 215,
    coverStyle: 'nebula',
    projects: [
      {
        id: 'p3',
        name: 'Ascent SLAM Rover v3',
        division: 'Autonomous Robotics',
        role: 'Perception Lead',
        status: 'In Development',
        techStack: ['ROS2', 'C++', 'Python', 'Jetson Orin'],
        repoStatus: 'Private Org',
      },
    ],
    uploadedProjects: [],
    certificates: [
      {
        id: 'cert-k1',
        title: 'Ascent Fellow Distinction Certificate',
        issueDate: 'January 20, 2026',
        category: 'Technical Excellence',
        issuer: 'Ascent Executive Council & Faculty Board',
        verificationCode: 'ASC-FEL-2026-003',
        description: 'Conferred for breakthrough engineering in autonomous navigation algorithms and rover systems.',
      },
      {
        id: 'cert-k2',
        title: 'Official Ascent Membership Certificate',
        issueDate: 'January 10, 2025',
        category: 'Membership',
        issuer: 'Ascent Student Chapter',
        verificationCode: 'ASC-MEM-2025-0812',
        description: 'Official credential verifying active student membership in Ascent Autonomous Robotics Division.',
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
      allocatedHours: 40,
      assignedLab: 'Robotics Bay // Bench 03',
      activeQuota: 'Jetson Orin Nano + LiDAR Scanner',
    },
  },
};
