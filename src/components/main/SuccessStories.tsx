'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stories = [
  {
    company: 'KT DS',
    role: '개발센터장 김성우',
    testimonial: '검증된 프리랜서 개발자를\n빠르게 구했어요.',
    logo: '📡'
  },
  {
    company: 'CJ ENM',
    role: '사내 벤처 TF 김윤주',
    testimonial: '웹 리뉴얼 외주로 진행하고\n비용 절감했어요.',
    logo: '🎬'
  },
  {
    company: 'LG CNS',
    role: '금융플랫폼 PM 김성규',
    testimonial: '프론트엔드부터 AA까지\n한 번에 구했어요.',
    logo: '💻'
  },
  {
    company: '롯데제과',
    role: '사내 벤처 프로그램',
    testimonial: '관련 경험이 많은 전문가를\n빠르게 만났어요.',
    logo: '🍬'
  },
  {
    company: '신세계 아이앤씨',
    role: '내부 운영 인력',
    testimonial: '빠른 시간 안에 원하는\n여러 개발사를 찾았어요.',
    logo: '🏢'
  },
  {
    company: '종근당',
    role: '내부 운영 인력',
    testimonial: '내부 개발자 없이 빠르게\n프로젝트를 진행했어요.',
    logo: '💊'
  }
];

export function SuccessStories() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              잡코리아 빌보드와 함께 성공적으로<br />
              프로젝트를 완료해 보세요.
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mt-4 font-semibold">
              성공사례
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              잡코리아 빌보드와 함께 성공한 기업들의 이야기
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stories.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 will-change-transform"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl mb-3">{item.logo}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.company}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.role}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {item.testimonial}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}