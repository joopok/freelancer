// 재택근무 기본 정보 타입
export interface RemoteWork {
  id: string;
  title: string;
  company: string;
  skills: string[];
  duration: string;
  budget: string;
  salary?: string;
  deadline: string;
  type: '재택' | '하이브리드' | '외주';
  description?: string;
  level?: string;
  category?: string;
  location?: string;
  timeZone?: string;
  communicationTools?: string[];
  workingHours?: string;
  benefits?: string[];
  companyLogo?: string;
  companyDescription?: string;
  companySize?: string;
  applicants?: number;
  views?: number;
  isUrgent?: boolean;
  isFullyRemote?: boolean;
  teamSize?: number;
  experienceRequired?: string;
}

// 재택근무 상세 정보 타입
export interface RemoteWorkDetail extends RemoteWork {
  detailedDescription: string;
  requirements: string[];
  responsibilities: string[];
  preferredSkills: string[];
  remoteWorkEnvironment: RemoteEnvironment;
  companyInfo: RemoteCompanyInfo;
  workStages: WorkStage[];
  applicationDeadline: string;
  startDate: string;
  contactPerson: ContactPerson;
  remoteBenefits: string[];
  workingConditions: RemoteWorkingConditions;
  evaluationCriteria: string[];
  submissionGuidelines: string[];
  virtualOffice: VirtualOfficeInfo;
  collaborationTools: CollaborationTool[];
  productivityMetrics: ProductivityMetric[];
  remoteWorkPolicy: RemoteWorkPolicy;
  teamCulture: TeamCulture;
}

// 원격근무 환경 정보
export interface RemoteEnvironment {
  officeSetupSupport: boolean;
  equipmentProvided: string[];
  internetAllowance: number;
  workspaceStipend: number;
  ergonomicSupport: boolean;
  techSupport: string;
  securityRequirements: string[];
  workingSpaceRecommendations: string[];
}

// 원격근무 회사 정보
export interface RemoteCompanyInfo {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  founded: string;
  employees: string;
  ceo: string;
  remoteWorkHistory: string;
  remoteWorkPercentage: number;
  globalTeams: boolean;
  officeLocations: string[];
  remoteFirstPolicy: boolean;
  diversityAndInclusion: string[];
}

// 업무 단계
export interface WorkStage {
  id: string;
  name: string;
  description: string;
  duration: string;
  deliverables: string[];
  collaborationLevel: string;
  tools: string[];
}

// 연락처 정보
export interface ContactPerson {
  name: string;
  position: string;
  email: string;
  phone?: string;
  responseTime: string;
  timezone: string;
  preferredCommunication: string;
  availableHours: string;
}

// 원격근무 조건
export interface RemoteWorkingConditions {
  workingHours: string;
  workingDays: string;
  timeZoneFlexibility: string;
  meetingOverlapHours: string;
  coreHours: string;
  overtimePolicy: string;
  vacationPolicy: string;
  sickLeavePolicy: string;
  communicationExpectations: string[];
  performanceTracking: string;
}

// 가상 오피스 정보
export interface VirtualOfficeInfo {
  platform: string;
  features: string[];
  virtualRooms: VirtualRoom[];
  socialSpaces: string[];
  meetingRooms: number;
  collaborationSpaces: string[];
  digitalWhiteboards: boolean;
  screenSharingQuality: string;
}

// 가상 룸 정보
export interface VirtualRoom {
  id: string;
  name: string;
  purpose: string;
  capacity: number;
  tools: string[];
  availability: string;
}

// 협업 도구
export interface CollaborationTool {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  integrations: string[];
  learningCurve: string;
  supportLevel: string;
  cost: string;
}

// 생산성 지표
export interface ProductivityMetric {
  id: string;
  name: string;
  description: string;
  measurement: string;
  target: string;
  frequency: string;
  tools: string[];
}

// 원격근무 정책
export interface RemoteWorkPolicy {
  workFromHomeAllowance: number;
  equipmentBudget: number;
  coworkingSpaceAllowance: number;
  travelPolicy: string;
  inPersonMeetingFrequency: string;
  performanceReviewProcess: string;
  careerDevelopmentSupport: string[];
  mentorshipProgram: boolean;
  onboardingProcess: RemoteOnboarding;
}

// 원격 온보딩
export interface RemoteOnboarding {
  duration: string;
  buddySystem: boolean;
  virtualTour: boolean;
  equipmentDelivery: string;
  trainingModules: string[];
  checkInFrequency: string;
}

// 팀 문화
export interface TeamCulture {
  communicationStyle: string;
  meetingCulture: string;
  socialActivities: string[];
  teamBuildingFrequency: string;
  inclusionPractices: string[];
  feedbackCulture: string;
  recognitionPrograms: string[];
  wellnessSupport: string[];
}

// 재택근무 리뷰
export interface RemoteWorkReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  workPeriod: string;
  position: string;
  pros: string[];
  cons: string[];
  workLifeBalance: number;
  communicationQuality: number;
  toolsAndTech: number;
  managementSupport: number;
  careerGrowth: number;
}

// 재택근무 질문
export interface RemoteWorkQuestion {
  id: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredBy: string;
  date: string;
  upvotes: number;
  category: string;
  tags: string[];
}

// 유사 재택근무 추천
export interface SimilarRemoteWork {
  id: string;
  title: string;
  company: string;
  budget: string;
  duration: string;
  skills: string[];
  applicants: number;
  matchScore: number;
  remoteScore: number;
  benefits: string[];
} 