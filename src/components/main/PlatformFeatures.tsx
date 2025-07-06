'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function PlatformFeatures() {
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">왜 잡코리아 빌보드를 선택해야 할까요?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          우리는 프리랜서와 기업 모두에게 최고의 경험을 제공합니다
        </p>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            onClick={() => navigateTo('/freelancer')}
            className="text-center cursor-pointer group"
          >
            <motion.div 
              className="bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300 will-change-transform"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-blue-600 text-3xl">👥</span>
            </motion.div>
            <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">검증된 프리랜서</h3>
              <p className="text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
          까다롭고 엄격한 스크리닝을 통과한<br />전문 프리랜서만 활동합니다.
          </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
            onClick={() => navigateTo('/jobs')}
            className="text-center cursor-pointer group"
          >
            <motion.div 
              className="bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300 will-change-transform"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-blue-600 text-3xl">💼</span>
            </motion.div>
            <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">안전한 대금계약 시스템</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              표준 계약서와 에스크로 결제로<br />
              프로젝트 완료 후 7일 내<br />
              100% 안전하게 정산됩니다.
          </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -5 }}
            onClick={() => navigateTo('/project')}
            className="text-center cursor-pointer group"
          >
            <motion.div 
              className="bg-blue-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300 will-change-transform"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-blue-600 text-3xl">🏠</span>
            </motion.div>
            <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">다양한 근무 방식</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
상주, 재택, 부분 출근 등 다양한 < br /> 근무 방식으로 유연하게 일할 수 있으며, <br />
              상위 1% 를 위한 특별한 프리미엄 프로젝트를 만나보세요.
            </p>
          </motion.div>
        </div>
      </section>
  );
}
