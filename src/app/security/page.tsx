'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { Shield, Key, Smartphone, Clock, AlertTriangle, Check } from 'lucide-react';

export default function SecurityPage() {
  const { user, isLoggedIn } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            로그인이 필요합니다
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            보안 설정을 확인하려면 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  // 샘플 로그인 기록
  const loginHistory = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: '서울, 대한민국',
      time: '2025-01-15 14:30',
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: '서울, 대한민국',
      time: '2025-01-14 09:15',
      current: false
    },
    {
      id: 3,
      device: 'Chrome on Mac',
      location: '부산, 대한민국',
      time: '2025-01-13 18:45',
      current: false
    }
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    // 비밀번호 변경 로직
    alert('비밀번호가 성공적으로 변경되었습니다.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">보안 설정</h1>
          <p className="text-gray-600 dark:text-gray-400">계정 보안을 강화하고 안전하게 관리하세요.</p>
        </div>

        <div className="space-y-6">
          {/* 보안 상태 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">보안 상태</h2>
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Check className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">양호</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">비밀번호</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">강력한 비밀번호 설정됨</p>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <Smartphone className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">2단계 인증</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">설정 권장</p>
              </div>
              
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">로그인 활동</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">정상 활동</p>
              </div>
            </div>
          </div>

          {/* 비밀번호 변경 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">비밀번호 변경</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                비밀번호 변경
              </button>
            </form>
          </div>

          {/* 2단계 인증 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2단계 인증</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  계정 보안을 강화하기 위해 2단계 인증을 설정하세요.
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                설정하기
              </button>
            </div>
            
            <div className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  2단계 인증이 설정되지 않았습니다
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  계정 보안을 위해 2단계 인증을 설정하는 것을 권장합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 로그인 기록 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">최근 로그인 기록</h2>
            <div className="space-y-3">
              {loginHistory.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                      <Smartphone className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{record.device}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{record.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.time}</p>
                    {record.current && (
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900 dark:text-green-200">
                        현재 세션
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 계정 삭제 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">위험 구역</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              계정 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}