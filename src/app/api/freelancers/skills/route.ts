import { NextRequest, NextResponse } from 'next/server';

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    // 프리랜서들이 보유한 고유한 기술 스택 목록을 반환
    const skills = [
      // 프론트엔드 기술
      'React',
      'Vue.js',
      'Angular',
      'Next.js',
      'Nuxt.js',
      'TypeScript',
      'JavaScript',
      'HTML/CSS',
      'Tailwind CSS',
      'SCSS',
      'Redux',
      'Vuex',
      'Pinia',
      'Webpack',
      'Jest',
      
      // 백엔드 기술
      'Node.js',
      'Python',
      'Java',
      'Spring Boot',
      'Spring',
      'Django',
      'FastAPI',
      'Express',
      'PHP',
      'Ruby on Rails',
      
      // 모바일 개발
      'React Native',
      'Flutter',
      'iOS',
      'Android',
      'Swift',
      'SwiftUI',
      'Kotlin',
      'Xamarin',
      'Ionic',
      
      // 데이터베이스
      'MongoDB',
      'PostgreSQL',
      'MySQL',
      'Redis',
      'SQLite',
      'Oracle',
      'MariaDB',
      
      // 클라우드 & DevOps
      'AWS',
      'Docker',
      'Kubernetes',
      'Jenkins',
      'Terraform',
      'Ansible',
      'Azure',
      'GCP',
      
      // 데이터 사이언스 & AI
      'TensorFlow',
      'PyTorch',
      'Scikit-learn',
      'Pandas',
      'NumPy',
      'Machine Learning',
      'Deep Learning',
      'NLP',
      'Computer Vision',
      'MLOps',
      
      // 디자인 도구
      'Figma',
      'Sketch',
      'Adobe XD',
      'Photoshop',
      'Illustrator',
      'InDesign',
      'After Effects',
      'Premiere Pro',
      'Cinema 4D',
      'Blender',
      '3ds Max',
      'Prototyping',
      'User Research',
      'Design System',
      
      // 마케팅 도구
      'Google Analytics',
      'Facebook Ads',
      'Google Ads',
      'SEO',
      'SEM',
      'Content Marketing',
      'Social Media',
      'Email Marketing',
      'Marketing Automation',
      'HubSpot',
      'Salesforce',
      
      // 기타 기술
      'GraphQL',
      'REST API',
      'Microservices',
      'Blockchain',
      'Solidity',
      'Web3.js',
      'Firebase',
      'Git',
      'Linux',
      'Bash',
      'API Integration',
      'Testing',
      'Unit Testing',
      'E2E Testing',
      'Performance Optimization',
      'Security',
      'Agile',
      'Scrum'
    ];

    return NextResponse.json(
      {
        success: true,
        data: skills.sort(), // 알파벳 순으로 정렬
        message: 'Skills loaded successfully'
      },
      { 
        status: 200,
        headers: corsHeaders
      }
    );

  } catch (error) {
    console.error('Skills API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to load skills'
      },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}