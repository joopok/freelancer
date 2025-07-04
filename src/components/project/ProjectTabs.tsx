'use client';

import React, { memo, useCallback } from 'react';

interface TabInfo {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface ProjectTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProjectTabs = memo(({ tabs, activeTab, onTabChange }: ProjectTabsProps) => {
  const handleTabClick = useCallback((tab: string) => {
    onTabChange(tab);
  }, [onTabChange]);

  const tabInfo: Record<string, TabInfo> = {
    latest: {
      value: 'latest',
      label: '최신순',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    deadline: {
      value: 'deadline',
      label: '마감임박순',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    budget: {
      value: 'budget',
      label: '금액순',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const info = tabInfo[tab];
        if (!info) return null;
        
        return (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 border rounded-xl transition-all flex items-center gap-1 shadow-sm ${
              activeTab === tab
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {info.icon}
            {info.label}
          </button>
        );
      })}
    </div>
  );
});

ProjectTabs.displayName = 'ProjectTabs';

export default ProjectTabs;