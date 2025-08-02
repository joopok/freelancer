'use client';

import React, { useState, useEffect } from 'react';
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

function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
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

export default function Home() {
  return <HomePage />;
}