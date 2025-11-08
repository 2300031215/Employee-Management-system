import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DailyReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reports/daily-inventory');
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Generating report...</div>;
  }

  if (!report) {
    return <div className="card">Error loading report</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>📅 Daily Inventory Report</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Report Date: {report.date}
        </p>

        <div className="dashboard" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <h3>Total Products</h3>
            <div className="value">{report.totalProducts}</div>
          </div>
          <div className="stat-card">
            <h3>Total Items in Stock</h3>
            <div className="value">{report.totalItems}</div>
          </div>
          <div className="stat-card total-value">
            <h3>Total Inventory Value</h3>
            <div className="value">${report.totalValue}</div>
          </div>
          <div className="stat-card low-stock">
            <h3>Low Stock Items</h3>
            <div className="value">{report.lowStockCount}</div>
          </div>
        </div>

        <div className="report-section">
          <h3>Category Summary</h3>
          <div className="category-grid">
            {Object.entries(report.categorySummary).map(([category, data]) => (
              <div key={category} className="category-card">
                <h4>{category}</h4>
                <p>Products: {data.count}</p>
                <p>Total Items: {data.items}</p>
                <p>Value: ${data.value.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="report-section">
          <h3>Complete Product List</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {report.products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>${(product.quantity * product.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'right' }}>
          <button 
            onClick={() => window.print()} 
            className="btn btn-primary"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default DailyReport;
