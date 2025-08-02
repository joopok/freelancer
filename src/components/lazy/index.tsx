/**
 * Lazy loaded components for code splitting
 */
import dynamic from 'next/dynamic';

// Layout Components
export const LazyHeader = dynamic(() => import('@/components/layout/Header'), {
  ssr: true,
});

export const LazyBottom = dynamic(() => import('@/components/layout/Bottom'), {
  ssr: true,
});

// Main Page Components
export const LazyHeroSection = dynamic(
  () => import('@/components/main/HeroSection').then(mod => ({ default: mod.HeroSection })),
  { ssr: true }
);

export const LazySearchSection = dynamic(
  () => import('@/components/main/SearchSection').then(mod => ({ default: mod.SearchSection })),
  { ssr: true }
);

export const LazyCategorySection = dynamic(
  () => import('@/components/main/CategorySection').then(mod => ({ default: mod.CategorySection })),
  { ssr: true }
);

export const LazyStatsSection = dynamic(
  () => import('@/components/main/StatsSection').then(mod => ({ default: mod.StatsSection })),
  { ssr: true }
);

export const LazyFeaturedProjects = dynamic(
  () => import('@/components/main/FeaturedProjects').then(mod => ({ default: mod.FeaturedProjects })),
  { ssr: true }
);

export const LazyRecommendedProjects = dynamic(
  () => import('@/components/main/RecommendedProjects').then(mod => ({ default: mod.RecommendedProjects })),
  { ssr: false }
);

export const LazyFeaturedFreelancers = dynamic(
  () => import('@/components/main/FeaturedFreelancers').then(mod => ({ default: mod.FeaturedFreelancers })),
  { ssr: true }
);

export const LazyPlatformFeatures = dynamic(
  () => import('@/components/main/PlatformFeatures').then(mod => ({ default: mod.PlatformFeatures })),
  { ssr: true }
);

export const LazySuccessStories = dynamic(
  () => import('@/components/main/SuccessStories').then(mod => ({ default: mod.SuccessStories })),
  { ssr: true }
);

export const LazyTestimonials = dynamic(
  () => import('@/components/main/Testimonials').then(mod => ({ default: mod.Testimonials })),
  { ssr: true }
);

export const LazyCtaSection = dynamic(
  () => import('@/components/main/CtaSection').then(mod => ({ default: mod.CtaSection })),
  { ssr: true }
);

// Modal Components (클라이언트 사이드 전용)
export const LazyApplyModal = dynamic(
  () => import('@/components/project/ApplyModal').then(mod => ({ default: mod.ApplyModal })),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }
);

export const LazyInquiryModal = dynamic(
  () => import('@/components/project/InquiryModal').then(mod => ({ default: mod.InquiryModal })),
  { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
  }
);

// Chart Components (무거운 라이브러리)
export const LazySkillChart = dynamic(
  () => import('@/components/charts/SkillChart'),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
  }
);

// Rich Text Editor (무거운 컴포넌트)
export const LazyRichTextEditor = dynamic(
  () => import('@/components/editor/RichTextEditor'),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
  }
);

// 지도 컴포넌트
export const LazyMap = dynamic(
  () => import('@/components/map/Map'),
  { 
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
  }
);

// 프로필 이미지 업로더
export const LazyImageUploader = dynamic(
  () => import('@/components/upload/ImageUploader'),
  { 
    ssr: false,
    loading: () => <div className="h-32 w-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-full"></div>
  }
);

// 결제 관련 컴포넌트
export const LazyPaymentForm = dynamic(
  () => import('@/components/payment/PaymentForm'),
  { 
    ssr: false,
    loading: () => <div className="p-8 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
  }
);

// 대시보드 컴포넌트
export const LazyDashboard = dynamic(
  () => import('@/components/dashboard/Dashboard'),
  { 
    ssr: false,
    loading: () => <div className="min-h-screen bg-gray-100 dark:bg-gray-800 animate-pulse"></div>
  }
);

// 채팅 컴포넌트
export const LazyChatWidget = dynamic(
  () => import('@/components/chat/ChatWidget'),
  { 
    ssr: false,
    loading: () => <div className="fixed bottom-4 right-4 w-16 h-16 bg-blue-600 rounded-full animate-pulse"></div>
  }
);