// 재택 프로젝트 기본 정보
export interface RemoteProject {
  id: string;
  title: string;
  description: string;
  clientName: string;
  companyName: string;
  budget: string | {
    type: 'fixed' | 'hourly';
    amount: string;
    negotiable: boolean;
    currency: string;
  };
  budgetType: 'fixed' | 'hourly';
  budgetNegotiable: boolean;
  duration: string;
  startDate: string;
  deadline: string;
  urgency: 'low' | 'medium' | 'high';
  skills: string[];
  category: string;
  workType: 'full-remote' | 'hybrid' | 'flexible';
  experienceLevel: 'entry' | 'intermediate' | 'expert';
  status: 'open' | 'in-progress' | 'completed' | 'closed';
  applicationsCount: number;
  viewCount: number;
  bookmarkCount: number;
  postedDate: string;
  applicationDeadline: string;
  isBookmarked?: boolean;
}

// 재택 프로젝트 상세 정보
export interface RemoteProjectDetail extends RemoteProject {
  client: {
    id: string;
    name: string;
    company: string;
    rating: number;
    reviewCount: number;
    projectsCompleted: number;
    verificationStatus: 'verified' | 'unverified';
    profileImage?: string;
    industry?: string; // 추가
    size?: string; // 추가
    founded?: string; // 추가
  };
  requirements: string[];
  deliverables: string[];
  communicationMethod: string[];
  timezone: string;
  preferredWorkingHours?: string;
  remoteWorkTools?: string[];
  benefits?: string[];
  teamSize?: string;
  projectStages?: Array<{
    id: string;
    name: string;
    description: string;
    duration: string;
    status: 'upcoming' | 'current' | 'completed';
  }>;
  similarProjects?: RemoteProject[];
}

// 재택 프로젝트 검색 파라미터
export interface RemoteProjectSearchParams {
  page?: number;
  size?: number;
  searchTerm?: string;
  skills?: string[];
  duration?: string;
  budgetMin?: number;
  budgetMax?: number;
  workType?: 'full-remote' | 'hybrid' | 'flexible';
  experienceLevel?: 'entry' | 'intermediate' | 'expert';
  category?: string;
  sortBy?: string;
}

// 재택 프로젝트 지원 정보
export interface RemoteProjectApplication {
  id: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string;
  proposedRate?: string;
  proposedDuration?: string;
  availableStartDate: string;
  portfolioUrls?: string[];
  attachments?: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  appliedDate: string;
}

// 재택 프로젝트 문의 정보
export interface RemoteProjectInquiry {
  id: string;
  projectId: string;
  userId: string;
  subject: string;
  message: string;
  response?: string;
  status: 'pending' | 'answered';
  createdDate: string;
  answeredDate?: string;
}