'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Testimonial } from '@/types';

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return (
    <section className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">사용자 후기</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            실제 사용자들의 생생한 경험을 들어보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring", 
                stiffness: 300, 
                damping: 20 
              }}
              onClick={() => {
                if (testimonial.id === 1) navigateTo('/freelancer');
                else if (testimonial.id === 2) navigateTo('/project');
                else navigateTo('/jobs');
              }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer group"
            >
              <div className="flex items-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span>
                ))}
              </div>
              
              <blockquote className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-8 transition-colors duration-300">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
                    <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-base transition-colors duration-300">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
