# 🔧 Performance Optimization Implementation Guide

## 📌 Immediate Actions (High Priority)

### 1. **Fix NotificationBell Component**
```typescript
// src/components/notification/NotificationBell.tsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// Move icon mapping outside component
const NOTIFICATION_ICONS: Record<string, string> = {
  'project_applied': '📝',
  'project_bookmarked': '⭐',
  'project_status_changed': '🔄',
  'new_similar_project': '🚀',
  'freelancer_contacted': '💬',
  'application_accepted': '✅',
  'application_rejected': '❌',
  'project_deadline_approaching': '⏰',
  'message_received': '📨',
  'system_announcement': '📢'
};

const NotificationBell = React.memo(({ className = '' }: NotificationBellProps) => {
  // ... existing state

  // Memoize icon getter
  const getNotificationIcon = useCallback((type: string) => {
    return NOTIFICATION_ICONS[type] || '🔔';
  }, []);

  // Optimize loadNotifications with useCallback
  const loadNotifications = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await notificationService.getNotifications({ 
        limit: 5, 
        sortBy: 'createdAt', 
        sortOrder: 'desc' 
      });
      
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Remove loading dependency to prevent recreation

  // Memoize event handlers
  const handleMarkAsRead = useCallback(async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  const handleDeleteNotification = useCallback(async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, []);

  const handleNotificationClick = useCallback(async (notification: AppNotification) => {
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }

    if (notification.data?.projectId) {
      window.location.href = `/project/${notification.data.projectId}`;
    } else if (notification.data?.freelancerId) {
      window.location.href = `/freelancer/${notification.data.freelancerId}`;
    }

    setIsOpen(false);
  }, []);

  // Optimize click outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen && !loading) {
      loadNotifications();
    }
  }, [isOpen]); // Remove loadNotifications dependency

  // ... rest of component
});

NotificationBell.displayName = 'NotificationBell';
export default NotificationBell;
```

### 2. **Fix useNotifications Hook**
```typescript
// src/hooks/useNotifications.ts
export function useNotifications(initialFilter: NotificationFilter = {}): UseNotificationsReturn {
  // ... existing state

  // Use ref for mounted state
  const isMounted = useRef(true);

  // Memoize filter to prevent object recreation
  const stableFilter = useMemo(() => initialFilter, [
    initialFilter.type,
    initialFilter.read,
    initialFilter.limit,
    initialFilter.offset,
    initialFilter.sortBy,
    initialFilter.sortOrder
  ]);

  // Stable fetchNotifications
  const fetchNotifications = useCallback(async (filter?: NotificationFilter) => {
    if (!isMounted.current) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const filterToUse = filter || stableFilter;
      const response = await notificationService.getNotifications(filterToUse);
      
      if (!isMounted.current) return;
      
      if (response.success && response.data) {
        setNotifications(response.data);
        setTotal(response.total || 0);
        setHasMore((response.data.length + (filterToUse.offset || 0)) < (response.total || 0));
        setBadge({
          count: response.unreadCount || 0,
          hasUnread: (response.unreadCount || 0) > 0
        });
      } else {
        setError(response.error || '알림을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      if (isMounted.current) {
        setError('알림을 불러오는데 실패했습니다.');
        console.error('Failed to fetch notifications:', err);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [stableFilter]);

  // Stable updateBadge without dependencies
  const updateBadge = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      const badgeData = await notificationService.getNotificationBadge();
      if (isMounted.current) {
        setBadge(badgeData);
      }
    } catch (err) {
      console.error('Failed to update badge:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotifications();
    loadSettings();
    
    return () => {
      isMounted.current = false;
    };
  }, []); // Empty dependency array is fine here

  // Badge update interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (isMounted.current) {
        updateBadge();
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array to prevent interval reset

  // ... rest of hook
}
```

### 3. **Add React.memo to Heavy Components**
```typescript
// src/components/project/ProjectCard.tsx
import React from 'react';

const ProjectCard = React.memo(({ project, onApply, onBookmark }: ProjectCardProps) => {
  // ... component implementation
}, (prevProps, nextProps) => {
  // Custom comparison for optimization
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.project.updatedAt === nextProps.project.updatedAt &&
    prevProps.project.bookmarked === nextProps.project.bookmarked
  );
});

ProjectCard.displayName = 'ProjectCard';
export default ProjectCard;
```

