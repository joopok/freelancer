import {
  RemoteWorkDetail,
  RemoteEnvironment,
  RemoteCompanyInfo,
  WorkStage,
  ContactPerson,
  RemoteWorkingConditions,
  VirtualOfficeInfo,
  CollaborationTool,
  ProductivityMetric,
  RemoteWorkPolicy,
  TeamCulture,
  RemoteWorkReview,
  RemoteWorkQuestion,
  SimilarRemoteWork
} from '@/types/athome';

export const colors = {
  primary: {
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-200 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-300',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    accent: 'bg-blue-600'
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-900/10',
    border: 'border-green-200 dark:border-green-700',
    text: 'text-green-700 dark:text-green-300',
    accent: 'bg-green-600'
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    border: 'border-amber-200 dark:border-amber-700',
    text: 'text-amber-700 dark:text-amber-300',
    accent: 'bg-amber-600'
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/10',
    border: 'border-red-200 dark:border-red-700',
    text: 'text-red-700 dark:text-red-300',
    accent: 'bg-red-600'
  },
  neutral: {
    bg: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-600',
    text: 'text-gray-700 dark:text-gray-300',
    accent: 'bg-gray-600'
  },
  card: 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
};

export const mockRemoteCompanyInfo: RemoteCompanyInfo = {
  name: '(주)글로벌리모트',
  industry: 'IT/소프트웨어',
  size: '스타트업 (50-100명)',
  location: '서울특별시 (본사)',
  website: 'https://globalremote.co.kr',
  description: '100% 원격근무 기반의 혁신적인 테크 스타트업입니다. 전 세계 15개국에 팀원들이 분산되어 있으며, 비동기 커뮤니케이션과 성과 중심의 문화를 추구합니다. AI와 클라우드 기술에 특화된 솔루션을 개발하고 있습니다.',
  founded: '2019년',
  employees: '85명',
  ceo: '김○○',
  remoteWorkHistory: '창립 때부터 100% 원격근무',
  remoteWorkPercentage: 100,
  globalTeams: true,
  officeLocations: ['서울 (가상본사)', '도쿄 (지사)', '실리콘밸리 (지사)'],
  remoteFirstPolicy: true,
  diversityAndInclusion: [
    '15개국 다국적 팀',
    '시간대 다양성 존중',
    '문화적 포용성',
    '접근성 지원',
    '성별/연령 균형'
  ]
};

export const mockRemoteEnvironment: RemoteEnvironment = {
  officeSetupSupport: true,
  equipmentProvided: [
    '최신 맥북 프로 또는 윈도우 노트북',
    '외부 모니터 2대',
    '인체공학적 의자',
    '스탠딩 데스크',
    '웹캠 및 마이크',
    '키보드 & 마우스',
    '노이즈 캔슬링 헤드폰'
  ],
  internetAllowance: 80000,
  workspaceStipend: 300000,
  ergonomicSupport: true,
  techSupport: '24/7 글로벌 IT 지원',
  securityRequirements: [
    'VPN 필수 사용',
    '2단계 인증',
    '보안 소프트웨어 설치',
    'BYOD 정책 준수',
    '정기 보안 교육'
  ],
  workingSpaceRecommendations: [
    '조용한 전용 공간',
    '안정적인 인터넷 (최소 100Mbps)',
    '자연광이 들어오는 환경',
    '온도 조절 가능',
    '문 닫힘 가능한 독립 공간'
  ]
};

