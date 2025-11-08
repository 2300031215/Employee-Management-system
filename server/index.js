const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id DESC').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get products with low stock (quantity <= 5)
app.get('/api/products/low-stock', (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    const products = db.prepare('SELECT * FROM products WHERE quantity <= ? ORDER BY quantity ASC').all(threshold);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  try {
    const { name, category, quantity, price } = req.body;
    
    if (!name || !category || quantity === undefined || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO products (name, category, quantity, price) 
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(name, category, parseInt(quantity), parseFloat(price));
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product stock quantity
app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price } = req.body;
    
    const stmt = db.prepare(`
      UPDATE products 
      SET name = ?, category = ?, quantity = ?, price = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);
    
    const result = stmt.run(name, category, parseInt(quantity), parseFloat(price), id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate daily inventory report
app.get('/api/reports/daily-inventory', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
    const lowStockCount = products.filter(p => p.quantity <= 5).length;
    
    const categorySummary = products.reduce((acc, p) => {
      if (!acc[p.category]) {
        acc[p.category] = { count: 0, value: 0, items: 0 };
      }
      acc[p.category].count++;
      acc[p.category].value += p.quantity * p.price;
      acc[p.category].items += p.quantity;
      return acc;
    }, {});
    
    const report = {
      date: new Date().toISOString().split('T')[0],
      totalProducts: products.length,
      totalItems,
      totalValue: totalValue.toFixed(2),
      lowStockCount,
      categorySummary,
      products
    };
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
