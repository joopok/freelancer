// 통계 데이터
export const stats = [
  { id: 1, label: '등록된 프리랜서', value: '14,500+', icon: '👥' },
  { id: 2, label: '진행중인 프로젝트', value: '2,300+', icon: '💼' },
  { id: 3, label: '완료된 프로젝트', value: '32,400+', icon: '🏆' },
  { id: 4, label: '월 평균 계약금액', value: '800만원+', icon: '📊' },
];

// 카테고리 목록
export const categories = [
  { id: 1, name: '웹 개발', imageUrl: '/images/category-web.jpg', count: 254 },
  { id: 2, name: '앱 개발', imageUrl: '/images/category-app.jpg', count: 189 },
  { id: 3, name: '디자인', imageUrl: '/images/category-design.jpg', count: 176 },
  { id: 4, name: '마케팅', imageUrl: '/images/category-marketing.jpg', count: 143 },
  { id: 5, name: '콘텐츠 제작', imageUrl: '/images/category-content.jpg', count: 128 },
  { id: 6, name: '기획/PM', imageUrl: '/images/category-planning.jpg', count: 97 },
];

// 추천 프로젝트
export const featuredProjects = [
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

// 추천 프리랜서
export const featuredFreelancers = [
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

// 사용자 후기
export const testimonials = [
  {
    id: 1,
    name: '정서비스',
    position: '(주)서비스컴퍼니 CEO',
    quote: '잡코리아 빌보드를 통해 실력 있는 프리랜서를 빠르게 만날 수 있었습니다. 적극 추천합니다!',
    avatar: '/images/testimonial1.jpg',
  },
  {
    id: 2,
    name: '한프리',
    position: '프리랜서 개발자',
    quote: '다양한 프로젝트를 통해 경력을 쌓고 안정적인 수입을 얻을 수 있었습니다. 감사합니다.',
    avatar: '/images/testimonial2.jpg',
  },
  {
    id: 3,
    name: '조스타트',
    position: '스타트업 CTO',
    quote: '급하게 필요한 인력을 구하기 어려웠는데, 여기서 완벽한 매칭을 찾았습니다.',
    avatar: '/images/testimonial3.jpg',
  },
];

// 히어로 섹션 캐러셀용 프로젝트 데이터
export const heroProjects = [
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