export const mockVirtualOffice: VirtualOfficeInfo = {
  platform: 'MetaOffice Pro',
  features: [
    '3D 가상 오피스',
    '실시간 아바타',
    '공간 오디오',
    '화면 공유',
    '가상 화이트보드',
    '비공식 만남 공간',
    '집중 모드',
    '활동 상태 표시'
  ],
  virtualRooms: [
    {
      id: 'room1',
      name: '메인 워크스페이스',
      purpose: '일반 업무',
      capacity: 50,
      tools: ['Slack', 'Zoom', 'Figma'],
      availability: '24/7'
    },
    {
      id: 'room2', 
      name: '집중 룸',
      purpose: '딥워크',
      capacity: 10,
      tools: ['노이즈 차단', '집중 타이머'],
      availability: '09:00-18:00'
    },
    {
      id: 'room3',
      name: '브레인스토밍 룸',
      purpose: '창의적 협업',
      capacity: 15,
      tools: ['Miro', 'FigJam', '화이트보드'],
      availability: '24/7'
    }
  ],
  socialSpaces: [
    '가상 커피룸',
    '게임 라운지',
    '북클럽 공간',
    '운동 챌린지 룸'
  ],
  meetingRooms: 8,
  collaborationSpaces: [
    '프로젝트 전용 룸',
    '고객 미팅룸',
    '1:1 멘토링 공간'
  ],
  digitalWhiteboards: true,
  screenSharingQuality: '4K 지원'
};

export const mockWorkStages: WorkStage[] = [
  {
    id: '1',
    name: '원격 온보딩 및 환경 설정',
    description: '새로운 팀원을 위한 체계적인 원격 온보딩 프로세스와 업무 환경 구축을 진행합니다.',
    duration: '1주',
    deliverables: ['환경 설정 완료', '팀 소개 세션', '멘토 배정'],
    collaborationLevel: '높음',
    tools: ['Slack', 'Zoom', 'Notion', 'Loom']
  },
  {
    id: '2',
    name: '프로젝트 기획 및 설계',
    description: '비동기 협업을 통한 요구사항 분석과 시스템 아키텍처 설계를 수행합니다.',
    duration: '2주',
    deliverables: ['요구사항 문서', '기술 설계서', '프로토타입'],
    collaborationLevel: '중간',
    tools: ['Figma', 'Miro', 'GitHub', 'Linear']
  },
  {
    id: '3',
    name: '개발 및 구현',
    description: '분산된 팀원들과의 협업을 통해 실제 개발을 진행합니다.',
    duration: '6주',
    deliverables: ['핵심 기능 개발', 'CI/CD 파이프라인', '테스트 코드'],
    collaborationLevel: '중간',
    tools: ['VS Code Live Share', 'GitHub', 'Docker', 'AWS']
  }
];

export const mockContactPerson: ContactPerson = {
  name: '이원격',
  position: '리모트 팀 리드',
  email: 'remote.lead@globalremote.co.kr',
  phone: '+82-10-1234-5678',
  responseTime: '평균 1시간',
  timezone: 'Asia/Seoul (UTC+9)',
  preferredCommunication: 'Slack → 이메일 → 화상통화',
  availableHours: '09:00-18:00 KST (유연)'
};

export const mockRemoteWorkingConditions: RemoteWorkingConditions = {
  workingHours: '코어타임 14:00-17:00 KST',
  workingDays: '주 5일 (유연)',
  timeZoneFlexibility: '높음 (±4시간 허용)',
  meetingOverlapHours: '14:00-17:00 KST',
  coreHours: '팀별 최소 3시간 겹침',
  overtimePolicy: '사전 승인제, 150% 보상',
  vacationPolicy: '무제한 휴가제',
  sickLeavePolicy: '즉시 사용 가능',
  communicationExpectations: [
    '24시간 내 응답 (urgent 제외)',
    '회의 24시간 전 아젠다 공유',
    '일일 스탠드업 비동기 참여',
    '주간 회고 필수 참여'
  ],
  performanceTracking: 'OKR 기반 분기별 평가'
};

