import React from 'react';
import { HeroSection } from '@/components/main/HeroSection';
import { SearchSection } from '@/components/main/SearchSection';
import { CategorySection } from '@/components/main/CategorySection';
import { StatsSection } from '@/components/main/StatsSection';
import { FeaturedProjects } from '@/components/main/FeaturedProjects';
import { RecommendedProjects } from '@/components/main/RecommendedProjects';
import { FeaturedFreelancers } from '@/components/main/FeaturedFreelancers';
import { PlatformFeatures } from '@/components/main/PlatformFeatures';
import { SuccessStories } from '@/components/main/SuccessStories';
import { Testimonials } from '@/components/main/Testimonials';
import { CtaSection } from '@/components/main/CtaSection';

// Mock 데이터 - 실제로는 API 호출로 대체되어야 합니다.
import { stats, categories, featuredProjects, featuredFreelancers, testimonials, heroProjects } from '@/data/mainPageData';

export default async function Home() {
  // 서버 컴포넌트에서는 API 호출 등을 통해 데이터를 미리 가져올 수 있습니다.
  // 예: const projects = await fetchProjects();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <main>
        <HeroSection heroProjects={heroProjects} />
        <SearchSection />
        <CategorySection categories={categories} />
        <StatsSection stats={stats} />
        <FeaturedProjects projects={featuredProjects} />
        <RecommendedProjects />
        <FeaturedFreelancers freelancers={featuredFreelancers} />
        <PlatformFeatures />
        <SuccessStories />
        <Testimonials testimonials={testimonials} />
        <CtaSection />
      </main>
    </div>
  );
}