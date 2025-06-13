'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLoading } from '@/components/layout/Loading';
import { useEffect } from 'react';
import Image from 'next/image';

export default function AboutPage() {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true, '회사소개 페이지 로딩 중');
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [setLoading]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* 회사 소개 헤더 */}
      <motion.div 
        className="text-center mb-16"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          잡코리아 빌보드
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          프리랜서와 기업을 이어주는 최고의 플랫폼, 빌보드에서 새로운 일자리를 찾고 인재를 발견하세요.
        </p>
      </motion.div>

      {/* 비전 & 미션 */}
      <motion.section 
        className="mb-24"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">우리의 비전과 미션</h2>
              <p className="text-lg mb-6 text-gray-600">
                잡코리아 빌보드는 <span className="font-semibold text-blue-600">플랫폼의 힘</span>으로 프리랜서와 기업 간의 경계를 허물고, 
                모두가 공정한 기회를 가질 수 있는 열린 고용 시장을 만들어갑니다.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="flex-shrink-0 p-1 bg-blue-100 rounded-full mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <p className="text-gray-700"><span className="font-medium">미션:</span> 모든 사람이 자신의 역량을 발휘할 수 있는 최적의 일자리와 프로젝트를 연결합니다.</p>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 p-1 bg-purple-100 rounded-full mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </span>
                  <p className="text-gray-700"><span className="font-medium">비전:</span> 2030년까지 대한민국 대표 프리랜서 플랫폼으로 성장하여 100만 명의 일자리 창출에 기여합니다.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-80 rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="mb-4 mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">빌보드의 약속</h3>
                    <p className="text-gray-600">최고의 재능과 기회가 만나는 공간, 우리는 공정함과 투명성을 약속합니다.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 핵심 가치 */}
      <motion.section 
        className="mb-24"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">빌보드의 핵심 가치</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "혁신",
              icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              ),
              description: "업계의 트렌드를 선도하며 끊임없는 혁신을 추구합니다."
            },
            {
              title: "신뢰",
              icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              ),
              description: "모든 거래와 관계에서 투명성과 신뢰를 최우선으로 생각합니다."
            },
            {
              title: "연결",
              icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              ),
              description: "사람과 기회를 이어주는 가교 역할을 통해 가치를 창출합니다."
            }
          ].map((value, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 rounded-lg w-fit mb-6">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 연혁 */}
      <motion.section 
        className="mb-24"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">성장의 발자취</h2>
        <div className="relative">
          {/* 중앙 라인 */}
          <div className="absolute left-1/2 -ml-0.5 w-0.5 h-full bg-gray-200"></div>
          
          <div className="space-y-12">
            {[
              {
                year: "2021",
                title: "빌보드 서비스 출시",
                description: "프리랜서와 기업을 연결하는 잡코리아 빌보드 서비스를 정식 출시했습니다."
              },
              {
                year: "2022",
                title: "사용자 10만 명 돌파",
                description: "서비스 출시 1년 만에 등록 사용자 10만 명을 돌파하는 쾌거를 이루었습니다."
              },
              {
                year: "2023",
                title: "모바일 앱 출시",
                description: "언제 어디서나 편리하게 이용할 수 있는 iOS 및 Android 앱을 출시했습니다."
              },
              {
                year: "2024",
                title: "서비스 고도화",
                description: "AI 매칭 시스템 도입으로 더욱 정교한 프로젝트-프리랜서 매칭 서비스를 시작했습니다."
              }
            ].map((milestone, idx) => (
              <div key={idx} className={`relative flex items-center ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                {/* 동그라미 마커 */}
                <div className="absolute left-1/2 -ml-2.5 w-5 h-5 rounded-full bg-blue-500 shadow"></div>
                
                {/* 콘텐츠 박스 */}
                <div className={`w-5/12 bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${idx % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full mb-3">
                    {milestone.year}
                  </span>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 팀 소개 */}
      <motion.section 
        className="mb-24"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">리더십 팀</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "김서준",
              position: "대표이사",
              bio: "10년 이상의 HR 플랫폼 경험을 바탕으로 빌보드의 비전을 이끌고 있습니다."
            },
            {
              name: "이지은",
              position: "기술이사 (CTO)",
              bio: "실리콘밸리에서의 경험을 토대로 빌보드의 기술적 혁신을 주도합니다."
            },
            {
              name: "박민준",
              position: "마케팅 총괄",
              bio: "디지털 마케팅 전문가로서 빌보드의 브랜드 가치를 높이는 데 기여하고 있습니다."
            }
          ].map((member, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-400"></div>
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                  <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white shadow-md flex items-center justify-center text-3xl text-gray-500 font-bold">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div className="mt-14 text-center">
                  <h3 className="text-xl font-bold mb-1 text-gray-800">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 오시는 길 */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">오시는 길</h2>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
          <div className="h-80 bg-gray-200 relative">
            {/* 지도 이미지 대체 */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <p className="text-gray-500">지도가 로드되지 않았습니다.</p>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">주소</h3>
                <p className="text-gray-600 mb-6">
                  서울특별시 강남구 테헤란로 152<br />
                  잡코리아 빌보드 타워 10층
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span className="text-gray-600">02-1234-5678</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-600">contact@billboard.jobkorea.co.kr</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">교통 안내</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">지하철</h4>
                    <p className="text-gray-600">2호선 강남역 3번 출구에서 도보 5분</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">버스</h4>
                    <p className="text-gray-600">강남역 정류장 하차: 146, 341, 360, 740 등</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">주차</h4>
                    <p className="text-gray-600">빌딩 내 지하 주차장 이용 가능 (최초 1시간 무료)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
} 