export const mockCollaborationTools: CollaborationTool[] = [
  {
    id: 'slack',
    name: 'Slack',
    category: '커뮤니케이션',
    description: '실시간 메시징 및 팀 커뮤니케이션',
    features: ['채널 기반 대화', '화상 통화', '파일 공유', '앱 통합'],
    integrations: ['GitHub', 'Jira', 'Calendar', 'Zoom'],
    learningCurve: '쉬움',
    supportLevel: '전문 관리자 배치',
    cost: '회사 부담'
  },
  {
    id: 'notion',
    name: 'Notion',
    category: '문서 관리',
    description: '통합 워크스페이스 및 지식 관리',
    features: ['문서 작성', '데이터베이스', '프로젝트 관리', '위키'],
    integrations: ['Slack', 'GitHub', 'Calendar'],
    learningCurve: '중간',
    supportLevel: '교육 프로그램 제공',
    cost: '회사 부담'
  }
];

export const mockRemoteWork = (remoteWorkId: string): RemoteWorkDetail => ({
  id: remoteWorkId,
  title: 'AI 기반 글로벌 추천 시스템 개발 (100% 원격)',
  company: '(주)글로벌리모트',
  skills: ['React', 'TypeScript', 'Python', 'TensorFlow', 'AWS', 'Docker'],
  duration: '6개월',
  budget: '8,000만원',
  deadline: 'D-5',
  type: '재택',
  description: '전 세계 사용자를 대상으로 한 AI 기반 개인화 추천 시스템을 개발하는 100% 원격근무 프로젝트',
  level: '시니어',
  category: 'AI/ML',
  timeZone: 'Asia/Seoul (UTC+9)',
  communicationTools: ['Slack', 'Zoom', 'Notion', 'Miro'],
  workingHours: '코어타임 14:00-17:00',
  benefits: ['장비 지원', '홈오피스 수당', '무제한 휴가', '교육비 지원'],
  applicants: 34,
  views: 892,
  isUrgent: false,
  isFullyRemote: true,
  teamSize: 8,
  experienceRequired: '3년 이상',
  detailedDescription: `
🌍 **글로벌 스케일의 AI 추천 시스템 프로젝트**

전 세계 500만 사용자가 사용하는 플랫폼의 핵심 추천 엔진을 개발하는 프로젝트입니다. 
머신러닝과 딥러닝 기술을 활용하여 사용자 행동 패턴을 분석하고, 
실시간으로 개인화된 컨텐츠를 추천하는 시스템을 구축합니다.

🚀 **기술적 도전과제:**
• 대용량 실시간 데이터 처리 (초당 10만건 이상)
• 다국가 사용자를 위한 문화적 맥락 고려
• A/B 테스트를 통한 지속적인 모델 개선
• MLOps 파이프라인 구축 및 자동화

💼 **100% 원격근무 환경:**
• 15개국 팀원들과의 글로벌 협업
• 비동기 커뮤니케이션 중심
• 자율적인 업무 시간 관리
• 성과 중심의 평가 시스템
  `,
  requirements: [
    'React 및 TypeScript 4년 이상 경험',
    'Python 및 머신러닝 라이브러리 3년 이상',
    'AWS 클라우드 서비스 실무 경험',
    '대용량 데이터 처리 경험',
    '원격근무 경험 2년 이상',
    '영어 커뮤니케이션 가능 (중급 이상)'
  ],
  responsibilities: [
    'AI 추천 알고리즘 설계 및 구현',
    '프론트엔드 사용자 인터페이스 개발',
    '실시간 데이터 파이프라인 구축',
    'A/B 테스트 설계 및 분석',
    '성능 모니터링 및 최적화',
    '국제팀과의 비동기 협업'
  ],
  preferredSkills: [
    'TensorFlow/PyTorch 실무 경험',
    'Kubernetes 및 Docker 활용',
    'GraphQL 및 Apollo 경험',
    '다국어 서비스 개발 경험',
    'Remote-first 문화 경험',
    'OKR 기반 목표 관리 경험'
  ],
  remoteWorkEnvironment: mockRemoteEnvironment,
  companyInfo: mockRemoteCompanyInfo,
  workStages: mockWorkStages,
  applicationDeadline: '2024-12-31',
  startDate: '2025-01-15',
  contactPerson: mockContactPerson,
  remoteBenefits: [
    '홈오피스 구축비 300만원 지원',
    '월 인터넷비 8만원 지원',
    '연간 코워킹스페이스 이용권',
    '인체공학적 장비 무제한 지원',
    '글로벌 컨퍼런스 참석비',
    '온라인 교육 플랫폼 무제한',
    '정신건강 상담 서비스',
    '연 2회 팀 워크샵 (해외 가능)'
  ],
  workingConditions: mockRemoteWorkingConditions,
  evaluationCriteria: [
    '기술 역량 및 문제 해결 능력 (40%)',
    '원격 협업 및 커뮤니케이션 (25%)',
    '자기 주도적 업무 수행 (20%)',
    '글로벌 마인드셋 (15%)'
  ],
  submissionGuidelines: [
    '이력서 및 포트폴리오 (영문 선호)',
    '원격근무 경험 상세 기술',
    'GitHub 프로필 및 주요 프로젝트',
    '선호 시간대 및 업무 스타일',
    '영어 커뮤니케이션 수준 증빙',
    '홈오피스 환경 사진 (선택)'
  ],
  virtualOffice: mockVirtualOffice,
  collaborationTools: mockCollaborationTools,
  productivityMetrics: [],
  remoteWorkPolicy: {} as RemoteWorkPolicy,
  teamCulture: {} as TeamCulture
});

