'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoading } from '@/components/layout/Loading';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useAuthStore } from '@/store/auth';
import BlogMenuSearch from '@/components/blog/BlogMenuSearch';
import { formatDate } from '@/utils/format';
// 숫자 포맷팅 함수
const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
};

type Post = {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  thumbnail: string;
  views: number;
  date: string;
  category: string;
};

type CategoryContent = {
  title: string;
  posts: Post[];
};

type Section = {
  title: string;
  posts: Post[];
};

// 공유 모달 컴포넌트
const ShareModal = ({ isOpen, onClose, post }: { isOpen: boolean; onClose: () => void; post: Post }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/blog/posts/${post.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async (platform: string) => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const shareUrls: Record<string, string> = {
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`,
          kakao: `https://story.kakao.com/share?url=${encodeURIComponent(shareUrl)}`,
        };
        window.open(shareUrls[platform]);
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white">공유하기</h3>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 text-sm text-gray-600 dark:text-gray-300 dark:text-gray-300 bg-transparent"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {copied ? '복사됨!' : '복사'}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {['twitter', 'facebook', 'linkedin', 'kakao'].map(platform => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="flex flex-col items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className={`w-6 h-6 ${platform === 'twitter' ? 'text-blue-400' : platform === 'facebook' ? 'text-blue-600' : platform === 'linkedin' ? 'text-blue-700' : 'text-yellow-500'}`} fill="currentColor" viewBox="0 0 24 24">
                  {/* SVG paths for each platform */}
                </svg>
                <span className="text-xs text-gray-600 dark:text-gray-300 dark:text-gray-300 mt-1">{platform === 'twitter' ? '트위터' : platform === 'facebook' ? '페이스북' : platform === 'linkedin' ? '링크드인' : '카카오'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BlogPage() {
  const { setLoading } = useLoading();
  const { isLoggedIn } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState<string>('ALL NEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [shareModal, setShareModal] = useState<{ isOpen: boolean; post: Post | null }>({
    isOpen: false,
    post: null,
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // 초기 로딩 처리 (2초)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [setLoading]);



  // 카테고리별 게시물 데이터
  const categoryPosts = [
    { title: '개발 테크', slug: 'development-tech', thumbnail: '/images/blog/categories/dev-tech.jpg', postCount: 128 },
    { title: '디자인 테크', slug: 'design-tech', thumbnail: '/images/blog/categories/design-tech.jpg', postCount: 85 },
    { title: '인사 테크', slug: 'hr-tech', thumbnail: '/images/blog/categories/hr-tech.jpg', postCount: 64 },
    { title: '홍보 & 마케팅 테크', slug: 'marketing-tech', thumbnail: '/images/blog/categories/marketing-tech.jpg', postCount: 92 },
    { title: '물류 테크', slug: 'logistics-tech', thumbnail: '/images/blog/categories/logistics-tech.jpg', postCount: 73 },
    { title: '전략 테크', slug: 'strategy-tech', thumbnail: '/images/blog/categories/strategy-tech.jpg', postCount: 45 },
    { title: '제조 테크', slug: 'manufacturing-tech', thumbnail: '/images/blog/categories/manufacturing-tech.jpg', postCount: 56 },
    { title: '밸런스 UP', slug: 'balance-up', thumbnail: '/images/blog/categories/balance-up.jpg', postCount: 112 },
    { title: '박우찬 칼럼', slug: 'woochan-column', thumbnail: '/images/blog/categories/woochan-column.jpg', postCount: 24 },
    { title: '실리콘밸리 AI 칼럼', slug: 'silicon-valley-ai', thumbnail: '/images/blog/categories/silicon-valley-ai.jpg', postCount: 31 },
  ];

  // 섹션별 데이터 구조
  const sections: Section[] = [
    {
      title: '최근 추천 게시물',
      posts: [
        {
          id: 'featured-1',
          title: 'SCM이란? 뭣부터 최적화 과정까지 한 번에 이해하기',
          excerpt: '제품을 생산하기 위해서는 다양한 자재와 부품이 필요하며, 여러 공급업체와 협력에 반드시 납기, 일정 등을 조율해야 합니다.',
          tags: ['#비즈니스TIP', '#공급망최적화', '#자재관리', '#최고운영'],
          thumbnail: '/images/blog/supply-chain.jpg',
          views: 74,
          date: '4일 전',
          category: '물류 테크',
        },
        {
          id: 'featured-2',
          title: 'MSP & CSP에 따른 클라우드 엔지니어의 종류와 역할',
          excerpt: '클라우드 마이그레이션이 본격화되면서 많은 기업이 기존 온프레미스 환경에서 클라우드로 IT 인프라를 이전하고 있습니다.',
          tags: ['#비즈니스TIP', '#클라우드서비스', '#클라우드전문가', '#채용노하우'],
          thumbnail: '/images/blog/cloud-engineering.jpg',
          views: 9,
          date: '5시간 전',
          category: '인사 테크',
        },
        {
          id: 'featured-3',
          title: 'Claude AI 활용도를 높이는 프롬프트 사용법 7가지',
          excerpt: '생성형 AI 기술은 빠르게 발전하며 우리의 일상과 업무 방식에 큰 변화를 가져오고 있습니다.',
          tags: ['#비즈니스TIP', '#생성형AI', '#AI활용법', '#AI워크플로우'],
          thumbnail: '/images/blog/claude-ai.jpg',
          views: 1939,
          date: '15일 전',
          category: '밸런스 UP',
        },
      ],
    },
    {
      title: '물류 테크',
      posts: [
        {
          id: '1',
          title: 'SCM이란? 뭣부터 최적화 과정까지 한 번에 이해하기',
          excerpt: '제품을 생산하기 위해서는 다양한 자재와 부품이 필요하며, 여러 공급업체와 협력에 반드시 납기, 일정 등을 조율해야 합니다.',
          tags: ['#비즈니스TIP', '#공급망최적화', '#자재관리', '#최고운영'],
          thumbnail: '/images/blog/scm.jpg',
          views: 74,
          date: '4일 전',
          category: '물류 테크',
        },
      ],
    },
    {
      title: '인사 테크',
      posts: [
        {
          id: '2',
          title: 'MSP & CSP에 따른 클라우드 엔지니어의 종류와 역할',
          excerpt: '클라우드 마이그레이션이 본격화되면서 많은 기업이 기존 온프레미스 환경에서 클라우드로 IT 인프라를 이전하고 있습니다.',
          tags: ['#비즈니스TIP', '#클라우드서비스', '#클라우드전문가', '#채용노하우'],
          thumbnail: '/images/blog/cloud.jpg',
          views: 9,
          date: '5시간 전',
          category: '인사 테크',
        },
      ],
    },
  ];

  // 블로그 포스트 데이터 로드
  const { posts } = useBlogPosts({ length: 12 });

  // 포스트 필터링
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = activeCategory === 'ALL NEW' || post.category === activeCategory;
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeCategory, searchQuery]);

  // 스크롤 위치 추적
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 슬라이더 이동 함수
  const handleSlideChange = (direction: 'prev' | 'next') => {
    setSlideIndex(prev => direction === 'prev' ? Math.max(prev - 1, 0) : Math.min(prev + 1, Math.ceil(categoryPosts.length / 4) - 1));
  };

  // 카테고리별 슬라이더 인덱스 상태
  const [categorySlideIndices, setCategorySlideIndices] = useState<{ [key: string]: number }>({
    development: 0, design: 0, hr: 0, marketing: 0,
    logistics: 0, strategy: 0, manufacturing: 0,
    balance: 0, woohan: 0, silicon: 0,
  });

  // 슬라이더 최대 페이지 수 계산
  const calculateMaxSlides = (postsLength: number) => Math.max(0, Math.ceil(postsLength / 4) - 1);

  // 카테고리별 슬라이더 이동 함수
  const handleCategorySlide = (category: keyof typeof categoryContents, direction: 'prev' | 'next') => {
    setCategorySlideIndices(prev => ({
      ...prev,
      [category]: direction === 'prev' 
        ? Math.max(prev[category] - 1, 0)
        : Math.min(prev[category] + 1, calculateMaxSlides(categoryContents[category].posts.length)),
    }));
  };

  const categoryContents: Record<string, CategoryContent> = {
    development: { 
      title: '개발 테크', 
      posts: [
        {
          id: 'dev-1',
          title: '왜 많은 개발자들이 Rust(러스트)로 이동할까?',
          excerpt: 'Rust의 안전성과 성능이 개발자들의 관심을 끌고 있습니다.',
          thumbnail: '/images/blog/categories/dev-tech.jpg',
          date: '2024-03-20',
          views: 1234,
          tags: ['#Rust', '#프로그래밍언어', '#개발트렌드'],
          category: '개발 테크',
        },
        {
          id: 'dev-2',
          title: 'Next.js 14의 새로운 기능 살펴보기',
          excerpt: 'Next.js 14에서 추가된 주요 기능들을 소개합니다.',
          thumbnail: '/images/blog/categories/dev-tech.jpg',
          date: '2024-03-19',
          views: 856,
          tags: ['#Next.js', '#React', '#웹개발'],
          category: '개발 테크',
        },
        {
          id: 'dev-3',
          title: 'TypeScript 5.0의 주요 변경사항',
          excerpt: 'TypeScript 5.0에서 개선된 타입 시스템과 새로운 기능을 알아봅니다.',
          thumbnail: '/images/blog/categories/dev-tech.jpg',
          date: '2024-03-18',
          views: 654,
          tags: ['#TypeScript', '#타입스크립트', '#개발도구'],
          category: '개발 테크',
        },
      ],
    },
    design: { 
      title: '디자인 테크', 
      posts: [
        {
          id: 'design-1',
          title: '15년 경력 UX 디자이너가 경험한 UX 디자인 프로세스',
          excerpt: '실무에서 활용하는 UX 디자인 프로세스와 노하우를 공유합니다.',
          thumbnail: '/images/blog/categories/design-tech.jpg',
          date: '2024-03-20',
          views: 987,
          tags: ['#UX디자인', '#디자인프로세스', '#디자인노하우'],
          category: '디자인 테크',
        },
        {
          id: 'design-2',
          title: 'Figma를 활용한 디자인 시스템 구축',
          excerpt: 'Figma를 사용하여 효율적인 디자인 시스템을 구축하는 방법을 소개합니다.',
          thumbnail: '/images/blog/categories/design-tech.jpg',
          date: '2024-03-19',
          views: 765,
          tags: ['#Figma', '#디자인시스템', '#UI디자인'],
          category: '디자인 테크',
        },
        {
          id: 'design-3',
          title: '디자인 토큰의 이해와 활용',
          excerpt: '디자인 시스템의 일관성을 유지하는 디자인 토큰에 대해 알아봅니다.',
          thumbnail: '/images/blog/categories/design-tech.jpg',
          date: '2024-03-18',
          views: 543,
          tags: ['#디자인토큰', '#디자인시스템', '#디자인개발'],
          category: '디자인 테크',
        },
      ],
    },
    hr: { 
      title: '인사 테크', 
      posts: [
        {
          id: 'hr-1',
          title: '인공지능 기반 채용 시스템 도입 성공사례',
          excerpt: 'AI를 활용한 채용 프로세스 개선 사례를 소개합니다.',
          thumbnail: '/images/blog/categories/hr-tech.jpg',
          date: '2024-03-20',
          views: 876,
          tags: ['#AI채용', '#HR테크', '#채용시스템'],
          category: '인사 테크',
        },
        {
          id: 'hr-2',
          title: '하이브리드 근무 환경의 HR 관리',
          excerpt: '하이브리드 근무 환경에서의 효과적인 HR 관리 방안을 제시합니다.',
          thumbnail: '/images/blog/categories/hr-tech.jpg',
          date: '2024-03-19',
          views: 654,
          tags: ['#하이브리드근무', '#HR관리', '#근무환경'],
          category: '인사 테크',
        },
        {
          id: 'hr-3',
          title: '디지털 HR 플랫폼 도입 가이드',
          excerpt: 'HR 프로세스 디지털화를 위한 플랫폼 선택과 도입 방법을 안내합니다.',
          thumbnail: '/images/blog/categories/hr-tech.jpg',
          date: '2024-03-18',
          views: 432,
          tags: ['#HR플랫폼', '#디지털HR', '#HR테크'],
          category: '인사 테크',
        },
      ],
    },
    marketing: { 
      title: '홍보&마케팅 테크', 
      posts: [
        {
          id: 'marketing-1',
          title: '마케팅 자동화 툴 도입으로 성과 300% 향상',
          excerpt: '마케팅 자동화 도구를 활용한 성과 개선 사례를 공유합니다.',
          thumbnail: '/images/blog/categories/marketing-tech.jpg',
          date: '2024-03-20',
          views: 1123,
          tags: ['#마케팅자동화', '#디지털마케팅', '#마케팅성과'],
          category: '홍보 & 마케팅 테크',
        },
        {
          id: 'marketing-2',
          title: '데이터 기반 마케팅 전략 수립',
          excerpt: '데이터를 활용한 효과적인 마케팅 전략 수립 방법을 소개합니다.',
          thumbnail: '/images/blog/categories/marketing-tech.jpg',
          date: '2024-03-19',
          views: 876,
          tags: ['#데이터마케팅', '#마케팅전략', '#데이터분석'],
          category: '홍보 & 마케팅 테크',
        },
        {
          id: 'marketing-3',
          title: '소셜 미디어 마케팅 트렌드',
          excerpt: '2024년 소셜 미디어 마케팅의 주요 트렌드를 분석합니다.',
          thumbnail: '/images/blog/categories/marketing-tech.jpg',
          date: '2024-03-18',
          views: 654,
          tags: ['#소셜마케팅', '#마케팅트렌드', '#디지털마케팅'],
          category: '홍보 & 마케팅 테크',
        },
      ],
    },
    logistics: { 
      title: '물류 테크', 
      posts: [
        {
          id: 'logistics-1',
          title: '스마트 물류 시스템 구축 가이드',
          excerpt: '최신 기술을 활용한 스마트 물류 시스템 구축 방법을 안내합니다.',
          thumbnail: '/images/blog/categories/logistics-tech.jpg',
          date: '2024-03-20',
          views: 765,
          tags: ['#스마트물류', '#물류시스템', '#물류테크'],
          category: '물류 테크',
        },
        {
          id: 'logistics-2',
          title: '물류 자동화 솔루션 비교',
          excerpt: '주요 물류 자동화 솔루션들의 특징과 장단점을 비교 분석합니다.',
          thumbnail: '/images/blog/categories/logistics-tech.jpg',
          date: '2024-03-19',
          views: 543,
          tags: ['#물류자동화', '#물류솔루션', '#물류최적화'],
          category: '물류 테크',
        },
        {
          id: 'logistics-3',
          title: '스마트 창고 관리 시스템',
          excerpt: '스마트 창고 관리 시스템의 구축과 운영 방법을 소개합니다.',
          thumbnail: '/images/blog/categories/logistics-tech.jpg',
          date: '2024-03-18',
          views: 432,
          tags: ['#스마트창고', '#창고관리', '#물류시스템'],
          category: '물류 테크',
        },
      ],
    },
    strategy: { 
      title: '전략 테크', 
      posts: [
        {
          id: 'strategy-1',
          title: '디지털 트랜스포메이션 전략 수립',
          excerpt: '효과적인 디지털 전환 전략 수립 방법을 안내합니다.',
          thumbnail: '/images/blog/categories/strategy-tech.jpg',
          date: '2024-03-20',
          views: 987,
          tags: ['#디지털전환', '#전략수립', '#디지털혁신'],
          category: '전략 테크',
        },
        {
          id: 'strategy-2',
          title: '비즈니스 모델 혁신 사례',
          excerpt: '디지털 시대의 성공적인 비즈니스 모델 혁신 사례를 분석합니다.',
          thumbnail: '/images/blog/categories/strategy-tech.jpg',
          date: '2024-03-19',
          views: 765,
          tags: ['#비즈니스모델', '#혁신사례', '#디지털비즈니스'],
          category: '전략 테크',
        },
        {
          id: 'strategy-3',
          title: '디지털 전환 성공 요인',
          excerpt: '디지털 전환 성공을 위한 핵심 요인들을 소개합니다.',
          thumbnail: '/images/blog/categories/strategy-tech.jpg',
          date: '2024-03-18',
          views: 543,
          tags: ['#디지털전환', '#성공요인', '#디지털전략'],
          category: '전략 테크',
        },
      ],
    },
    manufacturing: { 
      title: '제조 테크', 
      posts: [
        {
          id: 'manufacturing-1',
          title: '스마트 팩토리 구축 성공 사례',
          excerpt: '스마트 팩토리 구축의 성공 사례와 노하우를 공유합니다.',
          thumbnail: '/images/blog/categories/manufacturing-tech.jpg',
          date: '2024-03-20',
          views: 876,
          tags: ['#스마트팩토리', '#제조혁신', '#스마트제조'],
          category: '제조 테크',
        },
        {
          id: 'manufacturing-2',
          title: '제조 공정 자동화 전략',
          excerpt: '제조 공정 자동화를 위한 전략과 구축 방법을 소개합니다.',
          thumbnail: '/images/blog/categories/manufacturing-tech.jpg',
          date: '2024-03-19',
          views: 654,
          tags: ['#공정자동화', '#제조자동화', '#스마트제조'],
          category: '제조 테크',
        },
        {
          id: 'manufacturing-3',
          title: '스마트 제조 기술 트렌드',
          excerpt: '최신 스마트 제조 기술 트렌드를 분석합니다.',
          thumbnail: '/images/blog/categories/manufacturing-tech.jpg',
          date: '2024-03-18',
          views: 432,
          tags: ['#제조트렌드', '#스마트제조', '#제조기술'],
          category: '제조 테크',
        },
      ],
    },
    balance: { 
      title: '밸런스 UP', 
      posts: [
        {
          id: 'balance-1',
          title: '개발자의 일과 삶의 균형 찾기',
          excerpt: '개발자의 건강한 일과 삶의 균형을 위한 조언을 제시합니다.',
          thumbnail: '/images/blog/categories/balance-up.jpg',
          date: '2024-03-20',
          views: 1123,
          tags: ['#워라밸', '#개발자문화', '#일과삶의균형'],
          category: '밸런스 UP',
        },
        {
          id: 'balance-2',
          title: '재택근무 생산성 향상 팁',
          excerpt: '효과적인 재택근무를 위한 생산성 향상 방법을 소개합니다.',
          thumbnail: '/images/blog/categories/balance-up.jpg',
          date: '2024-03-19',
          views: 876,
          tags: ['#재택근무', '#생산성향상', '#원격근무'],
          category: '밸런스 UP',
        },
        {
          id: 'balance-3',
          title: '디지털 피로도 관리',
          excerpt: '디지털 환경에서의 피로도 관리 방법을 안내합니다.',
          thumbnail: '/images/blog/categories/balance-up.jpg',
          date: '2024-03-18',
          views: 654,
          tags: ['#디지털피로도', '#피로도관리', '#건강관리'],
          category: '밸런스 UP',
        },
      ],
    },
    woohan: { 
      title: '박우찬 컬럼', 
      posts: [
        {
          id: 'woochan-1',
          title: '스타트업 성장을 위한 기술 전략',
          excerpt: '스타트업의 성장을 위한 기술 전략 수립 방법을 제시합니다.',
          thumbnail: '/images/blog/categories/woochan-column.jpg',
          date: '2024-03-20',
          views: 987,
          tags: ['#스타트업', '#기술전략', '#성장전략'],
          category: '박우찬 칼럼',
        },
        {
          id: 'woochan-2',
          title: '디지털 혁신 리더십',
          excerpt: '디지털 시대의 효과적인 리더십 방식을 소개합니다.',
          thumbnail: '/images/blog/categories/woochan-column.jpg',
          date: '2024-03-19',
          views: 765,
          tags: ['#디지털리더십', '#리더십', '#디지털혁신'],
          category: '박우찬 칼럼',
        },
        {
          id: 'woochan-3',
          title: '기술 스타트업 투자 전략',
          excerpt: '기술 스타트업 투자 시 고려해야 할 요소들을 분석합니다.',
          thumbnail: '/images/blog/categories/woochan-column.jpg',
          date: '2024-03-18',
          views: 543,
          tags: ['#스타트업투자', '#투자전략', '#기술투자'],
          category: '박우찬 칼럼',
        },
      ],
    },
    silicon: { 
      title: '실리콘밸리 AI 컬럼', 
      posts: [
        {
          id: 'silicon-1',
          title: '실리콘밸리의 최신 AI 트렌드',
          excerpt: '실리콘밸리에서 주목받는 AI 기술 트렌드를 소개합니다.',
          thumbnail: '/images/blog/categories/silicon-valley-ai.jpg',
          date: '2024-03-20',
          views: 1123,
          tags: ['#AI트렌드', '#실리콘밸리', '#AI기술'],
          category: '실리콘밸리 AI 칼럼',
        },
        {
          id: 'silicon-2',
          title: 'AI 스타트업 투자 동향',
          excerpt: '실리콘밸리 AI 스타트업 투자 동향을 분석합니다.',
          thumbnail: '/images/blog/categories/silicon-valley-ai.jpg',
          date: '2024-03-19',
          views: 876,
          tags: ['#AI스타트업', '#투자동향', '#실리콘밸리'],
          category: '실리콘밸리 AI 칼럼',
        },
        {
          id: 'silicon-3',
          title: 'AI 기술 혁신과 미래',
          excerpt: 'AI 기술의 발전 방향과 미래 전망을 제시합니다.',
          thumbnail: '/images/blog/categories/silicon-valley-ai.jpg',
          date: '2024-03-18',
          views: 654,
          tags: ['#AI혁신', '#AI미래', '#기술전망'],
          category: '실리콘밸리 AI 칼럼',
        },
      ],
    },
  };

  const handleShareClick = (post: Post) => {
    setShareModal({ isOpen: true, post });
  };

  if (isInitialLoading) {
    return null; // Loading component will be shown by LoadingProvider
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 dark:bg-gray-900 transition-colors duration-300">
      {/* 헤더 섹션 */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white dark:text-white mb-2">Blog. 전체</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 dark:text-gray-300">잡코아 빌보드 블로그에서만 볼 수 있는 최신 IT 컨텐츠를 만나보세요.</p>
        </div>
      </header>

      <BlogMenuSearch currentPage="all" /> 

      {/* 블로그 섹션들 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {sections.map((section, index) => (
          <section key={section.title} className={`mb-12 ${index === 0 ? 'mt-4' : ''}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white dark:text-white">{section.title}</h2>
              <Link href={`/blog/${section.title.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:text-white dark:hover:text-white flex items-center transition-colors">
                더보기
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
      
            {index === 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
                <div className="space-y-6">
                  {section.posts.map((post) => (
                    <div key={post.id} className="flex gap-6 bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 dark:hover:shadow-gray-900/50 transition-all duration-300 p-4">
                      <Link href={`/blog/posts/${post.id}`} className="flex gap-6 w-full">
                        <div className="relative w-64 h-40 flex-shrink-0">
                          <Image src={post.thumbnail} alt={post.title} fill className="object-cover rounded-lg" />
                        </div>
                        <div className="flex-1">
                          {post.category && (
                            <span className="inline-block px-2 py-1 text-sm font-medium bg-blue-600 dark:bg-blue-700 text-white rounded-full mb-3">
                              {post.category}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white dark:text-white mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-300 mb-3 line-clamp-2">{post.excerpt}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map((tag) => (
                              <span key={tag} className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{tag}</span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-4">
                              <span>{formatDate(post.date)}</span>
                              <span>조회수 {formatNumber(post.views)}</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                handleShareClick(post);
                              }} 
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded-full transition-colors"
                            >
                              <Image src="/images/icons/share.svg" alt="공유하기" width={20} height={20} className="opacity-50" />
                            </button>
                          </div>
                        </div>
                      </Link>
                  </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.posts.map((post) => (
                  <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow">
                    <Link href={`/blog/posts/${post.id}`}>
                      <div className="relative h-48">
                        <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <span key={tag} className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-4">
                    <span>{formatDate(post.date)}</span>
                            <span>조회수 {formatNumber(post.views)}</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              handleShareClick(post);
                            }} 
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded-full transition-colors"
                          >
                            <Image src="/images/icons/share.svg" alt="공유하기" width={20} height={20} className="opacity-50" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* 카테고리별 게시물 섹션 */}
        {Object.entries(categoryContents).map(([key, category]) => (
          <section key={key} className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
              <Link href={`/blog/category/${key}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:text-white flex items-center">
                더보기
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.posts.map((post) => (
                <div key={post.id} className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Link href={`/blog/posts/${post.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.thumbnail} 
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white text-lg font-bold">{post.title}</h3>
                          <p className="text-white/90 text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                        </div>
                  </div>
                </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags?.map((tag) => (
                          <span key={tag} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{tag}</span>
                    ))}
                  </div>
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span>{formatDate(post.date)}</span>
                          <span>조회수 {formatNumber(post.views)}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleShareClick(post);
                          }} 
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 rounded-full transition-colors"
                        >
                          <Image src="/images/icons/share.svg" alt="공유하기" width={20} height={20} className="opacity-50" />
                        </button>
                </div>
              </div>
            </Link>
                </div>
          ))}
        </div>
          </section>
        ))}
      </div>

      {/* 공유 모달 */}
      {shareModal.isOpen && shareModal.post && (
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false, post: null })}
          post={shareModal.post}
        />
      )}

      {/* CTA 섹션 - 로그인하지 않은 사용자에게만 표시 */}
      {!isLoggedIn && (
        <section className="bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-gray-800 dark:to-gray-700 text-white py-16 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">지금 시작하세요</h2>
            <p className="text-xl text-blue-100 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              프리랜서와 기업 모두에게 최고의 경험을 제공하는 잡코리아 빌보드에서
              당신의 성공 스토리를 시작하세요.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="bg-white dark:bg-gray-700 text-blue-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-600 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl">
                회원가입
              </Link>
              <Link href="/login" className="bg-transparent border-2 border-white text-white hover:bg-white dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-white px-8 py-4 rounded-lg font-bold text-lg transition-all">
                로그인
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
} 