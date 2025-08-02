import Script from 'next/script';

interface JsonLdProps {
  data: object;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// 조직 스키마
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TechBridge',
  alternateName: '테크브릿지',
  url: 'https://techbridge.co.kr',
  logo: 'https://techbridge.co.kr/logo.png',
  description: 'IT 프리랜서와 기업을 연결하는 대한민국 최고의 매칭 플랫폼',
  foundingDate: '2024',
  founders: [
    {
      '@type': 'Person',
      name: 'TechBridge Team',
    },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+82-2-1234-5678',
    contactType: 'customer service',
    areaServed: 'KR',
    availableLanguage: ['Korean', 'English'],
  },
  sameAs: [
    'https://www.facebook.com/techbridge',
    'https://www.linkedin.com/company/techbridge',
    'https://twitter.com/techbridge_kr',
  ],
};

// 웹사이트 스키마
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'TechBridge',
  url: 'https://techbridge.co.kr',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://techbridge.co.kr/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// 프로젝트 스키마 생성 함수
export function generateProjectSchema(project: {
  id: string;
  title: string;
  description: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  skills?: string[];
  company?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: project.title,
    description: project.description,
    identifier: {
      '@type': 'PropertyValue',
      name: 'Project ID',
      value: project.id,
    },
    datePosted: new Date().toISOString(),
    validThrough: project.endDate,
    employmentType: 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: project.company || 'TechBridge Client',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: project.location || '대한민국',
        addressCountry: 'KR',
      },
    },
    baseSalary: project.budget ? {
      '@type': 'MonetaryAmount',
      currency: 'KRW',
      value: {
        '@type': 'QuantitativeValue',
        value: project.budget,
        unitText: 'MONTH',
      },
    } : undefined,
    skills: project.skills?.join(', '),
  };
}

// 프리랜서 프로필 스키마 생성 함수
export function generateFreelancerSchema(freelancer: {
  id: string;
  name: string;
  title: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  location?: string;
  profileImage?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://techbridge.co.kr/freelancer/${freelancer.id}`,
    name: freelancer.name,
    jobTitle: freelancer.title,
    description: freelancer.bio,
    image: freelancer.profileImage,
    url: `https://techbridge.co.kr/freelancer/${freelancer.id}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: freelancer.location,
      addressCountry: 'KR',
    },
    knowsAbout: freelancer.skills,
    hasOccupation: {
      '@type': 'Occupation',
      name: freelancer.title,
      experienceRequirements: freelancer.experience,
    },
  };
}

// 빵가루 네비게이션 스키마 생성 함수
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// FAQ 스키마 생성 함수
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// 서비스 스키마
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'IT 프리랜서 매칭 서비스',
  provider: {
    '@type': 'Organization',
    name: 'TechBridge',
  },
  areaServed: {
    '@type': 'Country',
    name: '대한민국',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'IT 프리랜서 서비스',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '웹 개발',
          description: 'React, Vue, Angular 등 프론트엔드 개발',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '백엔드 개발',
          description: 'Node.js, Python, Java 등 서버 개발',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '모바일 앱 개발',
          description: 'iOS, Android, React Native 앱 개발',
        },
      },
    ],
  },
};