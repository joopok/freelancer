'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Calendar, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface SuccessStory {
  id: number;
  company: string;
  industry: string;
  projectType: string;
  duration: string;
  budget: string;
  teamSize: string;
  result: string;
  challenge: string;
  solution: string;
  testimonial: string;
  author: string;
  authorTitle: string;
  metrics: {
    label: string;
    value: string;
  }[];
  technologies: string[];
  featured?: boolean;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    company: 'KT DS',
    industry: '정보통신',
    projectType: '클라우드 마이그레이션',
    duration: '8개월',
    budget: '2.5억원',
    teamSize: '15명',
    result: '인프라 비용 40% 절감, 시스템 성능 3배 향상',
    challenge: '레거시 시스템의 클라우드 전환과 동시에 서비스 무중단 운영 필요',
    solution: '단계적 마이그레이션 전략 수립, 컨테이너 기반 아키텍처 도입',
    testimonial: '잡코리아 빌보드를 통해 클라우드 전문가들을 빠르게 구성할 수 있었고, 프로젝트를 성공적으로 완료했습니다.',
    author: '김정호',
    authorTitle: 'CTO',
    metrics: [
      { label: '비용 절감', value: '40%' },
      { label: '성능 향상', value: '3배' },
      { label: '다운타임', value: '0시간' }
    ],
    technologies: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    featured: true
  },
  {
    id: 2,
    company: 'CJ ENM',
    industry: '미디어/엔터테인먼트',
    projectType: 'OTT 플랫폼 개발',
    duration: '12개월',
    budget: '5억원',
    teamSize: '25명',
    result: 'MAU 500만 달성, 스트리밍 품질 개선',
    challenge: '글로벌 경쟁력을 갖춘 OTT 플랫폼 구축',
    solution: '마이크로서비스 아키텍처, AI 기반 추천 시스템 구현',
    testimonial: '우수한 개발자들과 함께 혁신적인 OTT 서비스를 만들 수 있었습니다.',
    author: '박민수',
    authorTitle: '디지털전략본부장',
    metrics: [
      { label: '월 사용자', value: '500만' },
      { label: '재생 완료율', value: '85%' },
      { label: '추천 정확도', value: '92%' }
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Redis', 'ML/AI']
  },
  {
    id: 3,
    company: 'LG CNS',
    industry: 'IT 서비스',
    projectType: 'AI 챗봇 시스템',
    duration: '6개월',
    budget: '3억원',
    teamSize: '12명',
    result: '고객 문의 처리 시간 70% 단축',
    challenge: '다양한 도메인의 고객 문의를 처리할 수 있는 AI 시스템 구축',
    solution: 'NLP 기반 대화형 AI, 멀티 채널 통합 플랫폼',
    testimonial: 'AI 전문가들의 도움으로 업계 최고 수준의 챗봇을 구현했습니다.',
    author: '이상훈',
    authorTitle: 'AI사업부장',
    metrics: [
      { label: '응답 시간', value: '70% ↓' },
      { label: '처리 정확도', value: '95%' },
      { label: '고객 만족도', value: '4.8/5' }
    ],
    technologies: ['Python', 'TensorFlow', 'BERT', 'FastAPI']
  },
  {
    id: 4,
    company: '롯데제과',
    industry: '식품/제조',
    projectType: '스마트 팩토리 구축',
    duration: '10개월',
    budget: '4억원',
    teamSize: '18명',
    result: '생산성 35% 향상, 불량률 60% 감소',
    challenge: '제조 공정의 디지털 전환과 실시간 모니터링 시스템 구축',
    solution: 'IoT 센서 네트워크, 실시간 데이터 분석 플랫폼',
    testimonial: '제조 IT 전문가들과 함께 스마트 팩토리를 성공적으로 구축했습니다.',
    author: '최영진',
    authorTitle: '생산혁신팀장',
    metrics: [
      { label: '생산성', value: '35% ↑' },
      { label: '불량률', value: '60% ↓' },
      { label: 'ROI', value: '18개월' }
    ],
    technologies: ['IoT', 'React', 'Node.js', 'InfluxDB', 'Grafana']
  },
  {
    id: 5,
    company: '신세계 아이앤씨',
    industry: '유통/리테일',
    projectType: '옴니채널 커머스',
    duration: '14개월',
    budget: '6억원',
    teamSize: '30명',
    result: '온라인 매출 250% 성장, 고객 재구매율 45% 향상',
    challenge: '온오프라인 통합 쇼핑 경험 제공',
    solution: '통합 재고 관리, 개인화 추천 엔진, 옴니채널 결제 시스템',
    testimonial: '최고의 커머스 전문가들과 함께 디지털 전환을 성공적으로 완료했습니다.',
    author: '정미경',
    authorTitle: '디지털혁신본부장',
    metrics: [
      { label: '온라인 매출', value: '250% ↑' },
      { label: '재구매율', value: '45% ↑' },
      { label: '평균 구매액', value: '35% ↑' }
    ],
    technologies: ['Next.js', 'Spring Boot', 'PostgreSQL', 'Elasticsearch']
  },
  {
    id: 6,
    company: '종근당',
    industry: '제약/헬스케어',
    projectType: '디지털 헬스케어 플랫폼',
    duration: '9개월',
    budget: '3.5억원',
    teamSize: '16명',
    result: '환자 관리 효율성 50% 향상, 의료진 만족도 90%',
    challenge: '의료 데이터 보안을 유지하면서 사용성 높은 플랫폼 구축',
    solution: '블록체인 기반 의료 데이터 관리, 모바일 우선 설계',
    testimonial: '헬스케어 IT 전문가들의 도움으로 혁신적인 플랫폼을 만들었습니다.',
    author: '김선영',
    authorTitle: '디지털헬스사업부장',
    metrics: [
      { label: '관리 효율성', value: '50% ↑' },
      { label: '의료진 만족도', value: '90%' },
      { label: '데이터 보안', value: '100%' }
    ],
    technologies: ['React Native', 'Node.js', 'Blockchain', 'FHIR']
  },
  {
    id: 7,
    company: '민병철교육그룹',
    industry: '교육',
    projectType: 'AI 기반 맞춤형 교육 플랫폼',
    duration: '18개월',
    budget: '8억원',
    teamSize: '35명',
    result: '학습 효율 40% 향상, 수강생 만족도 95%, 이탈률 50% 감소',
    challenge: '개인별 학습 수준과 속도에 맞는 맞춤형 교육 시스템 구축',
    solution: 'AI 기반 학습 분석, 적응형 커리큘럼, 실시간 피드백 시스템',
    testimonial: '잡코리아 빌보드를 통해 최고의 에듀테크 전문가들을 만났고, 교육의 미래를 만들어가고 있습니다.',
    author: '민병철',
    authorTitle: '대표이사',
    metrics: [
      { label: '학습 효율', value: '40% ↑' },
      { label: '만족도', value: '95%' },
      { label: '이탈률', value: '50% ↓' },
      { label: '매출 성장', value: '180% ↑' }
    ],
    technologies: ['React', 'Python', 'TensorFlow', 'AWS', 'WebRTC'],
    featured: true
  }
];