export const mockSimilarRemoteWorks = [
  {
    id: '1',
    title: 'React 개발자 (100% 리모트)',
    company: '(주)디지털노마드',
    budget: '6,000만원',
    duration: '4개월',
    skills: ['React', 'TypeScript', 'Node.js'],
    applicants: 23,
    matchScore: 94,
    remoteScore: 98,
    benefits: ['장비지원', '무제한휴가', '글로벌팀']
  },
  {
    id: '2',
    title: 'AI 엔지니어 (하이브리드)',
    company: '(주)스마트워크',
    budget: '7,500만원',
    duration: '5개월',
    skills: ['Python', 'TensorFlow', 'AWS'],
    applicants: 31,
    matchScore: 87,
    remoteScore: 85,
    benefits: ['교육지원', '홈오피스', '성과급']
  },
  {
    id: '3',
    title: '풀스택 개발자 (원격우선)',
    company: '(주)원격테크',
    budget: '5,500만원',
    duration: '6개월',
    skills: ['React', 'Python', 'Docker'],
    applicants: 18,
    matchScore: 82,
    remoteScore: 92,
    benefits: ['장비지원', '시차적응', '워케이션']
  },
  {
    id: '4',
    title: '클라우드 아키텍트 (글로벌)',
    company: '(주)클라우드퍼스트',
    budget: '9,000만원',
    duration: '8개월',
    skills: ['AWS', 'Docker', 'Kubernetes'],
    applicants: 42,
    matchScore: 78,
    remoteScore: 96,
    benefits: ['글로벌팀', '무제한휴가', '컨퍼런스']
  }
];

export const mockRemoteWorkReviews = [
  {
    id: '1',
    reviewerName: '김개발자',
    rating: 5,
    comment: '정말 좋은 원격근무 환경이었습니다. 장비 지원이 훌륭하고 팀 문화가 매우 포용적입니다.',
    date: '2024-01-20',
    workPeriod: '6개월',
    position: '프론트엔드 개발자',
    pros: ['장비 지원 우수', '유연한 근무시간', '좋은 팀 문화'],
    cons: ['시차로 인한 소통 지연'],
    workLifeBalance: 5,
    communicationQuality: 4,
    toolsAndTech: 5,
    managementSupport: 5,
    careerGrowth: 4
  },
  {
    id: '2',
    reviewerName: '박디자이너',
    rating: 4,
    comment: '크리에이티브한 업무 환경과 좋은 동료들. 다만 초기 적응 기간이 필요했습니다.',
    date: '2024-01-15',
    workPeriod: '4개월',
    position: 'UX/UI 디자이너',
    pros: ['자율적인 업무환경', '글로벌 프로젝트 경험', '성장 기회'],
    cons: ['초기 적응 어려움', '시간대 차이'],
    workLifeBalance: 4,
    communicationQuality: 4,
    toolsAndTech: 5,
    managementSupport: 4,
    careerGrowth: 5
  }
];

