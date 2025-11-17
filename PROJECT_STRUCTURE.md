# Project Structure

This document outlines the complete project structure for the Dockerized Fullstack Application.

## Directory Tree

```
Employee-Management-system/
├── client/                          # Frontend React Application
│   ├── public/
│   │   └── index.html              # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js        # Dashboard component
│   │   │   ├── ProductList.js      # Product list component
│   │   │   ├── AddProduct.js       # Add product form
│   │   │   └── DailyReport.js      # Report generation
│   │   ├── App.js                  # Main application component
│   │   ├── App.css                 # Main styles
│   │   ├── index.js                # React entry point
│   │   └── index.css               # Global styles
│   ├── package.json                # Frontend dependencies
│   ├── Dockerfile                  # Frontend Docker image (Multi-stage: build + nginx)
│   ├── nginx.conf                  # Nginx configuration for frontend
│   └── .dockerignore               # Files to exclude from frontend Docker build
│
├── server/                          # Backend Node.js Application
│   ├── index.js                    # Express server and API routes
│   └── database.js                 # MySQL database configuration and initialization
│
├── package.json                    # Backend dependencies
├── Dockerfile                      # Backend Docker image
├── .dockerignore                   # Files to exclude from backend Docker build
├── docker-compose.yml              # Docker Compose orchestration file
│
├── README.md                       # Main project documentation
├── DOCKER_GUIDE.md                 # Comprehensive Docker deployment guide
├── IMPLEMENTATION_SUMMARY.md       # Implementation details
├── PROJECT_STRUCTURE.md           # This file
│
└── .gitignore                     # Git ignore patterns
```

## Docker Files

### 1. Backend Dockerfile (`/Dockerfile`)
- Base Image: `node:18-alpine`
- Purpose: Containerize the Node.js/Express backend
- Exposed Port: 5000
- Key Features:
  - Production dependencies only
  - Minimal alpine image for smaller size
  - Automatic database initialization on startup

### 2. Frontend Dockerfile (`/client/Dockerfile`)
- Multi-stage build:
  - Stage 1 (Build): `node:18-alpine` - Build React application
  - Stage 2 (Serve): `nginx:alpine` - Serve production build
- Exposed Port: 80 (mapped to host 3000)
- Key Features:
  - Optimized production build
  - Small final image size (~50MB)
  - Nginx proxy configuration for API requests

### 3. Nginx Configuration (`/client/nginx.conf`)
- Purpose: Configure nginx to serve React app and proxy API requests
- Features:
  - Serves static files from `/usr/share/nginx/html`
  - Proxies `/api/*` requests to backend service
  - SPA routing support (all routes -> index.html)

### 4. Docker Compose (`/docker-compose.yml`)
- Orchestrates three services:
  1. **MySQL Database** (mysql:8.0)
  2. **Backend API** (custom image from `/Dockerfile`)
  3. **Frontend Web** (custom image from `/client/Dockerfile`)
- Features:
  - Custom bridge network for service communication
  - Named volume for MySQL data persistence
  - Health checks for startup coordination
  - Environment variables for configuration

### 5. Docker Ignore Files
- `/dockerignore`: Excludes files from backend build
- `/client/.dockerignore`: Excludes files from frontend build
- Common exclusions:
  - node_modules
  - Build artifacts
  - Development files
  - Git files

## Application Components

### Backend (Node.js + Express + MySQL)
**File: `server/index.js`**
- REST API server running on port 5000
- Endpoints:
  - `GET /api/products` - List all products
  - `GET /api/products/low-stock` - List low stock products
  - `POST /api/products` - Add new product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product
  - `GET /api/reports/daily-inventory` - Generate inventory report

**File: `server/database.js`**
- MySQL connection pool using `mysql2` package
- Automatic database initialization
- Sample data seeding (8 products)
- Exports promise-based pool for async/await queries

### Frontend (React 18.2.0 + Axios)
**Entry Point: `client/src/index.js`**
- Renders main App component
- Uses React 18 `createRoot` API

