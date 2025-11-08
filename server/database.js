const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'inventory.db'));

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert sample data if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, category, quantity, price) 
    VALUES (?, ?, ?, ?)
  `);
  
  insert.run('Laptop Computer', 'Electronics', 15, 899.99);
  insert.run('Wireless Mouse', 'Electronics', 5, 29.99);
  insert.run('Office Chair', 'Furniture', 3, 249.99);
  insert.run('Desk Lamp', 'Furniture', 8, 39.99);
  insert.run('Notebook Pack', 'Stationery', 2, 12.99);
  insert.run('Pen Set', 'Stationery', 25, 8.99);
  insert.run('Monitor 24"', 'Electronics', 6, 299.99);
  insert.run('Keyboard', 'Electronics', 12, 79.99);
}

module.exports = db;
