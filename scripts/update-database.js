#!/usr/bin/env node

const mariadb = require('mariadb');
const fs = require('fs');
const path = require('path');

// Database configuration
const config = {
  host: process.env.MARIADB_HOST || '192.168.0.109',
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || '',
  database: process.env.MARIADB_DATABASE || 'jobtracker',
  charset: 'utf8mb4'
};

async function updateDatabase() {
  let connection;
  
  try {
    console.log('🔗 Connecting to MariaDB...');
    connection = await mariadb.createConnection(config);
    console.log('✅ Connected to MariaDB successfully');

    // Read and execute the schema update file
    const schemaPath = path.join(__dirname, '../database/05_alter_freelancers_missing_fields.sql');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema update file not found:', schemaPath);
      return;
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Reading schema update file...');

    // Split SQL statements by semicolon and execute each one
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`🔄 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await connection.query(statement);
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error) {
          // Some statements might fail if columns already exist, that's okay
          if (error.message.includes('Duplicate column') || error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}/${statements.length} skipped (already exists)`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
          }
        }
      }
    }

    // Test the freelancer query
    console.log('🧪 Testing freelancer query...');
    const testQuery = `
      SELECT 
        f.id,
        COALESCE(f.name, u.full_name, 'Unknown') as name,
        COALESCE(f.rating, 0) as rating,
        COALESCE(f.completed_projects, 0) as projectCount,
        COALESCE(f.view_count, 0) as viewCount,
        COALESCE(f.type, '개인') as type,
        COALESCE(f.category, '기타') as category,
        f.title
      FROM freelancers f
      LEFT JOIN users u ON f.user_id = u.id
      LIMIT 3
    `;

    const testResult = await connection.query(testQuery);
    console.log('📊 Sample freelancer data:');
    console.table(testResult);

    console.log('🎉 Database update completed successfully!');

  } catch (error) {
    console.error('❌ Database update failed:', error.message);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database does not exist. Please create it first or update the configuration.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('💡 Cannot connect to MariaDB. Please ensure the server is running.');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔐 Database connection closed');
    }
  }
}

// Run the update
updateDatabase();