export default function SuccessStoriesPage() {
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const industries = ['all', ...Array.from(new Set(successStories.map(story => story.industry)))];

  const filteredStories = filter === 'all' 
    ? successStories 
    : successStories.filter(story => story.industry === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            홈으로 돌아가기
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            성공 사례
          </h1>
          <p className="text-xl text-white/90 max-w-3xl">
            잡코리아 빌보드와 함께 성공적으로 프로젝트를 완료한 기업들의 이야기를 확인해보세요.
          </p>
        </div>
      </div>

      {/* 필터 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2">
          {industries.map((industry) => (
            <button
              key={industry}
              onClick={() => setFilter(industry)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === industry
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {industry === 'all' ? '전체' : industry}
            </button>
          ))}
        </div>
      </div>

      {/* 성공 사례 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                story.featured ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedStory(story)}
            >
              {story.featured && (
                <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-t-xl text-center">
                  FEATURED
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {story.company}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {story.industry}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>

                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {story.projectType}
                </h4>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {story.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    {story.teamSize} 팀
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {story.budget}
                  </div>
                </div>

                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {story.result}
                </p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {story.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {story.technologies.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                      +{story.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 상세 모달 */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStory(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedStory.company}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedStory.industry} | {selectedStory.projectType}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    프로젝트 기간
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedStory.duration}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                    <Users className="h-4 w-4 mr-2" />
                    팀 규모
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedStory.teamSize}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    프로젝트 예산
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedStory.budget}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    도전 과제
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedStory.challenge}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    해결 방안
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedStory.solution}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    성과 지표
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedStory.metrics.map((metric, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    사용 기술
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-700 dark:text-gray-300 italic mb-3">
                        &quot;{selectedStory.testimonial}&quot;
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedStory.author}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedStory.authorTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/project"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  프로젝트 시작하기
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}