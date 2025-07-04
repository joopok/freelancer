'use client';

import React from 'react';
import { Review } from '@/types/freelancer';

interface RatingTrendChartProps {
  reviews: Review[];
}

export default function RatingTrendChart({ reviews }: RatingTrendChartProps) {
  // 최근 6개월 데이터 생성
  const getMonthlyData = () => {
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월'];
    const data = monthNames.map((month, index) => {
      // 예시 데이터 생성 (실제로는 리뷰 날짜를 파싱해서 계산해야 함)
      const baseRating = 4.5;
      const variation = Math.sin(index) * 0.3;
      return {
        month,
        rating: Math.max(3.5, Math.min(5, baseRating + variation))
      };
    });
    return data;
  };

  const monthlyData = getMonthlyData();
  const maxRating = 5;
  const minRating = 3;

  return (
    <div className="h-full flex items-end justify-between gap-2">
      {monthlyData.map((data, index) => {
        const height = ((data.rating - minRating) / (maxRating - minRating)) * 100;
        return (
          <div key={data.month} className="flex-1 flex flex-col items-center">
            <div className="w-full relative h-20">
              <div 
                className="absolute bottom-0 w-full bg-blue-500 dark:bg-blue-400 rounded-t transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-300"
                style={{ height: `${height}%` }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {data.rating.toFixed(1)}
                </span>
              </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{data.month}</span>
          </div>
        );
      })}
    </div>
  );
}