import { TechNewsItem, TechNewsCategory } from '@/types/techNews';

// 목업 기술 뉴스 데이터
const MOCK_TECH_NEWS: TechNewsItem[] = [
  // 개발 테크 카테고리 뉴스
  {
    id: 'dev-tech-1',
    title: '2024년 주목해야 할 프론트엔드 개발 트렌드',
    excerpt: '최신 프론트엔드 개발 기술과 트렌드를 알아보고, 개발자들이 주목해야 할 기술을 소개합니다.',
    content: `
      <h2>2024년 프론트엔드 개발 동향</h2>
      <p>웹 개발 생태계는 매우 빠르게 진화하고 있습니다. 2024년에는 다음과 같은 기술과 트렌드가 주목받고 있습니다.</p>
      
      <h3>1. 서버 컴포넌트의 대중화</h3>
      <p>React Server Components, Next.js 등 서버 사이드 렌더링과 서버 컴포넌트 기술이 표준으로 자리잡고 있습니다.</p>
      
      <h3>2. AI 기반 개발 도구</h3>
      <p>GitHub Copilot, Tabnine과 같은 AI 코딩 도구가 개발자 생산성을 크게 향상시키고 있습니다.</p>
      
      <h3>3. 웹 컴포넌트와 마이크로 프론트엔드</h3>
      <p>대규모 애플리케이션에서는 마이크로 프론트엔드 아키텍처가 더욱 인기를 얻고 있습니다.</p>
    `,
    category: '개발 테크',
    thumbnail: '/images/tech-news/frontend-trends.jpg',
    date: '2024-03-05',
    author: '김개발',
    views: 1520,
    likes: 89,
    tags: ['프론트엔드', 'React', 'Next.js', 'AI', '웹 개발']
  },
  {
    id: 'dev-tech-2',
    title: '클라우드 네이티브 애플리케이션 개발 가이드',
    excerpt: '클라우드 네이티브 환경에서 애플리케이션을 개발하고 배포하는 전략을 알아봅니다.',
    content: `
      <h2>클라우드 네이티브 개발이란?</h2>
      <p>클라우드 네이티브 개발은 클라우드 환경에 최적화된 애플리케이션을 구축하는 방법론입니다.</p>
      
      <h3>주요 원칙</h3>
      <ol>
        <li>마이크로서비스 아키텍처 사용</li>
        <li>컨테이너 기술 활용 (Docker, Kubernetes)</li>
        <li>CI/CD 파이프라인 구축</li>
        <li>무상태(Stateless) 설계</li>
      </ol>
      
      <h3>권장 도구</h3>
      <p>Terraform, Helm, Prometheus, Grafana 등 클라우드 네이티브 도구를 활용하세요.</p>
    `,
    category: '개발 테크',
    thumbnail: '/images/tech-news/cloud-native.jpg',
    date: '2024-02-28',
    author: '박클라우드',
    views: 1280,
    likes: 76,
    tags: ['클라우드', 'DevOps', 'Kubernetes', 'Docker', '마이크로서비스']
  },
  
  // 실리콘밸리 카테고리 뉴스
  {
    id: 'silicon-valley-1',
    title: '실리콘밸리 스타트업의 하이브리드 근무 전환 추세',
    excerpt: '팬데믹 이후 실리콘밸리 기업들의 근무 방식 변화와 그 영향에 대해 알아봅니다.',
    content: `
      <h2>하이브리드 근무의 대두</h2>
      <p>팬데믹 이후 실리콘밸리의 많은 기업들이 하이브리드 근무 모델을 도입했습니다.</p>
      
      <h3>주요 기업별 정책</h3>
      <ul>
        <li>구글: 주 3일 출근, 2일 원격</li>
        <li>애플: 주 3일 출근 정책 도입</li>
        <li>메타: 완전 원격 근무 옵션 제공</li>
        <li>트위터: 원격 근무 우선 정책</li>
      </ul>
      
      <h3>영향과 변화</h3>
      <p>이러한 변화로 인해 실리콘밸리의 부동산 시장과 지역 경제에도 변화가 일어나고 있습니다.</p>
    `,
    category: '실리콘밸리',
    thumbnail: '/images/tech-news/silicon-valley-hybrid.jpg',
    date: '2024-03-10',
    author: '이실리콘',
    views: 2130,
    likes: 105,
    tags: ['실리콘밸리', '원격근무', '하이브리드 근무', '기업문화']
  },
  {
    id: 'silicon-valley-2',
    title: '실리콘밸리의 AI 투자 열풍, 어디까지 계속될까?',
    excerpt: '실리콘밸리 VC들의 AI 스타트업 투자 동향과 향후 전망을 분석합니다.',
    content: `
      <h2>AI 투자의 현재</h2>
      <p>2023년부터 실리콘밸리의 벤처 캐피털은 AI 스타트업에 대한 투자를 급격히 늘렸습니다.</p>
      
      <h3>주요 투자 분야</h3>
      <ul>
        <li>생성형 AI: 텍스트, 이미지, 오디오 생성</li>
        <li>산업용 AI: 제조, 물류 자동화</li>
        <li>의료 AI: 진단 및 신약 개발</li>
        <li>금융 AI: 트레이딩 및 리스크 관리</li>
      </ul>
      
      <h3>전망</h3>
      <p>전문가들은 AI 투자가 지속되겠지만, 더 실용적인 응용과 수익 모델을 가진 스타트업으로 투자가 집중될 것으로 예상합니다.</p>
    `,
    category: '실리콘밸리',
    thumbnail: '/images/tech-news/ai-investment.jpg',
    date: '2024-02-15',
    author: '정투자',
    views: 1850,
    likes: 92,
    tags: ['실리콘밸리', 'AI', '벤처캐피털', '투자', '스타트업']
  },
  
  // AI 컬럼 카테고리 뉴스
  {
    id: 'ai-column-1',
    title: 'GPT-5의 출시가 산업에 미칠 영향',
    excerpt: '다가오는 GPT-5의 출시가 다양한 산업과 직업군에 어떤 변화를 가져올지 예측합니다.',
    content: `
      <h2>GPT-5, 무엇이 달라질까?</h2>
      <p>GPT-4보다 더 발전된 능력을 갖춘 GPT-5의 출시가 임박했다는 소문이 나돌고 있습니다.</p>
      
      <h3>예상되는 기능</h3>
      <ul>
        <li>더 긴 컨텍스트 윈도우</li>
        <li>멀티모달 능력 강화</li>
        <li>추론 능력 향상</li>
        <li>실시간 상호작용</li>
      </ul>
      
      <h3>산업별 영향</h3>
      <p>콘텐츠 생성, 고객 서비스, 법률, 의료 등 다양한 분야에서 자동화 수준이 한층 높아질 것으로 예상됩니다.</p>
    `,
    category: 'AI 컬럼',
    thumbnail: '/images/tech-news/gpt5-impact.jpg',
    date: '2024-03-18',
    author: '최인공',
    views: 3200,
    likes: 187,
    tags: ['GPT-5', 'OpenAI', '인공지능', '자동화', '미래예측']
  },
  {
    id: 'ai-column-2',
    title: 'AI 시대의 개인정보 보호와 윤리적 과제',
    excerpt: 'AI 기술의 발전에 따른 개인정보 보호 문제와 윤리적 고려사항을 살펴봅니다.',
    content: `
      <h2>AI와 개인정보</h2>
      <p>AI 시스템은 방대한 양의 데이터를 학습하는데, 이 과정에서 개인정보 보호 문제가 발생할 수 있습니다.</p>
      
      <h3>주요 우려 사항</h3>
      <ul>
        <li>비동의 데이터 학습</li>
        <li>편향된 결과 생성</li>
        <li>딥페이크와 사기 위험</li>
        <li>프라이버시 침해</li>
      </ul>
      
      <h3>규제 동향</h3>
      <p>EU의 AI Act, 미국의 NIST AI Risk Management Framework 등 AI 규제 정책이 점점 강화되고 있습니다.</p>
    `,
    category: 'AI 컬럼',
    thumbnail: '/images/tech-news/ai-ethics.jpg',
    date: '2024-02-20',
    author: '윤리학',
    views: 1780,
    likes: 95,
    tags: ['AI 윤리', '개인정보보호', '규제', '딥페이크', '편향성']
  }
];

