

export const stats: Stat[] = [
  { id: 1, label: '등록된 프리랜서', value: '14,500+', icon: '👥' },
  { id: 2, label: '진행중인 프로젝트', value: '2,300+', icon: '💼' },
  { id: 3, label: '완료된 프로젝트', value: '32,400+', icon: '🏆' },
  { id: 4, label: '월 평균 계약금액', value: '800만원+', icon: '📊' },
];

export const categories = [
  { id: 1, name: '웹 개발', imageUrl: '/images/category-web.jpg', count: 254, tab: '개발자', bgGradient: 'from-blue-500 to-indigo-700 dark:from-blue-700 dark:to-indigo-900' },
  { id: 2, name: '앱 개발', imageUrl: '/images/category-app.jpg', count: 189, tab: '개발자', bgGradient: 'from-indigo-500 to-purple-700 dark:from-indigo-700 dark:to-purple-900' },
  { id: 3, name: '디자인', imageUrl: '/images/category-design.jpg', count: 176, tab: '디자이너', bgGradient: 'from-purple-500 to-pink-700 dark:from-purple-700 dark:to-pink-900' },
  { id: 4, name: '마케팅', imageUrl: '/images/category-marketing.jpg', count: 143, tab: '기타', bgGradient: 'from-pink-500 to-red-700 dark:from-pink-700 dark:to-red-900' },
  { id: 5, name: '콘텐츠 제작', imageUrl: '/images/category-content.jpg', count: 128, tab: '기타', bgGradient: 'from-orange-500 to-yellow-700 dark:from-orange-700 dark:to-amber-900' },
  { id: 6, name: '기획/PM', imageUrl: '/images/category-planning.jpg', count: 97, tab: 'PM/PL', bgGradient: 'from-green-500 to-teal-700 dark:from-green-700 dark:to-teal-900' },
];



export const featuredProjects: FeaturedProject[] = [
  {
    id: 1,
    title: '블록체인 기반 핀테크 서비스 앱 개발',
    company: '(주)디지털페이',
    budget: '5,000만원',
    duration: '6개월',
    skills: ['React Native', 'Node.js', 'Blockchain'],
    type: '재택',
    deadline: '2025.03.15',
  },
  {
    id: 2,
    title: '대형 커머스 플랫폼 리뉴얼 프로젝트',
    company: '(주)쇼핑몰파트너스',
    budget: '4,000만원',
    duration: '4개월',
    skills: ['React.js', 'TypeScript', 'Next.js'],
    type: '상주',
    deadline: '2025.03.05',
  },
  {
    id: 3,
    title: '글로벌 마케팅 대시보드 구축',
    company: '(주)글로벌마케팅그룹',
    budget: '3,500만원',
    duration: '3개월',
    skills: ['Vue.js', 'D3.js', 'Firebase'],
    type: '재택',
    deadline: '2025.02.28',
  },
];

import { FeaturedFreelancer } from '@/types/freelancer';
import { FeaturedProject, HeroProject } from '@/types/project';
import { Stat, Testimonial } from '@/types';


// ... (생략)

export const featuredFreelancers: FeaturedFreelancer[] = [
  {
    id: 1,
    name: '김개발',
    position: '풀스택 개발자',
    experience: '10년+',
    skills: ['React', 'Node.js', 'AWS'],
    avatar: '/images/freelancer1.jpg',
    rating: 4.9,
  },
  {
    id: 2,
    name: '이디자인',
    position: 'UX/UI 디자이너',
    experience: '8년+',
    skills: ['Figma', 'Adobe XD', 'Photoshop'],
    avatar: '/images/freelancer2.jpg',
    rating: 4.8,
  },
  {
    id: 3,
    name: '박기획',
    position: '프로젝트 매니저',
    experience: '12년+',
    skills: ['기획', 'JIRA', 'Scrum'],
    avatar: '/images/freelancer3.jpg',
    rating: 4.9,
  },
  {
    id: 4,
    name: '최마케팅',
    position: '디지털 마케터',
    experience: '7년+',
    skills: ['SEO', '소셜미디어', '콘텐츠 마케팅'],
    avatar: '/images/freelancer4.jpg',
    rating: 4.7,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: '황시현',
    position: '프리랜서 대표이사 CEO',
    quote: '프리랜서로 일하면서 가장 힘든 건 좋은 프로젝트를 찾는 것이었는데, 여기서는 AI가 제 경력과 스킬에 맞는 프로젝트를 추천해줘서 정말 편해요.',
    avatar: '/images/testimonial1.jpg',
  },
  {
    id: 2,
    name: '류대리',
    position: '프리랜서 5개월차',
    quote: '이전에는 단가가 불투명하고 대금 지급도 불안했는데, 이 플랫폼을 통해 안전하게 일할 수 있게 되었습니다. 강력 추천합니다!',
    avatar: '/images/testimonial2.jpg',
  },
  {
    id: 3,
    name: '조스타트',
    position: '스타트업 대표',
    quote: '덕분에 일찾기이 때보다 2배는 더 벌고 있어요. 무엇보다 제 실력을 제대로 인정받는느낌이 좋습니다.',
    avatar: '/images/testimonial3.jpg',
  },
];

export const heroProjects: HeroProject[] = [
  {
    id: 1,
    title: '블록체인 기반 핀테크 앱 개발',
    company: '(주)디지털페이',
    budget: '5,000만원',
    duration: '6개월',
    skills: ['React Native', 'Blockchain', 'Node.js'],
    bgColor: 'from-purple-600 to-indigo-700',
  },
  {
    id: 2,
    title: '대형 커머스 플랫폼 리뉴얼',
    company: '(주)쇼핑몰파트너스',
    budget: '4,000만원',
    duration: '4개월',
    skills: ['React.js', 'TypeScript', 'Next.js'],
    bgColor: 'from-blue-600 to-indigo-700',
  },
  {
    id: 3,
    title: '글로벌 마케팅 대시보드 구축',
    company: '(주)글로벌마케팅그룹',
    budget: '3,500만원',
    duration: '3개월',
    skills: ['Vue.js', 'D3.js', 'Firebase'],
    bgColor: 'from-cyan-600 to-blue-700',
  },
  {
    id: 4,
    title: 'AI 기반 추천 시스템 개발',
    company: '(주)테크인사이트',
    budget: '4,500만원',
    duration: '5개월',
    skills: ['Python', 'TensorFlow', 'AWS'],
    bgColor: 'from-pink-600 to-purple-700',
  },
  {
    id: 5,
    title: '메타버스 플랫폼 개발',
    company: '(주)메타랩스',
    budget: '8,000만원',
    duration: '6개월',
    skills: ['Unity', 'WebGL', 'Three.js'],
    bgColor: 'from-indigo-600 to-violet-700',
  },
];
