const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function alterCategories() {
  let connection;
  
  try {
    // Database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '192.168.0.109',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '~Asy10131227',
      database: process.env.DB_NAME || 'jobtracker',
    });
    
    console.log('Connected to database');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'database', '03_alter_categories_table.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    
    // Execute the SQL
    await connection.query(sql);
    
    console.log('✅ Categories table altered successfully');
    
    // Verify the change
    const [columns] = await connection.query('DESCRIBE categories');
    const hasParentId = columns.some(col => col.Field === 'parent_id');
    
    if (hasParentId) {
      console.log('✅ parent_id column exists');
    } else {
      console.log('❌ parent_id column was not added');
    }
    
  } catch (error) {
    console.error('❌ Error altering categories table:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the script
alterCategories();