/**
 * 모든 기술 뉴스 아이템을 가져옵니다.
 */
export const getAllTechNews = (): TechNewsItem[] => {
  return MOCK_TECH_NEWS;
};

/**
 * 특정 카테고리의 뉴스 아이템을 가져옵니다.
 */
export const getTechNewsByCategory = (category: TechNewsCategory): TechNewsItem[] => {
  if (category === '전체') {
    return MOCK_TECH_NEWS;
  }
  return MOCK_TECH_NEWS.filter(item => item.category === category);
};

/**
 * ID로 특정 뉴스 아이템을 가져옵니다.
 */
export const getTechNewsById = (id: string): TechNewsItem | undefined => {
  return MOCK_TECH_NEWS.find(item => item.id === id);
};

/**
 * 검색어로 뉴스를 검색합니다.
 */
export const searchTechNews = (query: string): TechNewsItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return MOCK_TECH_NEWS.filter(item => 
    item.title.toLowerCase().includes(lowercaseQuery) || 
    item.excerpt.toLowerCase().includes(lowercaseQuery) ||
    item.content.toLowerCase().includes(lowercaseQuery) ||
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)))
  );
};

/**
 * 최신 뉴스 아이템을 가져옵니다.
 */
export const getLatestTechNews = (limit: number = 5): TechNewsItem[] => {
  return [...MOCK_TECH_NEWS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

/**
 * 인기 뉴스 아이템을 가져옵니다.
 */
export const getPopularTechNews = (limit: number = 5): TechNewsItem[] => {
  return [...MOCK_TECH_NEWS]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}; 