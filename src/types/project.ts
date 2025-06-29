export interface Statistics {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  skills: string[];
  duration: string;
  budget: string;
  deadline: string;
  type: '상주' | '외주';
  description?: string;
  level?: string;
  category?: string;
  location?: string;
  workingHours?: string;
  benefits?: string[];
  companyLogo?: string;
  applicants?: number;
  views?: number;
  isUrgent?: boolean;
  isRemote?: boolean;
  teamSize?: number;
}

export interface ActiveProject {
  id: string;
  title: string;
  freelancer: {
    name: string;
    role: string;
    avatar: string;
  };
  company: string;
  progress: number;
  startDate: string;
  endDate: string;
  skills: string[];
}

export interface ProjectDetail extends Project {
  detailedDescription: string;
  requirements: string[];
  responsibilities: string[];
  preferredSkills: string[];
  workEnvironment: string;
  companyInfo: CompanyInfo;
  projectStages: ProjectStage[];
  applicationDeadline: string;
  startDate: string;
  contactPerson: ContactPerson;
  additionalBenefits: string[];
  workingConditions: WorkingConditions;
  evaluationCriteria: string[];
  submissionGuidelines: string[];
}

export interface CompanyInfo {
  name: string;
  industry: string;
  size: string;
  location: string;
  website?: string;
  description: string;
  founded?: string;
  employees?: string;
  ceo?: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  description: string;
  duration: string;
  deliverables: string[];
}

export interface ContactPerson {
  name: string;
  position: string;
  email: string;
  phone?: string;
  responseTime: string;
}

export interface WorkingConditions {
  workingHours: string;
  workingDays: string;
  overtime: string;
  remote: boolean;
  location: string;
  dress_code?: string;
  equipment_provided: boolean;
}

export interface Applicant {
  id: string;
  name: string;
  experience: string;
  skills: string[];
  appliedDate: string;
  status: '지원완료' | '서류검토' | '면접진행' | '최종합격' | '불합격';
  coverLetter: string;
  portfolioUrl?: string;
}

export interface ProjectReview {
  id: string;
  projectId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  workPeriod: string;
  position: string;
}
