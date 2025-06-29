// MariaDB Database Types

export interface DatabaseUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name?: string;
  profile_image?: string;
  role: 'user' | 'admin' | 'freelancer' | 'client';
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface DatabaseProject {
  id: number;
  title: string;
  description: string;
  company: string;
  skills: string; // JSON string
  duration: string;
  budget: string;
  deadline: string;
  type: 'remote' | 'onsite' | 'hybrid';
  level: 'junior' | 'mid' | 'senior' | 'expert';
  status: 'active' | 'closed' | 'draft';
  client_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseBlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string; // JSON string
  author_id: number;
  status: 'published' | 'draft' | 'archived';
  featured_image?: string;
  views: number;
  likes: number;
  created_at: Date;
  updated_at: Date;
  published_at?: Date;
}

export interface DatabaseFreelancer {
  id: number;
  user_id: number;
  title: string;
  description: string;
  skills: string; // JSON string
  experience_level: 'junior' | 'mid' | 'senior' | 'expert';
  hourly_rate?: number;
  availability: 'available' | 'busy' | 'unavailable';
  portfolio_url?: string;
  rating: number;
  total_projects: number;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseJobPosting {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  salary_min?: number;
  salary_max?: number;
  requirements: string; // JSON string
  benefits?: string; // JSON string
  status: 'active' | 'closed' | 'draft';
  employer_id: number;
  created_at: Date;
  updated_at: Date;
  expires_at?: Date;
}

export interface DatabaseCommunityPost {
  id: number;
  title: string;
  content: string;
  category: 'free' | 'qna' | 'study' | 'project-review' | 'share' | 'gallery';
  author_id: number;
  status: 'published' | 'draft' | 'deleted';
  views: number;
  likes: number;
  replies_count: number;
  is_pinned: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseComment {
  id: number;
  content: string;
  author_id: number;
  post_id: number;
  post_type: 'blog' | 'project' | 'community';
  parent_id?: number; // For nested comments
  status: 'published' | 'pending' | 'deleted';
  likes: number;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseSession {
  id: string;
  user_id: number;
  expires_at: Date;
  data: string; // JSON string
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseNotification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  action_url?: string;
  created_at: Date;
  read_at?: Date;
}

// Database Query Result Types
export interface QueryResult<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

export interface InsertResult {
  insertId: number;
  affectedRows: number;
}

export interface UpdateResult {
  affectedRows: number;
  changedRows: number;
}

export interface DeleteResult {
  affectedRows: number;
}

// Database Connection Types
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit?: number;
  acquireTimeout?: number;
  timeout?: number;
}

export interface ConnectionInfo {
  host: string;
  port: number;
  database: string;
  user: string;
  connectionLimit: number;
}

// Migration Types
export interface Migration {
  id: number;
  name: string;
  executed_at: Date;
}

export interface MigrationFile {
  name: string;
  up: string;
  down: string;
}

// Pagination Types
export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search Types
export interface SearchOptions {
  query: string;
  fields: string[];
  filters?: Record<string, any>;
  pagination?: PaginationOptions;
}

export interface SearchResult<T> extends PaginatedResult<T> {
  searchQuery: string;
  searchFields: string[];
}

// Database Error Types
export interface DatabaseError extends Error {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
}

// Export all types individually - no default export needed for types 