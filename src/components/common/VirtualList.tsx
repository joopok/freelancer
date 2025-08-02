'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface VirtualListProps<T> {
  items: T[];
  height: number; // 컨테이너 높이
  itemHeight: number | ((index: number) => number); // 아이템 높이
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number; // 렌더링할 추가 아이템 수
  className?: string;
  onEndReached?: () => void;
  endReachedThreshold?: number;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className = '',
  onEndReached,
  endReachedThreshold = 0.8,
  loading = false,
  loadingComponent,
  emptyComponent,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  // 아이템 높이 계산
  const getItemHeight = useCallback((index: number) => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
  }, [itemHeight]);

  // 전체 높이 계산
  const totalHeight = items.reduce((acc, _, index) => acc + getItemHeight(index), 0);

  // 아이템 위치 계산
  const getItemOffset = useCallback((index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  }, [getItemHeight]);

  // 보이는 범위 계산
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateVisibleRange = () => {
      const start = scrollTop;
      const end = scrollTop + height;

      let startIndex = 0;
      let endIndex = items.length - 1;

      // Binary search for start index
      let low = 0;
      let high = items.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const offset = getItemOffset(mid);
        if (offset < start) {
          startIndex = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      // Binary search for end index
      low = startIndex;
      high = items.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const offset = getItemOffset(mid);
        if (offset < end) {
          endIndex = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      // Apply overscan
      startIndex = Math.max(0, startIndex - overscan);
      endIndex = Math.min(items.length - 1, endIndex + overscan);

      setVisibleRange({ start: startIndex, end: endIndex });

      // Check if end reached
      if (onEndReached && !loading) {
        const scrollPercentage = (scrollTop + height) / totalHeight;
        if (scrollPercentage >= endReachedThreshold) {
          onEndReached();
        }
      }
    };

    calculateVisibleRange();
  }, [scrollTop, height, items.length, overscan, getItemOffset, onEndReached, loading, totalHeight, endReachedThreshold]);

  // 스크롤 핸들러
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 아이템이 없을 때
  if (items.length === 0 && !loading) {
    return emptyComponent ? <>{emptyComponent}</> : null;
  }

  // 렌더링할 아이템들
  const visibleItems = [];
  for (let i = visibleRange.start; i <= visibleRange.end; i++) {
    if (i < items.length) {
      const offset = getItemOffset(i);
      const itemHeightValue = getItemHeight(i);
      visibleItems.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            top: offset,
            height: itemHeightValue,
            width: '100%',
          }}
        >
          {renderItem(items[i], i)}
        </div>
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-auto ${className}`}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
      {loading && loadingComponent && (
        <div className="absolute bottom-0 left-0 right-0">
          {loadingComponent}
        </div>
      )}
    </div>
  );
}

// 무한 스크롤을 위한 래퍼 컴포넌트
interface InfiniteVirtualListProps<T> extends Omit<VirtualListProps<T>, 'onEndReached'> {
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function InfiniteVirtualList<T>({
  loadMore,
  hasMore,
  ...props
}: InfiniteVirtualListProps<T>) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleEndReached = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <VirtualList
      {...props}
      onEndReached={handleEndReached}
      loading={isLoadingMore}
    />
  );
}

// 고정 높이 아이템용 간단한 버전
interface SimpleVirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function SimpleVirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  className = '',
}: SimpleVirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + height) / itemHeight)
  );
  
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: i * itemHeight,
          height: itemHeight,
          width: '100%',
        }}
      >
        {renderItem(items[i], i)}
      </div>
    );
  }
  
  return (
    <div
      className={`relative overflow-auto ${className}`}
      style={{ height }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
}