**Main Component: `client/src/App.js`**
- Tab-based navigation
- Manages application state
- Integrates all child components

**Components:**
1. `Dashboard.js` - Statistics and overview
2. `ProductList.js` - Product table with CRUD operations
3. `AddProduct.js` - Product creation form
4. `DailyReport.js` - Report generation and display

### Database (MySQL 8.0)
**Schema:**
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

**Sample Data:**
- 8 pre-populated products
- Categories: Electronics, Furniture, Stationery
- Includes various stock levels for testing alerts

## Docker Network Architecture

```
Docker Host
    │
    ├── Port 3000 (Frontend) ──────┐
    ├── Port 5000 (Backend)  ──────┼─── inventory_network (bridge)
    └── Port 3306 (MySQL)    ──────┘
                                    │
                                    ├── inventory_frontend (nginx:alpine)
                                    ├── inventory_backend (node:18-alpine)
                                    └── inventory_mysql (mysql:8.0)
```

## Data Persistence

- **MySQL Data**: Stored in named volume `mysql_data`
- **Location**: Managed by Docker
- **Persistence**: Survives container restarts and removals
- **Backup**: Can be backed up using mysqldump

## Environment Variables

### Backend Container
- `PORT=5000` - Server port
- `DB_HOST=mysql` - MySQL host (Docker service name)
- `DB_USER=root` - Database user
- `DB_PASSWORD=rootpassword` - Database password
- `DB_NAME=inventory_db` - Database name

### MySQL Container
- `MYSQL_ROOT_PASSWORD=rootpassword` - Root password
- `MYSQL_DATABASE=inventory_db` - Database to create
- `MYSQL_USER=inventory_user` - Additional user
- `MYSQL_PASSWORD=inventory_pass` - User password

## Build Outputs

### Backend Container
- Approximately 150MB
- Contains:
  - Node.js runtime
  - Express and dependencies
  - MySQL2 client
  - Application code

### Frontend Container
- Approximately 50MB
- Contains:
  - Nginx web server
  - Built React app (static files)
  - Custom nginx configuration

### MySQL Container
- Approximately 500MB (official image)
- Total system size: ~700MB

## Development vs Production

### Development
- Run locally without Docker
- Use `npm start` for backend
- Use `npm run client` for frontend
- Requires local MySQL installation

### Production (Docker)
- Single command: `docker compose up --build -d`
- All services containerized
- Automatic health checks
- Data persistence
- Easy scalability

## Quick Start Commands

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove data
docker compose down -v

# Access specific service logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

## Testing the Deployment

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:5000/api/products
3. **MySQL**: Connect to localhost:3306 with credentials

## Maintenance

### Update Application
1. Make code changes
2. Rebuild specific service: `docker compose up --build -d [service-name]`
3. Or rebuild all: `docker compose up --build -d`

### Backup Database
```bash
docker compose exec mysql mysqldump -u root -prootpassword inventory_db > backup.sql
```

### Restore Database
```bash
docker compose exec -T mysql mysql -u root -prootpassword inventory_db < backup.sql
```

### View Container Status
```bash
docker compose ps
docker compose top
```

## Security Considerations

⚠️ **Important for Production:**
1. Change default passwords in `docker-compose.yml`
2. Use environment variables from `.env` file
3. Enable SSL/TLS
4. Implement rate limiting
5. Add authentication
6. Use Docker secrets for sensitive data
7. Regular security updates

## File Sizes

- `Dockerfile`: ~300 bytes
- `client/Dockerfile`: ~550 bytes
- `client/nginx.conf`: ~675 bytes
- `docker-compose.yml`: ~1.7KB
- `.dockerignore`: ~200 bytes
- Total Docker config: ~3.5KB

## Dependencies

### Backend (`package.json`)
- express: ^4.18.2
- cors: ^2.8.5
- mysql2: ^3.6.5
- body-parser: ^1.20.2

### Frontend (`client/package.json`)
- react: ^18.2.0
- react-dom: ^18.2.0
- react-scripts: 5.0.1
- axios: ^1.6.2

## License
ISC
