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
    const dynamicUrls: MetadataRoute.Sitemap = [];
    
    // 프로젝트 페이지 가져오기
    try {
      const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?page=1&limit=1000`, {
        next: { revalidate: 3600 }, // 1시간 캐시
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // API 응답이 성공적이고 JSON 형태인지 확인
      if (projectsResponse.ok && projectsResponse.headers.get('content-type')?.includes('application/json')) {
        const projectsData = await projectsResponse.json();
        
        // 응답 데이터 형식 검증
        if (projectsData && (projectsData.content || projectsData.data)) {
          const projects = projectsData.content || projectsData.data || [];
          
          if (Array.isArray(projects)) {
            const projectUrls = projects.map((project: any) => ({
              url: `https://techbridge.co.kr/project/${project.id}`,
              lastModified: new Date(project.updatedAt || project.createdAt || Date.now()),
              changeFrequency: 'weekly' as const,
              priority: 0.8,
            }));
            dynamicUrls.push(...projectUrls);
          }
        }
      } else {
        console.warn('Projects API not available during build - skipping dynamic project URLs');
      }
    } catch (projectError) {
      console.warn('Failed to fetch projects for sitemap:', projectError);
    }

    // 프리랜서 페이지 가져오기
    try {
      const freelancersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/freelancers?page=1&limit=1000`, {
        next: { revalidate: 3600 }, // 1시간 캐시
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // API 응답이 성공적이고 JSON 형태인지 확인
      if (freelancersResponse.ok && freelancersResponse.headers.get('content-type')?.includes('application/json')) {
        const freelancersData = await freelancersResponse.json();
        
        // 응답 데이터 형식 검증
        if (freelancersData && (freelancersData.content || freelancersData.data)) {
          const freelancers = freelancersData.content || freelancersData.data || [];
          
          if (Array.isArray(freelancers)) {
            const freelancerUrls = freelancers.map((freelancer: any) => ({
              url: `https://techbridge.co.kr/freelancer/${freelancer.id}`,
              lastModified: new Date(freelancer.updatedAt || freelancer.createdAt || Date.now()),
              changeFrequency: 'weekly' as const,
              priority: 0.8,
            }));
            dynamicUrls.push(...freelancerUrls);
          }
        }
      } else {
        console.warn('Freelancers API not available during build - skipping dynamic freelancer URLs');
      }
    } catch (freelancerError) {
      console.warn('Failed to fetch freelancers for sitemap:', freelancerError);
    }

    return dynamicUrls;
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