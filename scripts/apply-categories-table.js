const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function applyCategories() {
  let connection;
  
  try {
    // Database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '192.168.0.109',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '~Asy10131227',
      database: process.env.DB_NAME || 'jobtracker',
      multipleStatements: true
    });
    
    console.log('Connected to database');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'database', '02_categories_table_only.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    
    // Execute the SQL
    await connection.query(sql);
    
    console.log('✅ Categories table created successfully');
    
    // Verify the table was created
    const [rows] = await connection.query('SELECT * FROM categories ORDER BY display_order');
    console.log(`✅ Found ${rows.length} categories in the database`);
    
    // Display categories
    rows.forEach(row => {
      console.log(`  - ${row.icon} ${row.name} (${row.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Error applying categories table:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Please check your database credentials.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Please check if the database server is running.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('Database does not exist. Please create the database first.');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the script
applyCategories();