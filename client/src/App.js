import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import DailyReport from './components/DailyReport';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="App">
      <header className="header">
        <h1>🏪 ShopSphere</h1>
        <p>Inventory Management System</p>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            All Products
          </button>
          <button
            className={`tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Product
          </button>
          <button
            className={`tab ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Daily Report
          </button>
        </div>

        {loading && activeTab === 'dashboard' ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard products={products} />
            )}
            {activeTab === 'products' && (
              <ProductList products={products} onUpdate={fetchProducts} />
            )}
            {activeTab === 'add' && (
              <AddProduct onAdd={fetchProducts} />
            )}
            {activeTab === 'report' && (
              <DailyReport />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
