'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  TrendingUp, 
  Award,
  Heart,
  MessageCircle,
  Send,
  Share2,
  Shield,
  Eye,
  CheckCircle,
  ExternalLink,
  Github,
  Globe,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  Video,
  FileText,
  Download,
  Filter,
  BarChart3,
  Briefcase,
  GraduationCap,
  Settings,
  Zap,
  Target,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  X,
  ArrowRight,
  DollarSign,
  Percent,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  BookmarkCheck,
  PlayCircle,
  PauseCircle,
  Volume2,
  RefreshCw,
  Search,
  SortDesc,
  Filter as FilterIcon,
  Calendar as CalendarIcon,
  Camera,
  Edit,
  Copy,
  Check
} from 'lucide-react';
import { FreelancerDetail, Portfolio, Review, SimilarFreelancer } from '@/types/freelancer';

// 실시간 통계 업데이트를 위한 인터페이스
interface RealtimeStats {
  현재_조회자: number;
  오늘_조회수: number;
  오늘_문의수: number;
  온라인_상태: boolean;
  마지막_활동: string;
  활성_프로젝트: number;
}

export default function FreelancerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const freelancerId = params.id as string;
  
  // 상태 관리
  const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'experience' | 'reviews' | 'skills' | 'pricing'>('overview');
  const [실시간통계, set실시간통계] = useState<RealtimeStats>({
    현재_조회자: 3,
    오늘_조회수: 27,
    오늘_문의수: 5,
    온라인_상태: true,
    마지막_활동: '2분 전',
    활성_프로젝트: 2
  });
  
  // 모달 상태들
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // 기능 상태들
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [matchingScore, setMatchingScore] = useState(0);
  const [skillMatchingScore, setSkillMatchingScore] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAllSkills, setShowAllSkills] = useState(false);
  
  // 프로젝트 제안 폼 상태
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    budget: '',
    timeline: '',
    requirements: '',
    attachments: [] as File[]
  });
  
  // 채팅 상태
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'freelancer';
    message: string;
    timestamp: string;
    read: boolean;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');

  // 실시간 통계 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      set실시간통계(prev => ({
        ...prev,
        현재_조회자: Math.max(1, prev.현재_조회자 + (Math.random() > 0.7 ? 1 : -1)),
        오늘_조회수: prev.오늘_조회수 + (Math.random() > 0.8 ? 1 : 0),
        오늘_문의수: prev.오늘_문의수 + (Math.random() > 0.9 ? 1 : 0),
        마지막_활동: Math.random() > 0.5 ? '방금 전' : '2분 전'
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 스킬 매칭 점수 계산
  useEffect(() => {
    const calculateMatchingScore = () => {
      // 모의 매칭 알고리즘
      const baseScore = 75;
      const randomVariation = Math.random() * 20 - 10;
      const newScore = Math.round(Math.max(0, Math.min(100, baseScore + randomVariation)));
      setMatchingScore(newScore);
      
      const skillScore = Math.round(85 + Math.random() * 15);
      setSkillMatchingScore(skillScore);
    };

    const timer = setTimeout(calculateMatchingScore, 1000);
    return () => clearTimeout(timer);
  }, []);

  // 프리랜서 상세 데이터 로드
  useEffect(() => {
    const loadFreelancerDetail = async () => {
      setLoading(true);
      
      // 상세한 목업 데이터 생성
      setTimeout(() => {
        const mockFreelancer: FreelancerDetail = {
          id: freelancerId,
          name: '김민수',
          tagline: '10년차 풀스택 개발자 | 스타트업 CTO 경험 | 글로벌 프로젝트 전문',
          experience: '10년 경력',
          type: '개인',
          skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'PostgreSQL', 'Redis'],
          description: '안녕하세요! 풀스택 개발자 김민수입니다.',
          bio: `10년간 웹 개발 분야에서 다양한 프로젝트를 경험했습니다. 
          
특히 React/TypeScript 기반의 프론트엔드 개발과 Node.js/Python을 활용한 백엔드 개발에 전문성을 가지고 있으며, 
AWS 클라우드 인프라 설계 및 운영 경험도 풍부합니다.

스타트업 CTO로 3년간 근무하며 팀 리딩 경험을 쌓았고, 글로벌 클라이언트와의 프로젝트를 통해 
다양한 문화권의 개발자들과 협업하는 능력을 기를 수 있었습니다.

클라이언트와의 원활한 소통을 통해 만족스러운 결과물을 제공하는 것을 목표로 하며, 
최신 기술 트렌드를 지속적으로 학습하여 더 나은 솔루션을 제안하기 위해 노력하고 있습니다.`,
          rating: 4.9,
          projectCount: 156,
          viewCount: 2847,
          proposalCount: 23,
          category: '개발자',
          profileImage: '/images/profile-placeholder.jpg',
          hourlyRate: 45000,
          location: '서울, 한국',
          languages: ['한국어', '영어', '일본어'],
          availableFrom: '즉시 가능',
          responseTime: '1시간 이내',
          completionRate: 99,
          joinDate: '2019-03-15',
          lastActiveDate: '2024-03-24',
          isOnline: true,
          badges: ['Top Rated Plus', 'Rising Talent', 'Premium', 'Expert Vetted', 'English Proficient'],
          
          // 검증 상태
          verificationStatus: {
            emailVerified: true,
            phoneVerified: true,
            identityVerified: true,
            paymentVerified: true
          },
          
          // 포트폴리오
          portfolios: [
            {
              id: '1',
              title: 'E-커머스 플랫폼 - 글로벌 패션 브랜드',
              description: 'React/TypeScript + Node.js로 구현한 대규모 E-커머스 플랫폼. 실시간 재고 관리, 다국가 결제 시스템, AI 기반 상품 추천 시스템 구축.',
              imageUrl: '/images/blog/default-thumbnail.jpg',
              category: '웹 개발',
              duration: '8개월',
              teamSize: 5,
              role: '풀스택 개발자 & 팀 리드',
              technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker', 'GraphQL'],
              projectDate: '2024-01',
              projectUrl: 'https://example-ecommerce.com',
              githubUrl: 'https://github.com/example/ecommerce',
              highlights: [
                '월 1억원 이상의 거래량 처리 시스템 구축',
                '99.9% 업타임 달성',
                '페이지 로딩 속도 70% 개선',
                'SEO 최적화로 검색 트래픽 300% 증가'
              ],
              challenges: [
                '대용량 트래픽 처리를 위한 확장 가능한 아키텍처 설계',
                '다국가 결제 시스템 통합의 복잡성',
                '실시간 재고 동기화 문제 해결'
              ],
              solutions: [
                'AWS ELB와 Auto Scaling을 활용한 로드 밸런싱',
                'Redis를 활용한 세션 관리 및 캐싱 전략',
                'GraphQL을 통한 효율적인 데이터 페칭',
                'CI/CD 파이프라인 구축으로 배포 자동화'
              ],
              results: [
                '사용자 전환율 25% 증가',
                '평균 응답 시간 40% 단축',
                '시스템 안정성 99.9% 달성',
                '개발 속도 60% 향상'
              ],
              testimonial: {
                text: '김민수님의 기술력과 커뮤니케이션 능력에 깊은 인상을 받았습니다. 복잡한 요구사항을 완벽히 이해하고 최적의 솔루션을 제공해주셨습니다.',
                clientName: '박영희',
                clientPosition: 'CTO',
                clientCompany: '글로벌패션'
              }
            },
            {
              id: '2',
              title: 'AI 기반 투자 자문 플랫폼',
              description: 'Python/Django + React로 구현한 AI 기반 투자 자문 서비스. 머신러닝 모델을 활용한 포트폴리오 최적화 및 리스크 분석 시스템.',
              imageUrl: '/images/blog/default-thumbnail.jpg',
              category: '핀테크',
              duration: '6개월',
              teamSize: 3,
              role: '백엔드 개발자 & ML 엔지니어',
              technologies: ['Python', 'Django', 'React', 'TensorFlow', 'PostgreSQL', 'Celery', 'Redis'],
              projectDate: '2023-10',
              projectUrl: 'https://example-fintech.com',
              highlights: [
                'ML 모델 정확도 92% 달성',
                '실시간 데이터 처리 시스템 구축',
                '금융 규제 준수 시스템 설계',
                '사용자 포트폴리오 수익률 평균 15% 개선'
              ],
              challenges: [
                '대용량 금융 데이터 실시간 처리',
                '금융 규제 및 보안 요구사항 준수',
                'ML 모델의 예측 정확도 향상'
              ],
              solutions: [
                'Apache Kafka를 활용한 실시간 데이터 스트리밍',
                '암호화 및 접근 제어 시스템 구축',
                'Feature Engineering 및 하이퍼파라미터 튜닝',
                'A/B 테스트를 통한 모델 성능 검증'
              ],
              results: [
                '사용자 만족도 95% 달성',
                '플랫폼 사용자 수 300% 증가',
                '평균 투자 수익률 15% 개선',
                '시스템 응답 시간 50% 단축'
              ]
            },
            {
              id: '3',
              title: '모바일 헬스케어 앱 개발',
              description: 'Flutter를 활용한 크로스플랫폼 헬스케어 애플리케이션. 실시간 건강 데이터 모니터링, AI 기반 건강 분석, 의료진과의 원격 상담 기능 구현.',
              imageUrl: '/images/blog/default-thumbnail.jpg',
              category: '모바일 개발',
              duration: '4개월',
              teamSize: 4,
              role: '모바일 앱 개발자',
              technologies: ['Flutter', 'Dart', 'Firebase', 'Node.js', 'MongoDB', 'WebRTC', 'TensorFlow Lite'],
              projectDate: '2023-07',
              projectUrl: 'https://example-healthcare.com',
              githubUrl: 'https://github.com/example/healthcare',
              highlights: [
                'iOS/Android 동시 출시로 개발 기간 50% 단축',
                '실시간 생체 신호 모니터링 구현',
                'HIPAA 규정 준수 보안 시스템',
                '사용자 10만명 돌파'
              ],
              challenges: [
                '크로스플랫폼에서 네이티브 성능 확보',
                '의료 데이터 보안 및 프라이버시',
                '배터리 효율적인 백그라운드 처리'
              ],
              solutions: [
                'Flutter 플랫폼 채널을 통한 네이티브 기능 활용',
                'End-to-End 암호화 및 생체 인증',
                'WorkManager와 iOS Background Modes 최적화',
                'TensorFlow Lite를 활용한 온디바이스 AI'
              ],
              results: [
                '앱스토어 평점 4.8/5.0 달성',
                'MAU 5만명 돌파',
                '의료진 만족도 90% 이상',
                '원격 상담 이용률 200% 증가'
              ],
              testimonial: {
                text: '김민수님은 복잡한 의료 요구사항을 완벽하게 이해하고 사용자 친화적인 앱으로 구현해주셨습니다. 덕분에 환자들의 건강 관리가 획기적으로 개선되었습니다.',
                clientName: '이정호',
                clientPosition: 'CEO',
                clientCompany: '디지털헬스케어'
              }
            }
          ],
          
          // 리뷰
          reviews: [
            {
              id: '1',
              clientName: '박영희',
              clientPosition: 'CTO',
              clientCompany: '글로벌패션',
              clientImage: '/images/profile-placeholder.jpg',
              rating: 5,
              comment: '김민수님과 함께 작업한 E-커머스 프로젝트는 정말 성공적이었습니다. 기술적 전문성뿐만 아니라 비즈니스 이해도가 높아서 최적의 솔루션을 제안해주셨어요. 특히 복잡한 결제 시스템 통합 과정에서 보여준 문제 해결 능력이 인상적이었습니다.',
              projectTitle: 'E-커머스 플랫폼 개발',
              date: '2024-02-15',
              verified: true,
              projectBudget: '5000만원',
              projectDuration: '8개월',
              ratings: {
                communication: 5,
                quality: 5,
                timeline: 5,
                professionalism: 5,
                value: 4
              },
              wouldRecommend: true,
              isPublic: true
            },
            {
              id: '2',
              clientName: '이상호',
              clientPosition: 'CEO',
              clientCompany: '핀테크스타트업',
              rating: 5,
              comment: 'AI 투자 자문 플랫폼 개발에서 김민수님의 ML 전문 지식이 프로젝트 성공의 핵심이었습니다. 복잡한 금융 데이터를 효율적으로 처리하는 시스템을 구축해주셨고, 결과적으로 우리 서비스의 예측 정확도가 크게 향상되었습니다.',
              projectTitle: 'AI 기반 투자 자문 플랫폼',
              date: '2023-12-20',
              verified: true,
              projectBudget: '3000만원',
              projectDuration: '6개월',
              ratings: {
                communication: 5,
                quality: 5,
                timeline: 4,
                professionalism: 5,
                value: 5
              },
              wouldRecommend: true,
              isPublic: true
            }
          ],
          
          // 교육 이력
          education: [
            {
              id: '1',
              institution: '서울대학교',
              degree: '학사',
              major: '컴퓨터공학과',
              period: '2010-2014',
              gpa: '3.8/4.0',
              honors: ['졸업우등상', '학과 수석 졸업'],
              relevantCoursework: ['자료구조', '알고리즘', '데이터베이스', '소프트웨어공학', '인공지능']
            },
            {
              id: '2',
              institution: 'Stanford University',
              degree: '온라인 수료증',
              major: 'Machine Learning',
              period: '2022',
              relevantCoursework: ['Machine Learning', 'Deep Learning', 'Neural Networks']
            }
          ],
          
          // 자격증
          certifications: [
            {
              id: '1',
              name: 'AWS Solutions Architect Professional',
              issuer: 'Amazon Web Services',
              issueDate: '2023-06-15',
              expiryDate: '2026-06-15',
              credentialId: 'AWS-PSA-12345',
              credentialUrl: 'https://aws.amazon.com/verification',
              isActive: true
            },
            {
              id: '2',
              name: '정보처리기사',
              issuer: '한국산업인력공단',
              issueDate: '2014-08-15',
              isActive: true
            }
          ],
          
          // 업무 이력
          workHistory: [
            {
              id: '1',
              company: '테크스타트업',
              position: 'CTO',
              period: '2021-2024',
              description: '스타트업 CTO로서 기술 전략 수립, 개발팀 리딩, 제품 아키텍처 설계 담당',
              technologies: ['React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
              achievements: [
                '개발팀 규모 3명에서 15명으로 확장',
                '제품 DAU 10만 명 달성',
                '시리즈 A 투자 유치 성공 (50억원)',
                '기술 부채 60% 감소'
              ],
              companyLogo: '/images/company-logo.png',
              isRemote: false,
              teamSize: 15
            }
          ],
          
          // 스킬 상세 정보
          skillDetails: [
            {
              name: 'React',
              category: 'Frontend',
              level: 'Expert',
              yearsOfExperience: 8,
              lastUsed: '현재',
              projects: 45,
              certified: true,
              endorsements: 23
            },
            {
              name: 'TypeScript',
              category: 'Language',
              level: 'Expert',
              yearsOfExperience: 6,
              lastUsed: '현재',
              projects: 38,
              certified: false,
              endorsements: 19
            },
            {
              name: 'Node.js',
              category: 'Backend',
              level: 'Expert',
              yearsOfExperience: 7,
              lastUsed: '현재',
              projects: 42,
              certified: true,
              endorsements: 21
            }
          ],
          
          // 가용성 정보
          availability: {
            status: 'Available',
            hoursPerWeek: 40,
            timezone: 'Asia/Seoul',
            workingHours: {
              start: '09:00',
              end: '18:00'
            },
            preferredSchedule: ['월', '화', '수', '목', '금'],
            nextAvailableDate: '2024-04-01',
            currentProjects: 2,
            maxConcurrentProjects: 3
          },
          
          // 가격 정보
          pricing: {
            hourlyRate: {
              min: 40000,
              max: 50000,
              currency: 'KRW'
            },
            fixedProjectRate: {
              min: 1000000,
              max: 50000000,
              currency: 'KRW'
            },
            paymentTerms: '프로젝트 시작 시 30% 선금, 완료 시 70% 지급',
            paymentMethods: ['계좌이체', '카드결제', 'PayPal'],
            invoiceFrequency: '월별',
            lateFees: true,
            deposits: {
              required: true,
              percentage: 30
            },
            revisions: {
              included: 3,
              additionalCost: 100000
            }
          },
          
          // 커뮤니케이션 선호도
          communication: {
            channels: ['이메일', '슬랙', '화상회의', '전화'],
            responseTime: '1시간 이내',
            meetingFrequency: '주 2회',
            reportingStyle: '상세한 진행 보고서',
            languagePreference: ['한국어', '영어'],
            timezone: 'Asia/Seoul',
            availableHours: '09:00-18:00 (KST)'
          },
          
          // 프로젝트 선호도
          projectPreferences: {
            projectTypes: ['웹 애플리케이션', 'API 개발', 'SaaS 플랫폼', '핀테크'],
            industries: ['테크', '핀테크', 'E-커머스', '헬스케어'],
            projectSize: ['중형', '대형'],
            durationPreference: ['3-6개월', '6-12개월'],
            budgetRange: {
              min: 1000000,
              max: 50000000
            },
            teamCollaboration: true,
            remoteOnly: false,
            longTermEngagement: true
          },
          
          // 소셜 프로필
          socialProfiles: [
            {
              platform: 'GitHub',
              url: 'https://github.com/kimminsu',
              verified: true,
              followers: 1250,
              isPublic: true
            },
            {
              platform: 'LinkedIn',
              url: 'https://linkedin.com/in/kimminsu',
              verified: true,
              followers: 890,
              isPublic: true
            }
          ],
          
          // 비즈니스 정보
          businessInfo: {
            businessType: '개인사업자',
            registrationNumber: '123-45-67890',
            insuranceInfo: {
              hasInsurance: true,
              type: '전문직 배상책임보험',
              coverage: '1억원'
            },
            legalCompliance: ['개인정보보호법', 'GDPR', 'SOX'],
            contracts: {
              hasStandardContract: true,
              ndaRequired: true,
              ipRights: '클라이언트 소유'
            }
          },
          
          // 통계
          stats: {
            totalEarnings: 350000000,
            avgProjectValue: 2500000,
            clientRetentionRate: 85,
            onTimeDelivery: 99,
            budgetAdherence: 95,
            clientSatisfaction: 4.9,
            responseRate: 98,
            projectSuccessRate: 99,
            repeatClientRate: 65,
            referralRate: 40,
            monthlyStats: []
          },
          
          // 추천 프리랜서
          similarFreelancers: [
            {
              id: '2',
              name: '이지연',
              title: '시니어 프론트엔드 개발자',
              rating: 4.8,
              hourlyRate: 42000,
              skills: ['React', 'Vue.js', 'TypeScript'],
              location: '서울',
              profileImage: '/images/profile-placeholder.jpg',
              completedProjects: 89,
              matchingScore: 92,
              availabilityStatus: 'Available',
              responseTime: '2시간 이내'
            }
          ],
          
          // Q&A 섹션
          qaSection: [
            {
              id: '1',
              question: '프로젝트 진행 중 소통은 어떻게 하시나요?',
              answer: '프로젝트 특성에 따라 슬랙, 이메일, 화상회의 등을 활용합니다. 주 2회 정기 미팅을 통해 진행 상황을 공유하고, 필요시 즉시 소통 가능합니다.',
              askedBy: '익명',
              answeredAt: '2024-03-20',
              isPublic: true,
              upvotes: 15,
              category: '커뮤니케이션'
            }
          ],
          
          // 특별 서비스
          specialServices: [
            {
              id: '1',
              name: '기술 컨설팅',
              description: '프로젝트 시작 전 기술 스택 선정 및 아키텍처 설계 컨설팅',
              price: 200000,
              duration: '2시간',
              deliverables: ['기술 스택 추천서', '아키텍처 다이어그램', '개발 일정 계획'],
              requirements: ['프로젝트 요구사항서', '예산 및 일정 정보'],
              isPopular: true,
              discountPercentage: 10
            }
          ],
          
          // 추천서
          endorsements: [
            {
              skill: 'React',
              endorsedBy: '박영희',
              endorserTitle: 'CTO',
              date: '2024-02-15'
            }
          ]
        };

        setFreelancer(mockFreelancer);
        setLoading(false);
      }, 1000);
    };

    if (freelancerId) {
      loadFreelancerDetail();
    }
  }, [freelancerId]);

  // 프로젝트 제안하기 폼 제출
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 API 호출
    console.log('프로젝트 제안:', projectForm);
    setShowContactModal(false);
    alert('프로젝트 제안이 전송되었습니다!');
  };

  // 채팅 메시지 전송
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'user' as const,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        read: false
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // 자동 응답 시뮬레이션
      setTimeout(() => {
        const response = {
          id: (Date.now() + 1).toString(),
          sender: 'freelancer' as const,
          message: '안녕하세요! 문의사항을 확인했습니다. 곧 상세한 답변을 드리겠습니다.',
          timestamp: new Date().toLocaleTimeString(),
          read: false
        };
        setChatMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  // 공유하기 기능
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${freelancer?.name} - 프리랜서 프로필`,
          text: freelancer?.tagline,
          url: window.location.href,
        });
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      // 클립보드 복사 fallback
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  // 별점 렌더링
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star 
            key={i}
            className={`${sizeClass} ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">({rating})</span>
      </div>
    );
  };

  // 프로그레스 바 컴포넌트
  const ProgressBar = ({ value, max = 100, color = 'blue', label, showValue = true }: {
    value: number;
    max?: number;
    color?: string;
    label?: string;
    showValue?: boolean;
  }) => {
    const percentage = (value / max) * 100;
    const colorClass = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500'
    }[color] || 'bg-blue-500';

    return (
      <div className="w-full">
        {label && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            {showValue && <span className="text-sm text-gray-500">{value}{max === 100 ? '%' : `/${max}`}</span>}
          </div>
        )}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`${colorClass} h-2 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">프리랜서 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
            <Users className="w-full h-full" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">프리랜서를 찾을 수 없습니다</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">요청하신 프리랜서 정보가 존재하지 않습니다.</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 메인 렌더링
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 브레드크럼 네비게이션 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              홈
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/freelancer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              프리랜서
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">상세보기</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium">{freelancer.name}</span>
          </nav>
        </div>
      </div>

      {/* 프로필 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 프로필 이미지 및 기본 정보 */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                  <Image
                    src={freelancer.profileImage || '/images/profile-placeholder.jpg'}
                    alt={freelancer.name}
                    width={128}
                    height={128}
                    className="w-full h-full rounded-full object-cover bg-white dark:bg-gray-800"
                  />
                </div>
                {/* 온라인 상태 표시 */}
                {freelancer.isOnline && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
                {/* 배지 표시 */}
                {freelancer.badges.includes('Top Rated Plus') && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    TOP
                  </div>
                )}
              </div>
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{freelancer.name}</h1>
                    {freelancer.verificationStatus.identityVerified && (
                      <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        인증됨
                      </div>
                    )}
                    {freelancer.isOnline && (
                      <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        온라인
                      </div>
                    )}
                  </div>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{freelancer.tagline}</p>
                  
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{freelancer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{freelancer.experience}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{freelancer.responseTime} 응답</span>
                    </div>
                  </div>
                  
                  {/* 평점 및 통계 */}
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      {renderStars(freelancer.rating, 'md')}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      <span>{freelancer.projectCount}개 프로젝트 완료</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{freelancer.completionRate}% 완료율</span>
                    </div>
                  </div>
                  
                  {/* 스킬 태그 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {freelancer.skills.slice(0, showAllSkills ? freelancer.skills.length : 6).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {freelancer.skills.length > 6 && (
                      <button
                        onClick={() => setShowAllSkills(!showAllSkills)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {showAllSkills ? '접기' : `+${freelancer.skills.length - 6}개 더`}
                      </button>
                    )}
                  </div>

                  {/* 프로젝트 스크린샷 */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">최근 프로젝트</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {freelancer.portfolios.slice(0, 3).map((portfolio, index) => (
                        <div 
                          key={portfolio.id}
                          className="relative group cursor-pointer"
                          onClick={() => {
                            setSelectedPortfolio(portfolio);
                            setShowPortfolioModal(true);
                          }}
                        >
                          <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                            <Image
                              src={portfolio.imageUrl || '/images/blog/default-thumbnail.jpg'}
                              alt={portfolio.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ExternalLink className="h-6 w-6 text-white" />
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate">{portfolio.title}</p>
                        </div>
                      ))}
                    </div>
                    {freelancer.portfolios.length > 3 && (
                      <button
                        onClick={() => setActiveTab('portfolio')}
                        className="mt-3 w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                      >
                        모든 프로젝트 보기 ({freelancer.portfolios.length}개)
                      </button>
                    )}
                  </div>
                </div>

                {/* 매칭 점수 및 실시간 통계 */}
                <div className="lg:w-80">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">매칭 분석</h3>
                    
                    <div className="space-y-4">
                      <ProgressBar 
                        value={matchingScore} 
                        label="프로젝트 매칭도" 
                        color={matchingScore >= 80 ? 'green' : matchingScore >= 60 ? 'yellow' : 'red'}
                      />
                      <ProgressBar 
                        value={skillMatchingScore} 
                        label="스킬 매칭도" 
                        color={skillMatchingScore >= 80 ? 'green' : skillMatchingScore >= 60 ? 'yellow' : 'red'}
                      />
                      <ProgressBar 
                        value={freelancer.completionRate || 0} 
                        label="프로젝트 완료율" 
                        color="blue"
                      />
                    </div>
                  </div>

                  {/* 실시간 통계 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">실시간 현황</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{실시간통계.현재_조회자}</div>
                        <div className="text-gray-500">현재 조회자</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{실시간통계.오늘_조회수}</div>
                        <div className="text-gray-500">오늘 조회수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{실시간통계.오늘_문의수}</div>
                        <div className="text-gray-500">오늘 문의수</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{실시간통계.활성_프로젝트}</div>
                        <div className="text-gray-500">진행 프로젝트</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 text-center">
                      마지막 활동: {실시간통계.마지막_활동}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowContactModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                프로젝트 제안하기
              </button>
              
              <button
                onClick={() => setShowChatModal(true)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                채팅하기
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors flex items-center gap-2 ${
                  isBookmarked 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {isBookmarked ? '저장됨' : '저장하기'}
              </button>
              
              <button
                onClick={handleShare}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
            </div>

            {/* 가격 정보 */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {freelancer.hourlyRate?.toLocaleString()}원
                </div>
                <div className="text-sm text-gray-500">시간당</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  {freelancer.availability.status === 'Available' ? '즉시 가능' : '상담 필요'}
                </div>
                <div className="text-sm text-gray-500">가용성</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '개요', icon: Eye },
              { id: 'portfolio', label: '포트폴리오', icon: Briefcase },
              { id: 'experience', label: '경험 & 이력', icon: GraduationCap },
              { id: 'reviews', label: '리뷰', icon: Star },
              { id: 'skills', label: '스킬 & 전문성', icon: Target },
              { id: 'pricing', label: '가격 & 조건', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 메인 콘텐츠 */}
          <div className="lg:col-span-2">
            {/* 개요 탭 */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* 프로필 소개 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">프로필 소개</h2>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {freelancer.bio}
                    </p>
                  </div>
                </div>

                {/* 주요 성과 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">주요 성과</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2 whitespace-nowrap">
                        {(freelancer.stats.totalEarnings / 100000000).toFixed(1)}억원
                      </div>
                      <div className="text-sm text-gray-500">총 수익</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {freelancer.stats.clientSatisfaction}
                      </div>
                      <div className="text-sm text-gray-500">고객 만족도</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {freelancer.stats.repeatClientRate}%
                      </div>
                      <div className="text-sm text-gray-500">재의뢰율</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {freelancer.stats.onTimeDelivery}%
                      </div>
                      <div className="text-sm text-gray-500">정시 납품률</div>
                    </div>
                  </div>
                </div>

                {/* 최근 포트폴리오 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">최근 포트폴리오</h2>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                    >
                      전체 보기
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {freelancer.portfolios.slice(0, 2).map(portfolio => (
                      <div
                        key={portfolio.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedPortfolio(portfolio);
                          setShowPortfolioModal(true);
                        }}
                      >
                        <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                          <Image
                            src={portfolio.imageUrl}
                            alt={portfolio.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                            {portfolio.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            {portfolio.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {portfolio.technologies.slice(0, 3).map(tech => (
                              <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                {tech}
                              </span>
                            ))}
                            {portfolio.technologies.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                +{portfolio.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 최근 리뷰 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">최근 리뷰</h2>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                    >
                      전체 보기
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {freelancer.reviews.slice(0, 2).map(review => (
                      <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {review.clientName[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">{review.clientName}</span>
                              {review.clientPosition && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-500 text-sm">{review.clientPosition}</span>
                                </>
                              )}
                              {review.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            {renderStars(review.rating, 'sm')}
                            <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                              {review.comment}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span>{review.projectTitle}</span>
                              <span>•</span>
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}            {/* 포트폴리오 탭 */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* 필터 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <FilterIcon className="w-4 h-4 text-gray-400" />
                    <select
                      value={portfolioFilter}
                      onChange={(e) => setPortfolioFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">전체 카테고리</option>
                      <option value="웹 개발">웹 개발</option>
                      <option value="핀테크">핀테크</option>
                      <option value="모바일">모바일</option>
                    </select>
                  </div>
                </div>

                {/* 포트폴리오 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {freelancer.portfolios.map(portfolio => (
                    <div
                      key={portfolio.id}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                      onClick={() => {
                        setSelectedPortfolio(portfolio);
                        setShowPortfolioModal(true);
                      }}
                    >
                      <div className="aspect-video relative bg-gray-100 dark:bg-gray-700">
                        <Image
                          src={portfolio.imageUrl}
                          alt={portfolio.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {portfolio.title}
                          </h3>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full whitespace-nowrap ml-2">
                            {portfolio.category}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                          {portfolio.description}
                        </p>
                        
                        {/* 프로젝트 정보 */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">기간:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">{portfolio.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">팀 규모:</span>
                            <span className="ml-1 text-gray-900 dark:text-white">{portfolio.teamSize}명</span>
                          </div>
                        </div>
                        
                        {/* 기술 스택 */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {portfolio.technologies.slice(0, 4).map(tech => (
                            <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                          {portfolio.technologies.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                              +{portfolio.technologies.length - 4}
                            </span>
                          )}
                        </div>
                        
                        {/* 링크들 */}
                        <div className="flex gap-2">
                          {portfolio.projectUrl && (
                            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" />
                          )}
                          {portfolio.githubUrl && (
                            <Github className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-pointer" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 경험 & 이력 탭 */}
            {activeTab === 'experience' && (
              <div className="space-y-8">
                {/* 업무 이력 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">업무 이력</h2>
                  <div className="space-y-6">
                    {freelancer.workHistory.map(work => (
                      <div key={work.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{work.position}</h3>
                              <p className="text-blue-600 dark:text-blue-400 font-medium">{work.company}</p>
                            </div>
                            <span className="text-gray-500 text-sm">{work.period}</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{work.description}</p>
                          
                          {/* 주요 성과 */}
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">주요 성과</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                              {work.achievements.map((achievement, index) => (
                                <li key={index}>{achievement}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* 사용 기술 */}
                          <div className="flex flex-wrap gap-2">
                            {work.technologies.map(tech => (
                              <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 교육 이력 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">교육 이력</h2>
                  <div className="space-y-6">
                    {freelancer.education.map(edu => (
                      <div key={edu.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{edu.institution}</h3>
                              <p className="text-green-600 dark:text-green-400 font-medium">{edu.degree} - {edu.major}</p>
                            </div>
                            <span className="text-gray-500 text-sm">{edu.period}</span>
                          </div>
                          {edu.gpa && (
                            <p className="text-gray-600 dark:text-gray-300 mb-2">GPA: {edu.gpa}</p>
                          )}
                          {edu.honors && edu.honors.length > 0 && (
                            <div className="mb-2">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">수상 내역</h4>
                              <div className="flex flex-wrap gap-2">
                                {edu.honors.map((honor, index) => (
                                  <span key={index} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                                    {honor}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 자격증 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">자격증</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {freelancer.certifications.map(cert => (
                      <div key={cert.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                          {cert.isActive && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">{cert.issuer}</p>
                        <p className="text-gray-500 text-sm">발급일: {cert.issueDate}</p>
                        {cert.expiryDate && (
                          <p className="text-gray-500 text-sm">만료일: {cert.expiryDate}</p>
                        )}
                        {cert.credentialUrl && (
                          <a 
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            인증서 확인
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 리뷰 탭 */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* 리뷰 필터 및 통계 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">클라이언트 리뷰</h2>
                    <select
                      value={reviewFilter}
                      onChange={(e) => setReviewFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">전체 리뷰</option>
                      <option value="5">5점</option>
                      <option value="4">4점</option>
                      <option value="recent">최신순</option>
                    </select>
                  </div>

                  {/* 평점 통계 */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">{freelancer.rating}</div>
                      {renderStars(freelancer.rating, 'lg')}
                      <div className="text-sm text-gray-500 mt-1">{freelancer.reviews.length}개 리뷰</div>
                    </div>
                    <div className="md:col-span-4 space-y-2">
                      {['커뮤니케이션', '품질', '일정 준수', '전문성', '가성비'].map((category, index) => {
                        const avgRating = freelancer.reviews.reduce((sum, review) => {
                          const ratings = Object.values(review.ratings);
                          return sum + ratings[index];
                        }, 0) / freelancer.reviews.length;
                        
                        return (
                          <div key={category} className="flex items-center gap-3">
                            <span className="w-20 text-sm text-gray-600 dark:text-gray-400">{category}</span>
                            <ProgressBar value={avgRating * 20} color="yellow" showValue={false} />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{avgRating.toFixed(1)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 리뷰 목록 */}
                <div className="space-y-6">
                  {freelancer.reviews.map(review => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.clientName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900 dark:text-white">{review.clientName}</span>
                                {review.clientPosition && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500 text-sm">{review.clientPosition}</span>
                                  </>
                                )}
                                {review.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              {renderStars(review.rating, 'sm')}
                            </div>
                            <span className="text-gray-500 text-sm">{review.date}</span>
                          </div>
                          
                          <p className={`text-gray-600 dark:text-gray-300 leading-relaxed ${
                            expandedReviews.has(review.id) ? '' : 'line-clamp-3'
                          }`}>
                            {review.comment}
                          </p>
                          
                          {review.comment.length > 200 && (
                            <button
                              onClick={() => {
                                const newExpanded = new Set(expandedReviews);
                                if (expandedReviews.has(review.id)) {
                                  newExpanded.delete(review.id);
                                } else {
                                  newExpanded.add(review.id);
                                }
                                setExpandedReviews(newExpanded);
                              }}
                              className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline"
                            >
                              {expandedReviews.has(review.id) ? '접기' : '더 보기'}
                            </button>
                          )}
                          
                          {/* 프로젝트 정보 */}
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                            <span className="font-medium">{review.projectTitle}</span>
                            {review.projectBudget && (
                              <>
                                <span>•</span>
                                <span>예산: {review.projectBudget}</span>
                              </>
                            )}
                            {review.projectDuration && (
                              <>
                                <span>•</span>
                                <span>기간: {review.projectDuration}</span>
                              </>
                            )}
                          </div>
                          
                          {/* 세부 평점 */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            {Object.entries(review.ratings).map(([key, value]) => {
                              const labels: Record<string, string> = {
                                communication: '커뮤니케이션',
                                quality: '품질',
                                timeline: '일정',
                                professionalism: '전문성',
                                value: '가성비'
                              };
                              return (
                                <div key={key} className="text-center">
                                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{value}</div>
                                  <div className="text-xs text-gray-500">{labels[key]}</div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* 추천 여부 */}
                          {review.wouldRecommend && (
                            <div className="flex items-center gap-2 mt-3 text-green-600 dark:text-green-400">
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm font-medium">이 프리랜서를 추천합니다</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 스킬 & 전문성 탭 */}
            {activeTab === 'skills' && (
              <div className="space-y-8">
                {/* 스킬 매트릭스 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">기술 전문성</h2>
                  <div className="space-y-6">
                    {freelancer.skillDetails.map(skill => (
                      <div key={skill.name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                            <span className="text-blue-600 dark:text-blue-400 text-sm">{skill.category}</span>
                          </div>
                          <div className="text-right">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              skill.level === 'Expert' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                              skill.level === 'Advanced' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                              skill.level === 'Intermediate' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            }`}>
                              {skill.level}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">경험:</span>
                            <span className="ml-1 text-gray-900 dark:text-white font-medium">{skill.yearsOfExperience}년</span>
                          </div>
                          <div>
                            <span className="text-gray-500">프로젝트:</span>
                            <span className="ml-1 text-gray-900 dark:text-white font-medium">{skill.projects}개</span>
                          </div>
                          <div>
                            <span className="text-gray-500">마지막 사용:</span>
                            <span className="ml-1 text-gray-900 dark:text-white font-medium">{skill.lastUsed}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">추천:</span>
                            <span className="ml-1 text-gray-900 dark:text-white font-medium">{skill.endorsements}개</span>
                          </div>
                        </div>
                        
                        {/* 스킬 레벨 프로그레스 */}
                        <ProgressBar 
                          value={skill.level === 'Expert' ? 100 : skill.level === 'Advanced' ? 80 : skill.level === 'Intermediate' ? 60 : 40}
                          color={skill.level === 'Expert' ? 'purple' : skill.level === 'Advanced' ? 'blue' : skill.level === 'Intermediate' ? 'green' : 'yellow'}
                          showValue={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 추천서 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">스킬 추천서</h2>
                  <div className="space-y-4">
                    {freelancer.endorsements.map((endorsement, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {endorsement.endorsedBy[0]}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 dark:text-white">
                            <span className="font-semibold">{endorsement.endorsedBy}</span>
                            <span className="text-gray-500 text-sm ml-2">({endorsement.endorserTitle})</span>
                            님이 <span className="font-semibold text-blue-600 dark:text-blue-400">{endorsement.skill}</span> 스킬을 추천했습니다.
                          </p>
                          <span className="text-gray-500 text-sm">{endorsement.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 가격 & 조건 탭 */}
            {activeTab === 'pricing' && (
              <div className="space-y-8">
                {/* 가격 정보 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">가격 정보</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">시간당 요금</h3>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {freelancer.pricing.hourlyRate.min.toLocaleString()} - {freelancer.pricing.hourlyRate.max.toLocaleString()}원
                      </div>
                      <p className="text-gray-500 text-sm">시간당 (협의 가능)</p>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">프로젝트 고정가</h3>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {(freelancer.pricing.fixedProjectRate.min / 1000000).toFixed(0)}M - {(freelancer.pricing.fixedProjectRate.max / 1000000).toFixed(0)}M원
                      </div>
                      <p className="text-gray-500 text-sm">프로젝트 규모에 따라</p>
                    </div>
                  </div>
                </div>

                {/* 결제 조건 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">결제 조건</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">결제 조건</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{freelancer.pricing.paymentTerms}</p>
                      
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">지원 결제 방법</h4>
                      <div className="flex flex-wrap gap-2">
                        {freelancer.pricing.paymentMethods.map(method => (
                          <span key={method} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                            {method}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">추가 정보</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">청구 주기:</span>
                          <span className="text-gray-900 dark:text-white">{freelancer.pricing.invoiceFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">선금:</span>
                          <span className="text-gray-900 dark:text-white">
                            {freelancer.pricing.deposits.required ? `${freelancer.pricing.deposits.percentage}% 필요` : '불필요'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">포함 수정 횟수:</span>
                          <span className="text-gray-900 dark:text-white">{freelancer.pricing.revisions.included}회</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">추가 수정 비용:</span>
                          <span className="text-gray-900 dark:text-white">{freelancer.pricing.revisions.additionalCost.toLocaleString()}원</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 가용성 정보 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">가용성 정보</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">현재 상태</h3>
                      <div className={`px-4 py-2 rounded-lg text-center font-medium ${
                        freelancer.availability.status === 'Available' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      }`}>
                        {freelancer.availability.status === 'Available' ? '즉시 가능' : '상담 필요'}
                      </div>
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <p>주당 {freelancer.availability.hoursPerWeek}시간</p>
                        <p>최대 {freelancer.availability.maxConcurrentProjects}개 동시 진행</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">근무 시간</h3>
                      <div className="text-gray-600 dark:text-gray-300">
                        <p>{freelancer.availability.workingHours.start} - {freelancer.availability.workingHours.end}</p>
                        <p className="text-sm text-gray-500 mt-1">{freelancer.availability.timezone}</p>
                      </div>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">근무 요일</h4>
                        <div className="flex flex-wrap gap-1">
                          {freelancer.availability.preferredSchedule.map(day => (
                            <span key={day} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">커뮤니케이션</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-500">응답 시간:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{freelancer.communication.responseTime}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">미팅 빈도:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">{freelancer.communication.meetingFrequency}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">선호 언어:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {freelancer.communication.languagePreference.map(lang => (
                              <span key={lang} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 특별 서비스 */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">특별 서비스</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {freelancer.specialServices.map(service => (
                      <div key={service.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative">
                        {service.isPopular && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            인기
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                          <div className="text-right">
                            {service.discountPercentage && (
                              <div className="text-red-500 text-sm line-through">
                                {(service.price * (1 + service.discountPercentage / 100)).toLocaleString()}원
                              </div>
                            )}
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {service.price.toLocaleString()}원
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{service.description}</p>
                        <div className="text-sm text-gray-500 mb-3">소요 시간: {service.duration}</div>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">제공 내용</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            {service.deliverables.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          서비스 신청
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>          {/* 오른쪽: 사이드바 */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {/* 빠른 연락 카드 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">빠른 연락</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowChatModal(true)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    실시간 채팅
                  </button>
                  <button 
                    onClick={() => setShowScheduleModal(true)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    화상 상담 예약
                  </button>
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    프로젝트 제안
                  </button>
                </div>
              </div>

              {/* 소셜 프로필 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">소셜 프로필</h3>
                <div className="space-y-3">
                  {freelancer.socialProfiles.map(profile => {
                    const Icon = profile.platform === 'GitHub' ? Github : 
                               profile.platform === 'LinkedIn' ? Linkedin :
                               profile.platform === 'Twitter' ? Twitter : Globe;
                    return (
                      <a
                        key={profile.platform}
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{profile.platform}</div>
                          {profile.followers && (
                            <div className="text-sm text-gray-500">{profile.followers.toLocaleString()} 팔로워</div>
                          )}
                        </div>
                        {profile.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* 추천 프리랜서 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">비슷한 프리랜서</h3>
                <div className="space-y-4">
                  {freelancer.similarFreelancers.map(similar => (
                    <Link
                      key={similar.id}
                      href={`/freelancer/${similar.id}`}
                      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {similar.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                            {similar.name}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-1">
                            {similar.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(similar.rating, 'sm')}
                            <span className="text-xs text-gray-500">
                              {similar.completedProjects}개 완료
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {similar.hourlyRate.toLocaleString()}원/시간
                            </span>
                            <span className="text-xs text-green-600 dark:text-green-400">
                              매칭도 {similar.matchingScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Q&A 섹션 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">자주 묻는 질문</h3>
                <div className="space-y-4">
                  {freelancer.qaSection.map(qa => (
                    <div key={qa.id} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                        Q. {qa.question}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        A. {qa.answer}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{qa.upvotes}</span>
                        <span>•</span>
                        <span>{qa.answeredAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 보안 배지 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">인증 배지</h3>
                <div className="grid grid-cols-2 gap-3">
                  {freelancer.verificationStatus.emailVerified && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">이메일 인증</span>
                    </div>
                  )}
                  {freelancer.verificationStatus.phoneVerified && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">전화 인증</span>
                    </div>
                  )}
                  {freelancer.verificationStatus.identityVerified && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">신원 인증</span>
                    </div>
                  )}
                  {freelancer.verificationStatus.paymentVerified && (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">결제 인증</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">보안 거래 보장</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    모든 거래는 에스크로 시스템으로 보호됩니다
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      
      {/* 프로젝트 제안 모달 */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">프로젝트 제안하기</h3>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleProjectSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    프로젝트 제목 *
                  </label>
                  <input 
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="프로젝트 제목을 입력해주세요"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      예상 예산 *
                    </label>
                    <select 
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">예산을 선택해주세요</option>
                      <option value="100-500">100만원 - 500만원</option>
                      <option value="500-1000">500만원 - 1000만원</option>
                      <option value="1000-3000">1000만원 - 3000만원</option>
                      <option value="3000+">3000만원 이상</option>
                      <option value="discuss">협의 필요</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      예상 기간 *
                    </label>
                    <select 
                      value={projectForm.timeline}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, timeline: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">기간을 선택해주세요</option>
                      <option value="1week">1주 이내</option>
                      <option value="1month">1개월 이내</option>
                      <option value="3months">3개월 이내</option>
                      <option value="6months">6개월 이내</option>
                      <option value="longer">6개월 이상</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    프로젝트 상세 설명 *
                  </label>
                  <textarea 
                    rows={6}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="프로젝트에 대한 상세한 설명을 입력해주세요..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    요구사항 및 기술 스택
                  </label>
                  <textarea 
                    rows={4}
                    value={projectForm.requirements}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, requirements: e.target.value }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="필요한 기술 스택, 특별 요구사항 등을 입력해주세요..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    첨부 파일
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <input 
                      type="file"
                      multiple
                      onChange={(e) => setProjectForm(prev => ({ ...prev, attachments: Array.from(e.target.files || []) }))}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
                        <FileText className="w-full h-full" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">파일을 드래그하거나 클릭해서 업로드</p>
                      <p className="text-gray-500 text-sm mt-1">PDF, DOC, 이미지 파일 등</p>
                    </label>
                  </div>
                  {projectForm.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {projectForm.attachments.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FileText className="w-4 h-4" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    제안서 전송
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 실시간 채팅 모달 */}
      {showChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {freelancer.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{freelancer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    온라인
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowChatModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>대화를 시작해보세요!</p>
                  </div>
                ) : (
                  chatMessages.map(message => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        <p>{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 포트폴리오 상세 모달 */}
      {showPortfolioModal && selectedPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedPortfolio.title}</h3>
                <button 
                  onClick={() => setShowPortfolioModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                    <Image
                      src={selectedPortfolio.imageUrl}
                      alt={selectedPortfolio.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    {selectedPortfolio.projectUrl && (
                      <a
                        href={selectedPortfolio.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        프로젝트 보기
                      </a>
                    )}
                    {selectedPortfolio.githubUrl && (
                      <a
                        href={selectedPortfolio.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        코드 보기
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">프로젝트 개요</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selectedPortfolio.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">기간</h5>
                      <p className="text-gray-600 dark:text-gray-300">{selectedPortfolio.duration}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">팀 규모</h5>
                      <p className="text-gray-600 dark:text-gray-300">{selectedPortfolio.teamSize}명</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">역할</h5>
                      <p className="text-gray-600 dark:text-gray-300">{selectedPortfolio.role}</p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">카테고리</h5>
                      <p className="text-gray-600 dark:text-gray-300">{selectedPortfolio.category}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">사용 기술</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedPortfolio.technologies.map(tech => (
                        <span key={tech} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">주요 성과</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                      {selectedPortfolio.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">주요 도전과제</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                      {selectedPortfolio.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">해결 방안</h5>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                      {selectedPortfolio.solutions.map((solution, index) => (
                        <li key={index}>{solution}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {selectedPortfolio.testimonial && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">클라이언트 추천사</h5>
                      <p className="text-gray-600 dark:text-gray-300 italic mb-3">
                        "{selectedPortfolio.testimonial.text}"
                      </p>
                      <p className="text-sm text-gray-500">
                        - {selectedPortfolio.testimonial.clientName}, {selectedPortfolio.testimonial.clientPosition} at {selectedPortfolio.testimonial.clientCompany}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 화상 상담 예약 모달 */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">화상 상담 예약</h3>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    상담 날짜
                  </label>
                  <input 
                    type="date"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    상담 시간
                  </label>
                  <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">시간을 선택해주세요</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    상담 주제
                  </label>
                  <textarea 
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="상담하고 싶은 내용을 간단히 적어주세요"
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    취소
                  </button>
                  <button 
                    onClick={() => {
                      setShowScheduleModal(false);
                      alert('상담 예약이 완료되었습니다!');
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    예약하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}