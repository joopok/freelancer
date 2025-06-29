'use client';

import { useState, useEffect } from 'react';
import { Search, Menu, Gift, Calendar, MapPin, CheckCircle, ChevronRight, Star } from 'lucide-react';

export default function MembershipPage() {
  const [activeTab, setActiveTab] = useState('membership');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-800 text-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="text-2xl font-bold">T</div>
            <span className="text-lg font-medium">membership</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-white/30 rounded-md"></div>
            <Search className="w-6 h-6" />
            <Menu className="w-6 h-6" />
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-6 mt-4">
          <button
            onClick={() => setActiveTab('membership')}
            className={`pb-2 text-sm font-medium ${
              activeTab === 'membership' 
                ? 'border-b-2 border-white' 
                : 'text-white/70'
            }`}
          >
            T 멤버십
          </button>
          <button
            onClick={() => setActiveTab('universe')}
            className={`pb-2 text-sm font-medium ${
              activeTab === 'universe' 
                ? 'border-b-2 border-white' 
                : 'text-white/70'
            }`}
          >
            T 우주
          </button>
          <button
            onClick={() => setActiveTab('mission')}
            className={`pb-2 text-sm font-medium ${
              activeTab === 'mission' 
                ? 'border-b-2 border-white' 
                : 'text-white/70'
            }`}
          >
            미션
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6">
        {/* VIP PICK PLUS Banner */}
        <div className="bg-gradient-to-br from-pink-200 via-pink-150 to-pink-100 rounded-3xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
              매달 여러 혜택을 쓸 수 있는<br />
              <span className="text-purple-700">VIP PICK PLUS</span> 혜택!
            </h2>
            <p className="text-gray-700 text-sm">VIP라면 놓치지 마세요</p>
          </div>
          <div className="absolute right-6 top-6">
            <div className="relative">
              {/* Brand Logos Scattered */}
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                SKT
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold absolute -top-2 left-8 shadow-lg">
                VIP
              </div>
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold absolute top-8 -left-2">
                T
              </div>
              <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold absolute top-6 left-12">
                CGV
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <span>4</span>
            <span>/</span>
            <span>10</span>
            <div className="w-3 h-3 bg-white/30 rounded-full flex items-center justify-center">
              <span className="text-xs">+</span>
            </div>
          </div>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-100">
              <span className="text-blue-600 font-bold text-xl">T</span>
            </div>
            <div className="text-xs text-blue-600 font-medium mb-1">T day</div>
            <div className="text-xs text-gray-700 font-medium">T day</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-100">
              <span className="text-blue-600 font-bold text-xl">0</span>
            </div>
            <div className="text-xs text-blue-600 font-medium mb-1">0 day</div>
            <div className="text-xs text-gray-700 font-medium">0 day</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3 relative shadow-sm border border-purple-100">
              <span className="text-purple-600 font-bold text-sm">VIP</span>
              <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-md font-bold">
                PICK
              </div>
            </div>
            <div className="text-xs text-purple-600 font-medium mb-1">VIP PICK</div>
            <div className="text-xs text-gray-700 font-medium">VIP PICK</div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-purple-100">
              <span className="text-purple-600 font-bold text-xs">Club</span>
            </div>
            <div className="text-xs text-purple-600 font-medium mb-1">클럽 T 로링</div>
            <div className="text-xs text-gray-700 font-medium">클럽 T 로링</div>
          </div>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Gift className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-xs text-gray-800">혜택 브랜드</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-pink-500" />
            </div>
            <div className="text-xs text-gray-800">이벤트</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-6 h-6 text-teal-500" />
            </div>
            <div className="text-xs text-gray-800">글로벌여행</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-xs text-gray-800">출석체크</div>
          </div>
        </div>

        {/* 7월 T day Section */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            7월의 <span className="text-blue-600">T day</span> 혜택을 알려드려요!
          </h3>
          
          <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl p-5 text-white mb-4 relative overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <div>
                <div className="text-sm opacity-90 font-medium">7월의 Day 혜택</div>
                <div className="text-2xl font-bold">7.2</div>
              </div>
              <div className="text-right">
                {/* Swimming person illustration */}
                <div className="w-20 h-16 relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                  <div className="absolute top-2 right-4 w-3 h-3 bg-white/40 rounded-full"></div>
                  <div className="absolute top-4 right-2 w-2 h-2 bg-white/30 rounded-full"></div>
                  <div className="absolute bottom-3 left-2 w-4 h-2 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
            {/* Water wave decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/10 rounded-b-2xl"></div>
          </div>

          {/* Benefit Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-2">D-3</div>
              <div className="w-full h-20 bg-yellow-100 rounded-lg mb-2"></div>
              <div className="text-xs font-medium">혜택 오픈</div>
              <div className="text-xs text-gray-500">두레쥬르</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-2">D-3</div>
              <div className="w-full h-20 bg-red-100 rounded-lg mb-2"></div>
              <div className="text-xs font-medium">혜택 오픈</div>
              <div className="text-xs text-gray-500">오리지널 무라리지!</div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm">
              <div className="text-xs text-gray-500 mb-2">D-3</div>
              <div className="w-full h-20 bg-red-100 rounded-lg mb-2"></div>
              <div className="text-xs font-medium">혜택 오픈</div>
              <div className="text-xs text-gray-500">정관장</div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Indicator */}
        <div className="flex justify-center items-center space-x-4 py-4">
          <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            할인형
          </div>
          <div className="text-sm text-gray-600">
            도승현님 VIP
          </div>
          <div className="text-sm font-bold">9,900원</div>
        </div>
      </div>
    </div>
  );
} 