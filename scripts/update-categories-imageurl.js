const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function updateCategoriesImageUrl() {
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
    const sqlPath = path.join(__dirname, '..', 'database', '04_update_categories_imageurl.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    
    // Execute the SQL
    const [result] = await connection.query(sql);
    
    console.log(`✅ Updated ${result.affectedRows} categories with image URLs`);
    
    // Verify the update
    const [rows] = await connection.query('SELECT id, name, slug, image_url FROM categories ORDER BY id');
    console.log('\n📋 Updated categories:');
    rows.forEach(row => {
      console.log(`  - ${row.name} (${row.slug}): ${row.image_url}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating categories:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed');
    }
  }
}

// Run the script
updateCategoriesImageUrl();