### 4. **Optimize FreelancerCard**
```typescript
// src/components/freelancer/FreelancerCard.tsx
import React, { useMemo } from 'react';

const FreelancerCard = React.memo(({ freelancer }: FreelancerCardProps) => {
  // Memoize expensive calculations
  const hourlyRateFormatted = useMemo(() => {
    if (!freelancer.hourlyRate) return '협의';
    const rate = typeof freelancer.hourlyRate === 'string' 
      ? parseInt(freelancer.hourlyRate.replace(/[^0-9]/g, ''))
      : freelancer.hourlyRate;
    return `${rate.toLocaleString()}원/시간`;
  }, [freelancer.hourlyRate]);

  const skillsDisplay = useMemo(() => {
    return freelancer.skills.slice(0, 3);
  }, [freelancer.skills]);

  // ... component implementation
});

FreelancerCard.displayName = 'FreelancerCard';
export default FreelancerCard;
```

### 5. **Create API Cache Service**
```typescript
// src/services/api-cache.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    Array.from(this.cache.keys())
      .filter(key => key.includes(pattern))
      .forEach(key => this.cache.delete(key));
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

export const apiCache = new APICache();
```

### 6. **Implement Cached API Service**
```typescript
// src/services/cached-api.ts
import api from '@/utils/api';
import { apiCache } from './api-cache';

export const cachedApi = {
  async get<T>(url: string, config?: any): Promise<T> {
    const cacheKey = `GET:${url}:${JSON.stringify(config?.params || {})}`;
    
    // Check cache first
    const cached = apiCache.get<T>(cacheKey);
    if (cached) return cached;
    
    // Make API call
    const response = await api.get<T>(url, config);
    
    // Cache the response
    apiCache.set(cacheKey, response.data, config?.cacheTTL);
    
    return response.data;
  },

  // Invalidate cache on mutations
  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await api.post<T>(url, data, config);
    
    // Invalidate related cache
    apiCache.invalidate(url.split('/')[1]); // e.g., 'projects' from '/api/projects'
    
    return response.data;
  },

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await api.put<T>(url, data, config);
    apiCache.invalidate(url.split('/')[1]);
    return response.data;
  },

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await api.delete<T>(url, config);
    apiCache.invalidate(url.split('/')[1]);
    return response.data;
  }
};
```

### 7. **Optimize ProjectFilters Component**
```typescript
// src/components/project/ProjectFilters.tsx

// Move constants outside component
const SKILL_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 
  'Python', 'Java', 'Spring', 'Django', 'FastAPI',
  'TypeScript', 'JavaScript', 'Go', 'Rust', 'PHP',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker',
  'Kubernetes', 'AWS', 'GCP', 'Azure', 'Figma'
];

const WORK_TYPE_OPTIONS = [
  { value: '', label: '전체' },
  { value: '상주', label: '상주' },
  { value: '재택', label: '재택' },
  { value: '혼합', label: '혼합' }
];

const EXPERIENCE_OPTIONS = [
  { value: '', label: '전체' },
  { value: '초급', label: '초급 (1-3년)' },
  { value: '중급', label: '중급 (4-7년)' },
  { value: '고급', label: '고급 (8년 이상)' }
];

const LOCATION_OPTIONS = [
  { value: '', label: '전체' },
  { value: '서울', label: '서울' },
  { value: '경기', label: '경기' },
  { value: '인천', label: '인천' },
  { value: '부산', label: '부산' },
  { value: '대구', label: '대구' },
  { value: '대전', label: '대전' },
  { value: '광주', label: '광주' },
  { value: '울산', label: '울산' },
  { value: '세종', label: '세종' },
  { value: '강원', label: '강원' },
  { value: '충북', label: '충북' },
  { value: '충남', label: '충남' },
  { value: '전북', label: '전북' },
  { value: '전남', label: '전남' },
  { value: '경북', label: '경북' },
  { value: '경남', label: '경남' },
  { value: '제주', label: '제주' }
];

const ProjectFilters = React.memo(({ 
  filters, 
  onChange,
  onReset 
}: ProjectFiltersProps) => {
  // Memoize handlers
  const handleSkillToggle = useCallback((skill: string) => {
    const newSkills = filters.selectedSkills.includes(skill)
      ? filters.selectedSkills.filter(s => s !== skill)
      : [...filters.selectedSkills, skill];
    onChange({ ...filters, selectedSkills: newSkills });
  }, [filters, onChange]);

  const handleInputChange = useCallback((field: string, value: any) => {
    onChange({ ...filters, [field]: value });
  }, [filters, onChange]);

  // ... component implementation
});

ProjectFilters.displayName = 'ProjectFilters';
export default ProjectFilters;
```

