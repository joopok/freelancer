// 프리랜서 기본 정보 타입
export interface Freelancer {
  id: string;
  name: string;
  experience: string;
  type: '개인' | '팀' | '법인사업자';
  skills: string[];
  description: string;
  rating: number;
  projectCount: number;
  viewCount: number;
  proposalCount: number;
  category: string;
  profileImage?: string;
  hourlyRate?: number;
  location?: string;
  languages?: string[];
  availableFrom?: string;
  responseTime?: string;
  completionRate?: number;
}

// FeaturedFreelancer 타입 추가
export interface FeaturedFreelancer {
  id: number;
  name: string;
  position: string;
  experience: string;
  skills: string[];
  avatar: string;
  rating: number;
}

// 프리랜서 포트폴리오 타입
export interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  projectDate: string;
  projectUrl?: string;
  githubUrl?: string;
  category: string;
  duration: string;
  teamSize: number;
  role: string;
  highlights: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  testimonial?: {
    text: string;
    clientName: string;
    clientPosition: string;
    clientCompany: string;
  };
}

// 프리랜서 리뷰 타입
export interface Review {
  id: string;
  clientName: string;
  clientPosition?: string;
  clientCompany?: string;
  clientImage?: string;
  rating: number;
  comment: string;
  projectTitle: string;
  date: string;
  verified: boolean;
  projectBudget?: string;
  projectDuration?: string;
  ratings: {
    communication: number;
    quality: number;
    timeline: number;
    professionalism: number;
    value: number;
  };
  wouldRecommend: boolean;
  isPublic: boolean;
}

// 업무 이력 타입
export interface WorkHistory {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  companyLogo?: string;
  isRemote: boolean;
  teamSize?: number;
}

// 교육 이력 타입
export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  period: string;
  gpa?: string;
  honors?: string[];
  relevantCoursework?: string[];
}

// 자격증 타입
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  isActive: boolean;
}

// 스킬 세부 정보 타입
export interface SkillDetail {
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience: number;
  lastUsed: string;
  projects: number;
  certified: boolean;
  endorsements: number;
  verified?: boolean;
  hasTest?: boolean;
  testScore?: number;
  hasCertificate?: boolean;
  certificateName?: string;
}

// 가용성 정보 타입
export interface Availability {
  status: 'Available' | 'Busy' | 'Unavailable' | 'Partially Available';
  hoursPerWeek: number;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  preferredSchedule: string[];
  nextAvailableDate: string;
  currentProjects: number;
  maxConcurrentProjects: number;
  vacation?: {
    start: string;
    end: string;
    reason: string;
  };
}

// 가격 정보 타입
export interface PricingInfo {
  hourlyRate: {
    min: number;
    max: number;
    currency: string;
  };
  fixedProjectRate: {
    min: number;
    max: number;
    currency: string;
  };
  paymentTerms: string;
  paymentMethods: string[];
  invoiceFrequency: string;
  lateFees: boolean;
  deposits: {
    required: boolean;
    percentage: number;
  };
  revisions: {
    included: number;
    additionalCost: number;
  };
}

// 커뮤니케이션 선호도 타입
export interface CommunicationPreference {
  channels: string[];
  responseTime: string;
  meetingFrequency: string;
  reportingStyle: string;
  languagePreference: string[];
  timezone: string;
  availableHours: string;
}

// 프로젝트 선호도 타입
export interface ProjectPreference {
  projectTypes: string[];
  industries: string[];
  projectSize: string[];
  durationPreference: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  teamCollaboration: boolean;
  remoteOnly: boolean;
  longTermEngagement: boolean;
}

// 소셜 프로필 타입
export interface SocialProfile {
  platform: string;
  url: string;
  verified: boolean;
  followers?: number;
  isPublic: boolean;
}

// 비즈니스 정보 타입
export interface BusinessInfo {
  businessName?: string;
  businessType: string;
  registrationNumber?: string;
  taxId?: string;
  insuranceInfo?: {
    hasInsurance: boolean;
    type: string;
    coverage: string;
  };
  legalCompliance: string[];
  contracts: {
    hasStandardContract: boolean;
    ndaRequired: boolean;
    ipRights: string;
  };
}

// 통계 및 분석 타입
export interface FreelancerStats {
  totalEarnings: number;
  avgProjectValue: number;
  clientRetentionRate: number;
  onTimeDelivery: number;
  budgetAdherence: number;
  clientSatisfaction: number;
  responseRate: number;
  projectSuccessRate: number;
  repeatClientRate: number;
  referralRate: number;
  monthlyStats: {
    month: string;
    projects: number;
    earnings: number;
    hours: number;
    clients: number;
  }[];
}

// 추천 프리랜서 타입
export interface SimilarFreelancer {
  id: string;
  name: string;
  title: string;
  rating: number;
  hourlyRate: number;
  skills: string[];
  location: string;
  profileImage: string;
  completedProjects: number;
  matchingScore: number;
  availabilityStatus: string;
  responseTime: string;
}

// 질문과 답변 타입
export interface FreelancerQA {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredAt: string;
  isPublic: boolean;
  upvotes: number;
  category: string;
}

// 특별 서비스 타입
export interface SpecialService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  deliverables: string[];
  requirements: string[];
  isPopular: boolean;
  discountPercentage?: number;
}

// 프리랜서 상세 정보 타입
export interface FreelancerDetail extends Freelancer {
  portfolios: Portfolio[];
  reviews: Review[];
  bio: string;
  tagline: string;
  education: Education[];
  certifications: Certification[];
  workHistory: WorkHistory[];
  skillDetails: SkillDetail[];
  availability: Availability;
  pricing: PricingInfo;
  communication: CommunicationPreference;
  projectPreferences: ProjectPreference;
  socialProfiles: SocialProfile[];
  businessInfo: BusinessInfo;
  stats: FreelancerStats;
  similarFreelancers: SimilarFreelancer[];
  qaSection: FreelancerQA[];
  specialServices: SpecialService[];
  badges: string[];
  lastActiveDate: string;
  joinDate: string;
  isOnline: boolean;
  verificationStatus: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
    paymentVerified: boolean;
  };
  endorsements: {
    skill: string;
    endorsedBy: string;
    endorserTitle: string;
    date: string;
  }[];
  repeatClientRate?: number;
  responseRate?: number;
}