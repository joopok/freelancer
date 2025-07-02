const mariadb = require('mariadb');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const dbConfig = {
  host: '192.168.0.109',
  port: 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'jobtracker',
  connectionTimeout: 60000,
  multipleStatements: true
};

async function executeSQLFile() {
  let conn;
  
  try {
    // Create connection pool
    const pool = mariadb.createPool(dbConfig);
    
    // Get a connection
    conn = await pool.getConnection();
    console.log('Connected to MariaDB at', dbConfig.host + ':' + dbConfig.port);
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'database', '02_categories_table.sql');
    const sqlContent = await fs.readFile(sqlFilePath, 'utf8');
    console.log('Read SQL file:', sqlFilePath);
    
    // Execute the SQL statements
    console.log('Executing SQL statements...');
    const result = await conn.query(sqlContent);
    console.log('Successfully executed SQL file!');
    
    // Verify the table was created
    const tables = await conn.query("SHOW TABLES LIKE 'categories'");
    if (tables.length > 0) {
      console.log('✓ Categories table created successfully');
      
      // Show table structure
      const structure = await conn.query("DESCRIBE categories");
      console.log('\nTable structure:');
      console.table(structure);
      
      // Count inserted records
      const count = await conn.query("SELECT COUNT(*) as count FROM categories");
      console.log(`\n✓ Inserted ${count[0].count} categories`);
      
      // Show inserted categories
      const categories = await conn.query("SELECT id, name, name_en, slug, icon, is_active, is_featured FROM categories ORDER BY display_order");
      console.log('\nInserted categories:');
      console.table(categories);
    }
    
    await pool.end();
    console.log('\nDatabase connection closed.');
    
  } catch (err) {
    console.error('Error:', err.message);
    if (err.code) {
      console.error('Error code:', err.code);
    }
    if (err.sqlState) {
      console.error('SQL State:', err.sqlState);
    }
    process.exit(1);
  } finally {
    if (conn) {
      await conn.release();
    }
  }
}

// Run the script
console.log('Starting categories table creation...');
console.log('Database:', dbConfig.database);
console.log('Host:', dbConfig.host);
console.log('Port:', dbConfig.port);
console.log('User:', dbConfig.user);
console.log('');

executeSQLFile();