export const mockRemoteWorkQuestions = [
  {
    id: '1',
    question: '원격근무 중 회의는 어떻게 진행되나요?',
    answer: '매일 오전 10시 스탠드업 미팅을 진행하며, 주요 회의는 사전에 일정을 공유합니다. 모든 회의는 녹화되어 시차가 있는 팀원들도 확인할 수 있습니다.',
    askedBy: '김개발',
    answeredAt: '2024-01-15',
    isPublic: true,
    upvotes: 15,
    category: '회의 문화',
    tags: ['회의', '소통', '일정관리']
  },
  {
    id: '2',
    question: '장비 지원은 어떻게 받을 수 있나요?',
    answer: '입사 후 1주일 내에 필요한 장비 리스트를 제출하면 검토 후 구매 또는 대여해드립니다. 맥북, 모니터, 의자, 데스크 등 업무에 필요한 모든 장비를 지원합니다.',
    askedBy: '박디자이너',
    answeredAt: '2024-01-10',
    isPublic: true,
    upvotes: 18,
    category: '장비 지원',
    tags: ['장비', '지원', '복리후생']
  },
  {
    id: '3',
    question: '시차가 있는 팀원들과는 어떻게 협업하나요?',
    answer: '비동기 커뮤니케이션을 기본으로 하며, 코어타임(14:00-17:00 KST)에는 모든 팀원이 온라인 상태를 유지합니다. Notion을 통한 문서화와 Slack을 통한 소통을 활용합니다.',
    askedBy: '정프론트',
    answeredAt: '2024-01-08',
    isPublic: true,
    upvotes: 15,
    category: '협업 방식',
    tags: ['시차', '글로벌', '비동기']
  }
];

export const mockRealtimeStats = {
  applicants: 34,
  views: 892,
  bookmarks: 156,
  onlineInterviews: 12,
  averageResponseTime: '2시간',
  successfulHires: 23
};

import { AthomeProject } from '@/types/athome';

