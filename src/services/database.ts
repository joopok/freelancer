import { 
  executeQuery, 
  executeSingleQuery, 
  executeTransaction,
  checkDatabaseHealth,
  initializeDatabase 
} from '@/utils/database';

import {
  DatabaseUser,
  DatabaseProject,
  DatabaseBlogPost,
  DatabaseFreelancer,
  DatabaseCommunityPost,
  PaginationOptions,
  PaginatedResult,
  SearchOptions,
  SearchResult,
  InsertResult,
  UpdateResult,
  DeleteResult
} from '@/types/database';

// User Service
export class UserService {
  static async findById(id: number): Promise<DatabaseUser | null> {
    const result = await executeQuery<DatabaseUser>(
      'SELECT * FROM users WHERE id = ? AND status != "deleted"',
      [id]
    );
    return result[0] || null;
  }

  static async findByEmail(email: string): Promise<DatabaseUser | null> {
    const result = await executeQuery<DatabaseUser>(
      'SELECT * FROM users WHERE email = ? AND status != "deleted"',
      [email]
    );
    return result[0] || null;
  }

  static async findByUsername(username: string): Promise<DatabaseUser | null> {
    const result = await executeQuery<DatabaseUser>(
      'SELECT * FROM users WHERE username = ? AND status != "deleted"',
      [username]
    );
    return result[0] || null;
  }

  static async create(userData: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<InsertResult> {
    const query = `
      INSERT INTO users (username, email, password_hash, full_name, profile_image, role, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userData.username,
      userData.email,
      userData.password_hash,
      userData.full_name || null,
      userData.profile_image || null,
      userData.role,
      userData.status
    ];
    
    return await executeSingleQuery(query, params) as InsertResult;
  }

  static async update(id: number, userData: Partial<DatabaseUser>): Promise<any> {
    const fields = Object.keys(userData).filter(key => key !== 'id').map(key => `${key} = ?`);
    const values = Object.values(userData).filter((_, index) => Object.keys(userData)[index] !== 'id');
    
    const query = `UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    const params = [...values, id];
    
    return await executeSingleQuery(query, params);
  }

  static async delete(id: number): Promise<any> {
    return await executeSingleQuery(
      'UPDATE users SET status = "deleted", updated_at = NOW() WHERE id = ?',
      [id]
    );
  }

  static async updateLastLogin(id: number): Promise<void> {
    await executeSingleQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [id]
    );
  }
}

