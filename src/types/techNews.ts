export interface TechNewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: TechNewsCategory;
  thumbnail: string;
  date: string;
  author?: string;
  views?: number;
  likes?: number;
  tags?: string[];
}

export type TechNewsCategory = 
  | '전체'
  | '개발 테크'
  | '실리콘밸리' 
  | 'AI 컬럼';

export interface TechNewsFilterOptions {
  category?: TechNewsCategory;
  searchTerm?: string;
  sortBy?: 'latest' | 'views' | 'likes';
} 