### 8. **Implement Virtual Scrolling for Long Lists**
```typescript
// src/components/common/VirtualList.tsx
import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

function VirtualList<T>({ 
  items, 
  itemHeight, 
  renderItem,
  overscan = 5 
}: VirtualListProps<T>) {
  const Row = React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  ));

  Row.displayName = 'VirtualListRow';

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={items.length}
          itemSize={itemHeight}
          width={width}
          overscanCount={overscan}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  );
}

export default React.memo(VirtualList);
```

### 9. **Optimize Image Loading**
```typescript
// src/components/common/OptimizedImage.tsx
import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const OptimizedImage = React.memo(({ 
  src, 
  alt, 
  width = 400, 
  height = 300,
  className = '',
  priority = false 
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-400">이미지를 불러올 수 없습니다</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
export default OptimizedImage;
```

### 10. **Create Performance Monitoring Hook**
```typescript
// src/hooks/usePerformanceMonitor.ts
import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  renderCount: number;
}

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const renderStartTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderEndTime = performance.now();
    const renderTime = renderEndTime - renderStartTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        renderTime: `${renderTime.toFixed(2)}ms`
      });
    }

    // Report to analytics in production
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        event_category: 'Performance',
        event_label: componentName,
        value: Math.round(renderTime),
        custom_map: {
          dimension1: renderCount.current
        }
      });
    }
  });

  // Mark render start
  renderStartTime.current = performance.now();
}
```

## 📋 Implementation Checklist

### Week 1: Critical Fixes
- [ ] Add React.memo to NotificationBell, ProjectCard, FreelancerCard
- [ ] Fix useNotifications hook dependencies
- [ ] Implement API cache service
- [ ] Move constants outside components
- [ ] Fix infinite loop risks in useEffect

### Week 2: Performance Enhancements
- [ ] Implement virtual scrolling for project/freelancer lists
- [ ] Add image lazy loading with Next.js Image
- [ ] Optimize bundle with code splitting
- [ ] Add performance monitoring
- [ ] Implement debounced search

### Week 3: Advanced Optimizations
- [ ] Add service worker for offline support
- [ ] Implement prefetching for frequently accessed data
- [ ] Add request deduplication
- [ ] Optimize WebSocket reconnection logic
- [ ] Add error boundaries

## 🚀 Quick Wins

1. **Add these to package.json for immediate improvements:**
```json
{
  "scripts": {
    "build:analyze": "ANALYZE=true npm run build",
    "perf:check": "lighthouse http://localhost:3000 --view",
    "bundle:size": "size-limit"
  },
  "devDependencies": {
    "@size-limit/preset-app": "^8.2.6",
    "size-limit": "^8.2.6"
  },
  "size-limit": [
    {
      "path": ".next/static/chunks/main-*.js",
      "limit": "150 KB"
    },
    {
      "path": ".next/static/chunks/pages/**/*.js",
      "limit": "100 KB"
    }
  ]
}
```

2. **Add to next.config.js:**
```javascript
module.exports = {
  images: {
    domains: ['localhost', 'your-cdn-domain.com'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lodash', 'date-fns', 'framer-motion']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};
```

## 🎯 Performance Goals

- Initial Load Time: < 3s on 3G
- Time to Interactive: < 5s
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 300ms
- Cumulative Layout Shift: < 0.1

---

*Start with Week 1 tasks for immediate impact on performance*