'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AvailabilityCalendarProps {
  freelancerId: number;
}

interface DaySchedule {
  date: Date;
  status: 'available' | 'busy' | 'partial' | 'unavailable';
  hours?: string;
  projects?: string[];
}

export default function AvailabilityCalendar({ freelancerId }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [scheduleData, setScheduleData] = useState<Map<string, DaySchedule>>(new Map());

  // 월의 첫 날과 마지막 날 계산
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // 예시 일정 데이터 생성
  useEffect(() => {
    const generateScheduleData = () => {
      const newScheduleData = new Map<string, DaySchedule>();
      const today = new Date();
      
      for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        
        // 주말 처리
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          newScheduleData.set(dateKey, {
            date,
            status: 'unavailable',
          });
          continue;
        }
        
        // 랜덤하게 일정 생성
        const random = Math.random();
        if (random < 0.3) {
          newScheduleData.set(dateKey, {
            date,
            status: 'busy',
            projects: ['프로젝트 A 진행 중'],
          });
        } else if (random < 0.5) {
          newScheduleData.set(dateKey, {
            date,
            status: 'partial',
            hours: '오후 2시 이후 가능',
            projects: ['오전: 프로젝트 B 미팅'],
          });
        } else {
          newScheduleData.set(dateKey, {
            date,
            status: 'available',
            hours: '09:00 - 18:00',
          });
        }
      }
      
      setScheduleData(newScheduleData);
    };
    
    generateScheduleData();
  }, []);

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const getDaysInMonth = () => {
    const days: (Date | null)[] = [];
    
    // 이전 달의 날짜들
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // 현재 달의 날짜들
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    
    return days;
  };

  const getDateStatus = (date: Date | null) => {
    if (!date) return null;
    const dateKey = date.toISOString().split('T')[0];
    return scheduleData.get(dateKey);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50';
      case 'busy':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50';
      case 'partial':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50';
      case 'unavailable':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed';
      default:
        return 'hover:bg-gray-100 dark:hover:bg-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-3 h-3" />;
      case 'busy':
        return <XCircle className="w-3 h-3" />;
      case 'partial':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
      {/* 캘린더 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-2 ${
              index === 0 || index === 6
                ? 'text-red-500 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth().map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const schedule = getDateStatus(date);
          const isPast = isPastDate(date);
          const isCurrentDay = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => !isPast && setSelectedDate(date)}
              disabled={isPast}
              className={`
                aspect-square p-1 rounded-lg border transition-all relative
                ${isCurrentDay ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'}
                ${isPast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${schedule ? getStatusColor(schedule.status) : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${selectedDate?.toDateString() === date.toDateString() ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className={`text-sm font-medium ${
                  isCurrentDay ? 'text-blue-600 dark:text-blue-400' : ''
                }`}>
                  {date.getDate()}
                </span>
                {schedule && !isPast && (
                  <div className="mt-0.5">
                    {getStatusIcon(schedule.status)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
          <span className="text-gray-600 dark:text-gray-400">가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700" />
          <span className="text-gray-600 dark:text-gray-400">부분 가능</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" />
          <span className="text-gray-600 dark:text-gray-400">예약됨</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700" />
          <span className="text-gray-600 dark:text-gray-400">불가</span>
        </div>
      </div>

      {/* 선택된 날짜 상세 정보 */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          {(() => {
            const schedule = getDateStatus(selectedDate);
            if (!schedule) return <p className="text-sm text-gray-500">일정 정보가 없습니다.</p>;

            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(schedule.status)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {schedule.status === 'available' && '예약 가능'}
                    {schedule.status === 'busy' && '예약 불가'}
                    {schedule.status === 'partial' && '부분 가능'}
                    {schedule.status === 'unavailable' && '휴무'}
                  </span>
                </div>
                {schedule.hours && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{schedule.hours}</span>
                  </div>
                )}
                {schedule.projects && schedule.projects.length > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium mb-1">진행 중인 프로젝트:</p>
                    <ul className="list-disc list-inside">
                      {schedule.projects.map((project, idx) => (
                        <li key={idx}>{project}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}