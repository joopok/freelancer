import { useState, useEffect, useMemo } from 'react';
import type { BlogPost, BlogCategory } from '@/types/blog';

interface UseBlogPostsProps {
  category?: BlogCategory;
  length?: number;
  role?: string;
}

export function useBlogPosts({ category, length = 12, role }: UseBlogPostsProps = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 임시 데이터 생성 - useMemo를 사용하여 한 번만 생성
  const generatePosts = useMemo(() => {
    return Array.from({ length }, (_, i) => ({
      id: `${category ? `${category}-` : ''}${i + 1}`,
      title: `[${category || '블로그'}] ${i + 1}번째 포스트 제목입니다.`,
      excerpt: '프리랜서로 일하면서 겪게 되는 다양한 경험과 노하우를 공유합니다. 실제 프로젝트 진행 시 도움이 될 만한 내용들을 정리했습니다.',
      category: category || '블로그',
      thumbnail: `/images/blog/post-${(i % 4) + 1}.jpg`,
      date: new Date(2024, 2, i + 1).toLocaleDateString(),
      author: ['김프리', '이랜서', '박개발', '정디자인'][i % 4],
      views: Math.floor(Math.random() * 10000) + 1000,
      likes: Math.floor(Math.random() * 1000) + 100,
      tags: ['개발', '프리랜서', 'IT', '경험담'].slice(0, Math.floor(Math.random() * 3) + 1),
      ...(role && { role }),
    }));
  }, [category, length, role]);

  // 초기 데이터 설정
  useEffect(() => {
    setPosts(generatePosts);
    setLoading(false);
  }, [generatePosts]);

  return { posts, loading };
} 