import mariadb, { Pool, PoolConnection } from 'mariadb';

// Database configuration interface
interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit: number;
  acquireTimeout: number;
  timeout: number;
}

// Default database configuration
const defaultConfig: DatabaseConfig = {
  host: process.env.MARIADB_HOST || '192.168.0.109',
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || '',
  database: process.env.MARIADB_DATABASE || 'aiproject02_db',
  connectionLimit: parseInt(process.env.MARIADB_CONNECTION_LIMIT || '10'),
  acquireTimeout: parseInt(process.env.MARIADB_ACQUIRE_TIMEOUT || '60000'),
  timeout: parseInt(process.env.MARIADB_TIMEOUT || '60000'),
};

// Create connection pool
let pool: Pool | null = null;

export const createPool = (config: Partial<DatabaseConfig> = {}): Pool => {
  if (pool) {
    return pool;
  }

  const finalConfig = { ...defaultConfig, ...config };
  
  pool = mariadb.createPool({
    host: finalConfig.host,
    port: finalConfig.port,
    user: finalConfig.user,
    password: finalConfig.password,
    database: finalConfig.database,
    connectionLimit: finalConfig.connectionLimit,
    acquireTimeout: finalConfig.acquireTimeout,
    trace: process.env.NODE_ENV !== 'production',
    // Additional MariaDB specific options
    charset: 'utf8mb4',
    timezone: 'Z',
    dateStrings: false,
    supportBigNumbers: true,
    bigNumberStrings: false,
  });

  return pool;
};

// Get database connection
export const getConnection = async (): Promise<PoolConnection> => {
  if (!pool) {
    pool = createPool();
  }
  
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    // Check if it's a connection refused error (MariaDB not running)
    if ((error as any)?.cause?.code === 'ECONNREFUSED') {
      throw new Error('MariaDB server is not running. Please start MariaDB service.');
    }
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Execute query with connection management
export const executeQuery = async <T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> => {
  let connection: PoolConnection | null = null;
  
  try {
    connection = await getConnection();
    const results = await connection.query(query, params);
    return results as T[];
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Execute single query (for INSERT, UPDATE, DELETE)
export const executeSingleQuery = async (
  query: string, 
  params: any[] = []
): Promise<mariadb.UpsertResult> => {
  let connection: PoolConnection | null = null;
  
  try {
    connection = await getConnection();
    const result = await connection.query(query, params);
    return result as mariadb.UpsertResult;
  } catch (error) {
    console.error('Single query execution error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Transaction wrapper
export const executeTransaction = async <T>(
  callback: (connection: PoolConnection) => Promise<T>
): Promise<T> => {
  let connection: PoolConnection | null = null;
  
  try {
    connection = await getConnection();
    await connection.beginTransaction();
    
    const result = await callback(connection);
    
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Transaction error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Close pool connection
export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

// Health check
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const result = await executeQuery('SELECT 1 as health_check');
    return result.length > 0 && result[0].health_check === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Database initialization
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Create database if not exists
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS ${defaultConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
    await executeSingleQuery(createDbQuery);
    
    console.log(`Database ${defaultConfig.database} initialized successfully`);
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export default {
  createPool,
  getConnection,
  executeQuery,
  executeSingleQuery,
  executeTransaction,
  closePool,
  checkDatabaseHealth,
  initializeDatabase,
}; 