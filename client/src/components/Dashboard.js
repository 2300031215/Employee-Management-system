import React from 'react';

function Dashboard({ products }) {
  const totalProducts = products.length;
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const lowStockProducts = products.filter(p => p.quantity <= 5);

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', className: 'stock-out' };
    if (quantity <= 5) return { label: 'Low Stock', className: 'stock-low' };
    if (quantity <= 15) return { label: 'Medium Stock', className: 'stock-medium' };
    return { label: 'High Stock', className: 'stock-high' };
  };

  return (
    <div>
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="value">{totalProducts}</div>
        </div>
        <div className="stat-card">
          <h3>Total Items</h3>
          <div className="value">{totalItems}</div>
        </div>
        <div className="stat-card total-value">
          <h3>Total Value</h3>
          <div className="value">${totalValue.toFixed(2)}</div>
        </div>
        <div className="stat-card low-stock">
          <h3>Low Stock Alerts</h3>
          <div className="value">{lowStockProducts.length}</div>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="card">
          <h2>⚠️ Low Stock Alerts</h2>
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map(product => {
                const status = getStockStatus(product.quantity);
                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>📊 Stock Overview</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const status = getStockStatus(product.quantity);
              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
