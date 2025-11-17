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
- **MySQL** database (mysql2)
- RESTful API endpoints

### Frontend
- **React** 18.2.0
- **Axios** for API calls
- **Nginx** for production serving
- Modern CSS with responsive design

### DevOps
- **Docker** containers for all services
- **Docker Compose** for orchestration
- **MySQL 8.0** for data persistence

## Database Schema

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

### Option 1: Docker Deployment (Recommended)

Docker provides the easiest way to run the entire application with all dependencies.

#### Prerequisites
- Docker Engine (v20.10+)
- Docker Compose (v2.0+)

#### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd Employee-Management-system

# Build and start all containers
docker-compose up --build -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MySQL: localhost:3306
```

#### Docker Commands
```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v

# Restart services
docker-compose restart
```

For detailed Docker documentation, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

### Option 2: Local Development (Without Docker)

#### Prerequisites
- Node.js (v14 or higher)
- MySQL 8.0 installed and running
- npm or yarn

#### Step 1: Setup MySQL Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE inventory_db;
exit;
```

#### Step 2: Configure Environment
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_db
PORT=5000
```

#### Step 3: Install Dependencies
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

#### Step 4: Start the Application

**Terminal 1 - Start Backend:**
```bash
npm start
```

**Terminal 2 - Start Frontend:**
```bash
npm run client
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Docker Architecture

The application uses a multi-container Docker setup:

```
┌─────────────────┐
│   Frontend      │  Port 3000 (Nginx + React)
│   Container     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │  Port 5000 (Node.js + Express)
│   Container     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MySQL         │  Port 3306 (MySQL 8.0)
│   Container     │
└─────────────────┘
```

### Container Details
- **Frontend**: React app built and served by Nginx
- **Backend**: Node.js/Express API with MySQL connection
- **Database**: MySQL 8.0 with persistent volume storage

All containers communicate via a dedicated Docker network.

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