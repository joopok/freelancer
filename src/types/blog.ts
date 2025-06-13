export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category?: string;
  thumbnail: string;
  date: string;
  author?: string;
  views: number;
  likes?: number;
  role?: string;
  tags: string[];
}

export type BlogCategory = 
  | 'ALL NEW'
  | '개발 테크'
  | '디자인 테크'
  | '구매 테크'
  | '인사 테크'
  | '홍보 & 마케팅 테크'
  | '물류 테크'
  | '전략 테크'
  | '제조 테크'
  | '밸런스 UP'
  | '박우찬 칼럼'
  | '실리콘밸리 AI 칼럼'; 