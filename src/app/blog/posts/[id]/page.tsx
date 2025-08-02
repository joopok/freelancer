'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useLoading } from '@/components/layout/Loading';
import { formatDate } from '@/utils/format';

// 블로그 포스트 타입 정의
interface BlogPost {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  author: string;
  authorImage: string;
  imageUrl: string;
  tags: string[];
  readTime: string;
}

export default function BlogPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { setLoading } = useLoading();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLocalLoading] = useState(true);
  
  // 페이지 로드 시 로딩 효과 표시
  useEffect(() => {
    setLoading(true);
    setLocalLoading(true);
    
    // 포스트 데이터 로딩 시뮬레이션 (실제로는 API 호출)
    const timer = setTimeout(() => {
      // 실제 프로덕션에서는 API 요청으로 데이터를 가져오게 됩니다
      const postData: BlogPost = {
        id: id as string,
        title: "프리랜서로 성공하기 위한 10가지 팁",
        category: "프리랜서",
        content: `
          <h2>1. 전문 분야를 명확히 정의하세요</h2>
          <p>모든 것을 다 할 수 있다고 주장하는 대신, 특정 분야에 집중하세요. 전문성을 갖추면 경쟁에서 돋보이고 더 높은 단가를 받을 수 있습니다.</p>
          
          <h2>2. 개인 브랜딩에 투자하세요</h2>
          <p>전문적인 포트폴리오 웹사이트, 소셜 미디어 프로필, 그리고 깔끔한 이력서는 신뢰감을 주고 새로운 클라이언트를 유치하는 데 도움이 됩니다.</p>
          
          <h2>3. 네트워크를 꾸준히 확장하세요</h2>
          <p>동료 프리랜서, 잠재 고객, 업계 전문가들과 꾸준히 교류하세요. 많은 프로젝트가 추천이나 입소문을 통해 들어옵니다.</p>
          
          <h2>4. 명확한 계약서를 작성하세요</h2>
          <p>모든 프로젝트를 시작하기 전에 범위, 기대치, 마감일, 지불 조건이 명시된 계약서를 작성하세요. 이는 오해와 분쟁을 방지하는 데 도움이 됩니다.</p>
          
          <h2>5. 재정 관리에 신경 쓰세요</h2>
          <p>프리랜서는 정규직 직원과 달리 세금, 보험, 퇴직금 등을 스스로 관리해야 합니다. 정기적으로 재정 상태를 점검하고 비상금을 마련해 두세요.</p>
          
          <h2>6. 시간 관리 기술을 향상시키세요</h2>
          <p>효율적인 시간 관리는 프리랜서 성공의 핵심입니다. 일정 관리 도구를 활용하고, 집중 작업 시간과 휴식 시간을 분리하세요.</p>
          
          <h2>7. 지속적으로 학습하고 성장하세요</h2>
          <p>빠르게 변화하는 시장에서 경쟁력을 유지하려면 새로운 기술과 지식을 지속적으로 습득해야 합니다.</p>
          
          <h2>8. 적절한 단가를 설정하세요</h2>
          <p>너무 낮은 단가는 장기적으로 지속 가능하지 않으며, 너무 높은 단가는 기회를 놓칠 수 있습니다. 시장 조사를 하고 자신의 가치에 맞는 단가를 설정하세요.</p>
          
          <h2>9. 고객 관계를 소중히 하세요</h2>
          <p>만족한 고객은 반복 비즈니스와 추천의 원천입니다. 명확한 의사소통, 기대치 관리, 그리고 뛰어난 서비스를 제공하세요.</p>
          
          <h2>10. 균형 잡힌 삶을 유지하세요</h2>
          <p>프리랜서는 일과 생활의 경계가 모호할 수 있습니다. 번아웃을 방지하고 창의성을 유지하기 위해 정기적인 휴식과 취미 활동 시간을 확보하세요.</p>
          
          <h3>마치며</h3>
          <p>프리랜서 여정은 도전적이지만 매우 보람찬 경험이 될 수 있습니다. 이러한 팁들을 따르고 자신만의 방식으로 적용하면 성공적인 프리랜서 커리어를 구축할 수 있을 것입니다.</p>
        `,
        date: "2023년 12월 15일",
        author: "김프리",
        authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlZWxhbmNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=1200&q=60",
        tags: ["프리랜서", "커리어", "성공전략", "자기계발"],
        readTime: "7분"
      };
      
      setPost(postData);
      setLocalLoading(false);
      setLoading(false);
    }, 500); // 2초 로딩 효과
    
    return () => clearTimeout(timer);
  }, [id, setLoading]);
  
  // 관련 포스트 데이터 (실제로는 API에서 가져와야 함)
  const relatedPosts = [
    {
      id: "2",
      title: "2023년 개발자 취업 트렌드 분석",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNhcmVlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
      category: "취업정보"
    },
    {
      id: "6",
      title: "포트폴리오 제작 완벽 가이드",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydGZvbGlvfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      category: "포트폴리오"
    },
    {
      id: "7",
      title: "프리랜서를 위한 세금 관리 팁",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGF4fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
      category: "프리랜서"
    }
  ];
  
  // 로딩 중이거나 포스트가 없을 경우
  if (loading || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 포스트 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-gray-800 dark:to-gray-700 py-16 px-4 sm:px-6 lg:px-8 text-white dark:text-gray-100 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <Link 
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="inline-block bg-white dark:bg-gray-800 bg-opacity-20 text-white text-sm px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors"
            >
              {post.category}
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3">
              <Image 
                src={post.authorImage}
                alt={post.author}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{post.author}</p>
              <div className="flex items-center text-sm opacity-80">
                <span>{formatDate(post.date)}</span>
                <span className="mx-2">•</span>
                <span>{post.readTime} 읽기</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 메인 포스트 콘텐츠 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 overflow-hidden mb-10 transition-colors duration-300">
          <div className="relative h-80 md:h-96">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 md:p-10">
            <div 
              className="prose prose-indigo dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-full hover:bg-gray-200 dark:bg-gray-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center mt-6 bg-indigo-50 dark:bg-gray-700 p-6 rounded-lg">
                <div className="w-16 h-16 rounded-full overflow-hidden relative mr-4">
                  <Image 
                    src={post.authorImage}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{post.author}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">프리랜서 분야 전문 에디터</p>
                  <p className="text-gray-600 dark:text-gray-300">프리랜서로 10년간 활동한 경험을 바탕으로 실용적인 조언과 인사이트를 공유합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 관련 포스트 */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">관련 포스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <Link
                key={relatedPost.id}
                href={`/blog/posts/${relatedPost.id}`}
                className="block group"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="relative h-40">
                    <Image
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
                      {relatedPost.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:text-indigo-400 transition-colors">
                      {relatedPost.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* 블로그로 돌아가기 버튼 */}
        <div className="flex justify-center">
          <Link 
            href="/blog"
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:text-indigo-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            블로그 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
} 