export const athomeProjectsData: AthomeProject[] = [
  {
    id: "1",
    title: "AI 기반 추천 시스템 개발",
    company: "(주)테크인사이트",
    skills: ["Python", "TensorFlow", "AWS"],
    duration: "4개월",
    budget: "4,500만원",
    deadline: "D-3",
    type: "재택",
    description: "사용자 행동 패턴 분석을 통한 맞춤형 상품 추천 시스템 개발 프로젝트입니다.",
    level: "중급"
  },
  {
    id: "3",
    title: "블록체인 기반 결제 시스템 구축",
    company: "(주)블록테크",
    skills: ["Solidity", "Web3.js", "Node.js"],
    duration: "6개월",
    budget: "7,000만원",
    deadline: "D-7",
    type: "재택",
    description: "블록체인 기술을 활용한 안전한 결제 시스템 개발 프로젝트입니다.",
    level: "고급"
  },
  {
    id: "6",
    title: "IoT 디바이스 모니터링 앱 개발",
    company: "(주)스마트테크",
    skills: ["Flutter", "Firebase", "MQTT"],
    duration: "4개월",
    budget: "4,000만원",
    deadline: "D-6",
    type: "재택",
    description: "다양한 IoT 디바이스 상태를 실시간으로 모니터링하는 모바일 앱 개발 프로젝트입니다.",
    level: "중급"
  },
  {
    id: "8",
    title: "SNS 플랫폼 API 개발",
    company: "(주)소셜미디어",
    skills: ["Node.js", "GraphQL", "MongoDB"],
    duration: "4개월",
    budget: "4,200만원",
    deadline: "D-2",
    type: "재택",
    description: "소셜 미디어 플랫폼의 효율적인 데이터 처리를 위한 API 개발 프로젝트입니다.",
    level: "중급"
  },
  {
    id: "10",
    title: "메타버스 플랫폼 개발",
    company: "(주)메타랩스",
    skills: ["Unity", "WebGL", "Three.js"],
    duration: "6개월",
    budget: "8,000만원",
    deadline: "D-1",
    type: "재택",
    description: "가상 현실 기반의 메타버스 플랫폼 프론트엔드 개발 프로젝트입니다.",
    level: "고급"
  },
  {
    id: "11",
    title: "AI 챗봇 시스템 개발",
    company: "(주)인텔리봇",
    skills: ["NLP", "Python", "TensorFlow"],
    duration: "5개월",
    budget: "5,800만원",
    deadline: "D-2",
    type: "재택",
    description: "자연어 처리 기술을 활용한 고객 응대용 AI 챗봇 시스템 개발 프로젝트입니다.",
    level: "중급"
  },
  {
    id: "13",
    title: "보안 시스템 강화 프로젝트",
    company: "(주)시큐리티솔루션",
    skills: ["Java", "Spring Security", "Penetration Testing"],
    duration: "3개월",
    budget: "4,200만원",
    deadline: "D-6",
    type: "재택",
    description: "기업 보안 시스템 취약점 분석 및 보안 강화 솔루션 개발 프로젝트입니다.",
    level: "고급"
  },
  {
    id: "15",
    title: "CRM 시스템 개발",
    company: "(주)고객관리시스템",
    skills: ["React", "GraphQL", "PostgreSQL"],
    duration: "5개월",
    budget: "6,000만원",
    deadline: "D-5",
    type: "재택",
    description: "기업 고객 관리를 위한 대시보드 및 관리 시스템 개발 프로젝트입니다.",
    level: "중급"
  },
  {
    id: "21",
    title: "온라인 교육 플랫폼 개발",
    company: "(주)에듀테크",
    skills: ["React", "Node.js", "MongoDB"],
    duration: "4개월",
    budget: "5,000만원",
    deadline: "D-8",
    type: "재택",
    description: "실시간 강의 및 학습 관리 기능을 제공하는 온라인 교육 플랫폼 개발 프로젝트입니다.",
    level: "중급"
  },
  {
    id: "22",
    title: "디지털 헬스케어 앱 개발",
    company: "(주)헬스케어솔루션",
    skills: ["React Native", "Firebase", "Node.js"],
    duration: "5개월",
    budget: "6,500만원",
    deadline: "D-4",
    type: "재택",
    description: "사용자 건강 데이터 분석 및 맞춤형 건강 관리 서비스를 제공하는 모바일 앱 개발 프로젝트입니다.",
    level: "중급"
  },
  {
    id: "23",
    title: "실시간 협업 툴 개발",
    company: "(주)팀워크솔루션",
    skills: ["Vue.js", "WebSocket", "Node.js"],
    duration: "6개월",
    budget: "7,200만원",
    deadline: "D-3",
    type: "재택",
    description: "실시간 문서 공유 및 협업 기능을 제공하는 웹 애플리케이션 개발 프로젝트입니다.",
    level: "중급"
  },
  {
    id: "24",
    title: "AI 이미지 처리 서비스 개발",
    company: "(주)비전테크",
    skills: ["Python", "TensorFlow", "OpenCV"],
    duration: "5개월",
    budget: "6,800만원",
    deadline: "D-9",
    type: "재택",
    description: "인공지능 기술을 활용한 이미지 분석 및 처리 서비스 개발 프로젝트입니다.",
    level: "고급"
  }
];