// Project Service
export class ProjectService {
  static async findAll(options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<DatabaseProject>> {
    const offset = (options.page - 1) * options.limit;
    const orderBy = options.sortBy ? `ORDER BY ${options.sortBy} ${options.sortOrder || 'DESC'}` : 'ORDER BY created_at DESC';
    
    const [projects, countResult] = await Promise.all([
      executeQuery<DatabaseProject>(
        `SELECT * FROM projects WHERE status = "active" ${orderBy} LIMIT ? OFFSET ?`,
        [options.limit, offset]
      ),
      executeQuery<{ total: number }>('SELECT COUNT(*) as total FROM projects WHERE status = "active"')
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / options.limit);

    return {
      data: projects,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      }
    };
  }

  static async findById(id: number): Promise<DatabaseProject | null> {
    const result = await executeQuery<DatabaseProject>(
      'SELECT * FROM projects WHERE id = ? AND status != "deleted"',
      [id]
    );
    return result[0] || null;
  }

  static async findByType(type: 'remote' | 'onsite' | 'hybrid', options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<DatabaseProject>> {
    const offset = (options.page - 1) * options.limit;
    const orderBy = options.sortBy ? `ORDER BY ${options.sortBy} ${options.sortOrder || 'DESC'}` : 'ORDER BY created_at DESC';
    
    const [projects, countResult] = await Promise.all([
      executeQuery<DatabaseProject>(
        `SELECT * FROM projects WHERE type = ? AND status = "active" ${orderBy} LIMIT ? OFFSET ?`,
        [type, options.limit, offset]
      ),
      executeQuery<{ total: number }>('SELECT COUNT(*) as total FROM projects WHERE type = ? AND status = "active"', [type])
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / options.limit);

    return {
      data: projects,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      }
    };
  }

  static async search(searchOptions: SearchOptions): Promise<SearchResult<DatabaseProject>> {
    const { query, fields, filters = {}, pagination = { page: 1, limit: 10 } } = searchOptions;
    const offset = (pagination.page - 1) * pagination.limit;
    
    // Build search conditions
    const searchConditions = fields.map(field => `${field} LIKE ?`).join(' OR ');
    const searchParams = fields.map(() => `%${query}%`);
    
    // Build filter conditions
    const filterConditions = Object.keys(filters).map(key => `${key} = ?`);
    const filterParams = Object.values(filters);
    
    let whereClause = `WHERE status = "active"`;
    let queryParams = [];
    
    if (searchConditions) {
      whereClause += ` AND (${searchConditions})`;
      queryParams.push(...searchParams);
    }
    
    if (filterConditions.length > 0) {
      whereClause += ` AND ${filterConditions.join(' AND ')}`;
      queryParams.push(...filterParams);
    }
    
    const [projects, countResult] = await Promise.all([
      executeQuery<DatabaseProject>(
        `SELECT * FROM projects ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...queryParams, pagination.limit, offset]
      ),
      executeQuery<{ total: number }>(`SELECT COUNT(*) as total FROM projects ${whereClause}`, queryParams)
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data: projects,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1
      },
      searchQuery: query,
      searchFields: fields
    };
  }

  static async create(projectData: Omit<DatabaseProject, 'id' | 'created_at' | 'updated_at'>): Promise<InsertResult> {
    const query = `
      INSERT INTO projects (title, description, company, skills, duration, budget, deadline, type, level, status, client_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      projectData.title,
      projectData.description,
      projectData.company,
      projectData.skills,
      projectData.duration,
      projectData.budget,
      projectData.deadline,
      projectData.type,
      projectData.level,
      projectData.status,
      projectData.client_id
    ];
    
    return await executeSingleQuery(query, params) as InsertResult;
  }

  static async update(id: number, projectData: Partial<DatabaseProject>): Promise<any> {
    const fields = Object.keys(projectData).filter(key => key !== 'id').map(key => `${key} = ?`);
    const values = Object.values(projectData).filter((_, index) => Object.keys(projectData)[index] !== 'id');
    
    const query = `UPDATE projects SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    const params = [...values, id];
    
    return await executeSingleQuery(query, params);
  }

  static async delete(id: number): Promise<any> {
    return await executeSingleQuery(
      'UPDATE projects SET status = "deleted", updated_at = NOW() WHERE id = ?',
      [id]
    );
  }
}

// Blog Service
export class BlogService {
  static async findAll(options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<DatabaseBlogPost>> {
    const offset = (options.page - 1) * options.limit;
    const orderBy = options.sortBy ? `ORDER BY ${options.sortBy} ${options.sortOrder || 'DESC'}` : 'ORDER BY published_at DESC';
    
    const [posts, countResult] = await Promise.all([
      executeQuery<DatabaseBlogPost>(
        `SELECT * FROM blog_posts WHERE status = "published" ${orderBy} LIMIT ? OFFSET ?`,
        [options.limit, offset]
      ),
      executeQuery<{ total: number }>('SELECT COUNT(*) as total FROM blog_posts WHERE status = "published"')
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / options.limit);

    return {
      data: posts,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      }
    };
  }

  static async findById(id: number): Promise<DatabaseBlogPost | null> {
    const result = await executeQuery<DatabaseBlogPost>(
      'SELECT * FROM blog_posts WHERE id = ? AND status = "published"',
      [id]
    );
    return result[0] || null;
  }

  static async findByCategory(category: string, options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<DatabaseBlogPost>> {
    const offset = (options.page - 1) * options.limit;
    const orderBy = options.sortBy ? `ORDER BY ${options.sortBy} ${options.sortOrder || 'DESC'}` : 'ORDER BY published_at DESC';
    
    const [posts, countResult] = await Promise.all([
      executeQuery<DatabaseBlogPost>(
        `SELECT * FROM blog_posts WHERE category = ? AND status = "published" ${orderBy} LIMIT ? OFFSET ?`,
        [category, options.limit, offset]
      ),
      executeQuery<{ total: number }>('SELECT COUNT(*) as total FROM blog_posts WHERE category = ? AND status = "published"', [category])
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / options.limit);

    return {
      data: posts,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages,
        hasNext: options.page < totalPages,
        hasPrev: options.page > 1
      }
    };
  }

  static async incrementViews(id: number): Promise<void> {
    await executeSingleQuery(
      'UPDATE blog_posts SET views = views + 1 WHERE id = ?',
      [id]
    );
  }

  static async incrementLikes(id: number): Promise<void> {
    await executeSingleQuery(
      'UPDATE blog_posts SET likes = likes + 1 WHERE id = ?',
      [id]
    );
  }
}

// Database Health Check
export class DatabaseHealthService {
  static async checkHealth(): Promise<{ healthy: boolean; message: string }> {
    try {
      const isHealthy = await checkDatabaseHealth();
      return {
        healthy: isHealthy,
        message: isHealthy ? 'Database connection is healthy' : 'Database connection failed'
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Database health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static async initialize(): Promise<{ success: boolean; message: string }> {
    try {
      await initializeDatabase();
      return {
        success: true,
        message: 'Database initialized successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: `Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

const databaseServices = {
  UserService,
  ProjectService,
  BlogService,
  DatabaseHealthService,
};

export default databaseServices; 