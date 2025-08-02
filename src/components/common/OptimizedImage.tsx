'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 75,
  className,
  containerClassName,
  sizes,
  placeholder,
  blurDataURL,
  onLoad,
  onError,
  fallbackSrc = '/images/placeholder.jpg'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    onError?.();
  };

  // 이미지 크기 자동 계산
  const getSizes = () => {
    if (sizes) return sizes;
    if (fill) return '100vw';
    if (width && width < 640) return `${width}px`;
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  };

  // 컨테이너가 필요한 경우 (fill 모드 또는 로딩 상태 표시)
  if (fill || containerClassName) {
    return (
      <div className={cn('relative overflow-hidden', containerClassName)}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )}
        <Image
          src={currentSrc}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          priority={priority}
          quality={quality}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          sizes={getSizes()}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    );
  }

  // 일반 이미지 (크기 지정)
  return (
    <>
      {isLoading && (
        <div 
          className={cn(
            'bg-gray-200 dark:bg-gray-700 animate-pulse',
            className
          )}
          style={{ width, height }}
        />
      )}
      <Image
        src={currentSrc}
        alt={alt}
        width={width || 400}
        height={height || 300}
        priority={priority}
        quality={quality}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        sizes={getSizes()}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  );
};

// 사용 예시별 프리셋
export const ProfileImage: React.FC<Omit<OptimizedImageProps, 'sizes'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 640px) 64px, 96px"
    quality={90}
  />
);

export const CardImage: React.FC<Omit<OptimizedImageProps, 'sizes'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    quality={75}
  />
);

export const HeroImage: React.FC<Omit<OptimizedImageProps, 'sizes' | 'priority'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="100vw"
    priority
    quality={85}
  />
);

export const ThumbnailImage: React.FC<Omit<OptimizedImageProps, 'sizes'>> = (props) => (
  <OptimizedImage
    {...props}
    sizes="(max-width: 640px) 50vw, 200px"
    quality={70}
  />
);

export default OptimizedImage;