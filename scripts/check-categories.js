const mysql = require('mysql2/promise');

async function checkCategories() {
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
    
    // Check if categories table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'categories'"
    );
    
    if (tables.length > 0) {
      console.log('✅ Categories table exists');
      
      // Get table structure
      const [columns] = await connection.query('DESCRIBE categories');
      console.log('\n📋 Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field} (${col.Type})`);
      });
      
      // Get data
      const [rows] = await connection.query('SELECT * FROM categories ORDER BY display_order');
      console.log(`\n✅ Found ${rows.length} categories:`);
      
      rows.forEach(row => {
        console.log(`  - ${row.icon || '📁'} ${row.name} (${row.slug})`);
      });
    } else {
      console.log('❌ Categories table does not exist');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the script
checkCategories();