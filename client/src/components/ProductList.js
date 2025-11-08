import React, { useState } from 'react';
import axios from 'axios';

function ProductList({ products, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Out of Stock', className: 'stock-out' };
    if (quantity <= 5) return { label: 'Low Stock', className: 'stock-low' };
    if (quantity <= 15) return { label: 'Medium Stock', className: 'stock-medium' };
    return { label: 'High Stock', className: 'stock-high' };
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/products/${editForm.id}`, editForm);
      setMessage('Product updated successfully!');
      setEditingId(null);
      onUpdate();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating product: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        setMessage('Product deleted successfully!');
        onUpdate();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting product: ' + error.message);
      }
    }
  };

  return (
    <div className="card">
      <h2>All Products</h2>
      
      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
          {message}
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found. Add your first product to get started!</p>
        </div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const status = getStockStatus(product.quantity);
              const isEditing = editingId === product.id;

              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      product.category
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.quantity}
                        onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      product.quantity
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        style={{ width: '100%' }}
                      />
                    ) : (
                      `$${product.price.toFixed(2)}`
                    )}
                  </td>
                  <td>
                    <span className={`stock-badge ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td>
                    {isEditing ? (
                      <div className="action-buttons">
                        <button
                          onClick={handleUpdate}
                          className="btn btn-primary btn-small"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn btn-secondary btn-small"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-primary btn-small"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-danger btn-small"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;
