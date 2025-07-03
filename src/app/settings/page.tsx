'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useThemeStore } from '@/store/theme';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showPhone: boolean;
  };
  preferences: {
    language: string;
    timezone: string;
    currency: string;
  };
}

export default function SettingsPage() {
  const { user, isLoggedIn } = useAuthStore();
  const { isDarkMode, setTheme } = useThemeStore();
  const router = useRouter();
  
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false,
    },
    preferences: {
      language: 'ko',
      timezone: 'Asia/Seoul',
      currency: 'KRW',
    },
  });
  
  const [activeTab, setActiveTab] = useState('account');

  // 로그인하지 않은 사용자 리디렉션
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleSettingChange = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // TODO: API 호출로 설정 저장
      console.log('설정 저장:', settings);
      alert('설정이 저장되었습니다.');
    } catch (error) {
      console.error('설정 저장 오류:', error);
      alert('설정 저장 중 오류가 발생했습니다.');
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  const tabs = [
    { id: 'account', label: '계정 정보', icon: '👤' },
    { id: 'notifications', label: '알림 설정', icon: '🔔' },
    { id: 'privacy', label: '개인정보', icon: '🔒' },
    { id: 'preferences', label: '환경 설정', icon: '⚙️' },
    { id: 'theme', label: '테마 설정', icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">설정</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            계정 설정 및 개인화 옵션을 관리하세요
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex">
            {/* 사이드바 탭 */}
            <div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="mr-3 text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 p-6">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* 계정 정보 탭 */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">계정 정보</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          사용자명
                        </label>
                        <input
                          type="text"
                          value={user?.username || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          이름
                        </label>
                        <input
                          type="text"
                          value={user?.name || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          이메일
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          사용자 타입
                        </label>
                        <input
                          type="text"
                          value={user?.type === 'company' ? '기업' : '개인'}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 알림 설정 탭 */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">알림 설정</h2>
                    <div className="space-y-4">
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300 capitalize">
                            {key === 'email' ? '이메일 알림' : key === 'push' ? '푸시 알림' : 'SMS 알림'}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 개인정보 탭 */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">개인정보 설정</h2>
                    <div className="space-y-4">
                      {Object.entries(settings.privacy).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">
                            {key === 'profileVisible' ? '프로필 공개' : 
                             key === 'showEmail' ? '이메일 공개' : '전화번호 공개'}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 환경 설정 탭 */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">환경 설정</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          언어
                        </label>
                        <select
                          value={settings.preferences.language}
                          onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="ko">한국어</option>
                          <option value="en">English</option>
                          <option value="ja">日本語</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          시간대
                        </label>
                        <select
                          value={settings.preferences.timezone}
                          onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="Asia/Seoul">서울 (GMT+9)</option>
                          <option value="America/New_York">뉴욕 (GMT-5)</option>
                          <option value="Europe/London">런던 (GMT+0)</option>
                          <option value="Asia/Tokyo">도쿄 (GMT+9)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          통화
                        </label>
                        <select
                          value={settings.preferences.currency}
                          onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="KRW">원 (KRW)</option>
                          <option value="USD">달러 (USD)</option>
                          <option value="EUR">유로 (EUR)</option>
                          <option value="JPY">엔 (JPY)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 테마 설정 탭 */}
                {activeTab === 'theme' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">테마 설정</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            다크 모드
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            어두운 테마로 변경합니다
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isDarkMode}
                            onChange={() => setTheme(!isDarkMode)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* 저장 버튼 */}
                {activeTab !== 'account' && activeTab !== 'theme' && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <motion.button
                      onClick={handleSaveSettings}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                      설정 저장
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}