import { MetadataRoute } from 'next';

// 정적 페이지 목록
const staticPages = [
  {
    url: 'https://techbridge.co.kr',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  },
  {
    url: 'https://techbridge.co.kr/project',
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  },
  {
    url: 'https://techbridge.co.kr/freelancer',
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  },
  {
    url: 'https://techbridge.co.kr/about',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  },
  {
    url: 'https://techbridge.co.kr/contact',
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  },
  {
    url: 'https://techbridge.co.kr/login',
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  },
  {
    url: 'https://techbridge.co.kr/register',
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  },
];

// 동적 페이지 URL 생성 함수
async function getDynamicPages(): Promise<MetadataRoute.Sitemap> {
  try {
    // 프로젝트 페이지 가져오기
    const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?page=1&limit=1000`, {
      next: { revalidate: 3600 } // 1시간 캐시
    });
    const projectsData = await projectsResponse.json();
    const projects = projectsData.content || [];

    const projectUrls = projects.map((project: any) => ({
      url: `https://techbridge.co.kr/project/${project.id}`,
      lastModified: new Date(project.updatedAt || project.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // 프리랜서 페이지 가져오기
    const freelancersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/freelancers?page=1&limit=1000`, {
      next: { revalidate: 3600 } // 1시간 캐시
    });
    const freelancersData = await freelancersResponse.json();
    const freelancers = freelancersData.content || [];

    const freelancerUrls = freelancers.map((freelancer: any) => ({
      url: `https://techbridge.co.kr/freelancer/${freelancer.id}`,
      lastModified: new Date(freelancer.updatedAt || freelancer.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...projectUrls, ...freelancerUrls];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dynamicPages = await getDynamicPages();
  
  return [
    ...staticPages,
    ...dynamicPages,
  ];
}