# ShopSphere - Inventory Management System

A full-stack inventory management system for ShopSphere retail company to track stock of items in their warehouse.

## Features

### Core Functionality
- ✅ **Add New Products** - Add products with name, category, quantity, and price
- ✅ **Update Stock Quantities** - Edit product information and stock levels
- ✅ **View All Products** - Display complete product catalog
- ✅ **Low Stock Alerts** - Color-coded warnings for products with low inventory
- ✅ **Daily Inventory Report** - Generate comprehensive reports with category summaries

### Dashboard Features
- Real-time inventory statistics
- Color-coded stock status (High/Medium/Low/Out of Stock)
- Low stock alerts with visual indicators
- Category-wise product summary
- Total inventory value calculation

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database (better-sqlite3)
- RESTful API endpoints

### Frontend
- **React** 18.2.0
- **Axios** for API calls
- Modern CSS with responsive design

## Database Schema

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  price REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/low-stock` - Get low stock products (threshold: 5)

### Reports
- `GET /api/reports/daily-inventory` - Generate daily inventory report

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Start the Application

**Option 1: Development Mode (Both servers)**

Terminal 1 - Start Backend:
```bash
npm start
```

Terminal 2 - Start Frontend:
```bash
npm run client
```

**Option 2: Production Build**

```bash
# Build the React app
npm run build

# Serve the built app (requires serve package)
npx serve -s client/build
```

### Step 3: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Usage Guide

### Dashboard Tab
- View overall inventory statistics
- Monitor low stock alerts
- See color-coded stock status for all products

### All Products Tab
- View complete product list
- Edit product details inline
- Delete products
- Update stock quantities

### Add Product Tab
- Add new products to inventory
- Select from predefined categories
- Set initial stock and price

### Daily Report Tab
- View comprehensive daily inventory report
- See category-wise breakdown
- Print reports for record-keeping
- Track total inventory value

## Stock Status Color Coding

- 🟢 **High Stock** - Quantity > 15
- 🟡 **Medium Stock** - Quantity 6-15
- 🔴 **Low Stock** - Quantity 1-5
- ⚫ **Out of Stock** - Quantity = 0

## Sample Data

The system comes with pre-populated sample data including:
- Electronics (Laptops, Mice, Monitors, Keyboards)
- Furniture (Chairs, Lamps)
- Stationery (Notebooks, Pens)

## Project Structure

```
.
├── server/
│   ├── index.js          # Express server and API routes
│   ├── database.js       # SQLite database setup
│   └── inventory.db      # SQLite database file (auto-generated)
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── ProductList.js
│   │   │   ├── AddProduct.js
│   │   │   └── DailyReport.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── package.json
└── README.md
```

## Future Enhancements

- User authentication and authorization
- Advanced filtering and search
- Export reports to PDF/Excel
- Product images
- Barcode scanning
- Supplier management
- Order tracking
- Multi-warehouse support

## License

ISC

## Author

ShopSphere Development Team