const mysql = require('mysql2');

// MySQL connection configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootpassword',
  database: process.env.DB_NAME || 'inventory_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Initialize database
async function initializeDatabase() {
  try {
    // Create products table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Check if table is empty
    const [rows] = await promisePool.query('SELECT COUNT(*) as count FROM products');
    
    if (rows[0].count === 0) {
      // Insert sample data
      await promisePool.query(`
        INSERT INTO products (name, category, quantity, price) VALUES
        ('Laptop Computer', 'Electronics', 15, 899.99),
        ('Wireless Mouse', 'Electronics', 5, 29.99),
        ('Office Chair', 'Furniture', 3, 249.99),
        ('Desk Lamp', 'Furniture', 8, 39.99),
        ('Notebook Pack', 'Stationery', 2, 12.99),
        ('Pen Set', 'Stationery', 25, 8.99),
        ('Monitor 24"', 'Electronics', 6, 299.99),
        ('Keyboard', 'Electronics', 12, 79.99)
      `);
      console.log('Sample data inserted successfully');
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = { pool: promisePool, initializeDatabase };
